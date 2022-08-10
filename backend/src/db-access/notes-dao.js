const { ObjectId } = require("mongodb");
const { getDB } = require("./getDB");

function getNotes() {
  return getDB().then((db) => db.collection("noteData").find().toArray());
}
function getNoteById(id) {
  return getDB().then((db) =>
    db.collection("noteData").findOne({ _id: ObjectId(id) })
  );
}
function addNote(note) {
  return new Promise((resolve, reject) => {
    getDB()
      .then((db) => db.collection("noteData").insertOne(note))
      .then((result) => {
        if (result.acknowledged === true && result.insertedId) {
          return resolve({
            _id: result.insertedId,
            ...note,
          });
        } else {
          // result könnte ein error sein, daher reject...
          return reject(result);
        }
      })
      .catch((err) => reject(err));
  });
}

async function editNote(noteId, editedNote) {
  const db = await getDB();
  const result = await db.collection("noteData").findOneAndUpdate(
    { _id: ObjectId(noteId) },
    {
      $set: {
        title: editedNote.title,
        content: editedNote.content,
      },
    },
    { returnDocument: "after" }
  );
  if (!(result.ok === 1)) {
    throw new Error({ msg: "Error updating Note." });
  }
  return result.value;
}

function removeNote(noteId) {
  return new Promise((resolve, reject) => {
    getDB()
      .then((db) =>
        db.collection("noteData").findOneAndDelete({ _id: ObjectId(noteId) })
      )
      .then((result) => {
        if (result.ok === 1) resolve(result.value);
        else reject({ msg: "Error deleting todo." }); // custom error message ? oder vlt nur result
      })
      .catch((err) => reject(err));
  });
}

module.exports = {
  getNotes,
  addNote,
  removeNote,
  getNoteById,
  editNote,
};
