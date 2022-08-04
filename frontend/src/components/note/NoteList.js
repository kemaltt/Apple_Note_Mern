import React, { useState, useEffect } from "react";
import { apiBaseUrl } from "../../api/api.js";

export default function NoteList() {
  const [notes, setNotes] = useState([]);
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

  useEffect(() => {
    getNotes();
  }, []);

  console.log(notes);
  return (
    <div className="note_list">
      {notes.map((note, i) => (
        <div key={i} className="note_item">
          <h3>{note.title}</h3>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
}
