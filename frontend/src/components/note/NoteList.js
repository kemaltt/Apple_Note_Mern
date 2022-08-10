import React, { useState, useEffect } from "react";
import { apiBaseUrl } from "../../api/api.js";
import AddNote from "./AddNote.js";
import { useNavigate } from "react-router-dom";

export default function NoteList({ token }) {
  const [notes, setNotes] = useState([]);
  let navigate = useNavigate();

  async function getNotes() {
    const result = await fetch(`${apiBaseUrl}/notes`);
    const notes = await result.json();
    setNotes(notes);
  }

  //   const getNotes = () => {
  //     fetch(`${apiBaseUrl}/notes`)
  //       .then((res) => res.json())
  //       .then((result) => {
  //         setNotes(result);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   };

  const deleteNote = (id) => {
    fetch(`${apiBaseUrl}/note/delete/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        token: `JWT ${token}`,
      },
      body: JSON.stringify({
        owner_id: id,
      }),
    })
      .then((res) => res.json())
      .then(() => setNotes((prevNotes) => [...prevNotes]));
    navigate("/", { replace: true });
    // .then((deletedNote) => setNotes(deletedNote))
    // .then(getNotes());
  };

  useEffect(() => {
    getNotes();
  }, []);

  console.log(notes);
  return (
    <div className="note_list">
      {notes.map &&
        notes.map((note, i) => (
          <div key={i} className="note_item">
            <h3>{note.title}</h3>
            <p>{note.content}</p>

            <button onClick={() => deleteNote(note._id)}>Delete note</button>
          </div>
        ))}
      <AddNote token={token} />
    </div>
  );
}
