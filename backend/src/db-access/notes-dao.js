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

// function toggleTodoDone(todoId, newDoneValue) {
//   return new Promise((resolve, reject) => {
//     getDB()
//       .then((db) =>
//         db.collection("todos2").findOneAndUpdate(
//           { _id: ObjectId(todoId) }, // query/filter (aka. was soll geupdated werden?)
//           { $set: { done: newDoneValue } }, // updateInfo
//           { returnDocument: "after" }
//         )
//       )
//       .then((result) => {
//         if (result.ok === 1) resolve(result.value);
//         else reject({ msg: "Error updating todo." }); // custom error message ? oder vlt nur result
//       })
//       .catch((err) => reject(err));
//   });
// }

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
};
