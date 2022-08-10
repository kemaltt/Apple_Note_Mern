import React, { useState, useEffect } from "react";
import { apiBaseUrl } from "../../api/api.js";
import AddNote from "./AddNote.js";
import { useNavigate } from "react-router-dom";
import DetailNote from "./DetailNote.js";

export default function NoteList({ token }) {
  const [notes, setNotes] = useState([]);
  // const [replyCounter, setReplyCounter] = useState(0); // used to repload feed
  // const onPostReply = () => setReplyCounter((prev) => prev + 1);
  let navigate = useNavigate();

  async function getNotes() {
    const result = await fetch(`${apiBaseUrl}/notes`);
    const notes = await result.json();
    setNotes(notes);
  }

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
  };

  useEffect(() => {
    getNotes();
  }, []);

  console.log(notes);
  if (notes)
    return (
      <div className="note_list">
        <div className="notesmap">
          {notes.map &&
            notes.map((note, i) => (
              <DetailNote
                title={note.title}
                content={note.content}
                key={i}
                id={note._id}
                deleteNote={deleteNote}
                token={token}
              />
            ))}
        </div>
        <div className="addnewnote">
          <AddNote token={token} />
        </div>
      </div>
    );
}
