import React, { useState } from "react";
import { apiBaseUrl } from "../../api/api.js";

export default function AddNote({ token }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [owner, setOwner] = useState("");

  const [feedback, setFeedback] = useState("Add a new Note!");

  const addNote = (e) => {
    e.preventDefault();
    console.log(title);
    console.log(content);

    fetch(`${apiBaseUrl}/notes/add`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        token: `JWT ${token}`,
      },
      body: JSON.stringify({
        owner,
        title,
        content,
      }),
    })
      .then((res) => res.json())
      .then(() => setFeedback(`New note added to database!`));
  };

  useEffect(() => {
    getNotes();
  }, [notes]);

  return (
    <div>
      <h2 className="add_headline">{feedback}</h2>
      <form action="">
        <div>
          <input
            type="text"
            placeholder="Add title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <textarea
            onChange={(e) => setContent(e.target.value)}
            value={content}
            name=""
            id=""
            cols="50"
            rows="30"
            placeholder="Note here..."
          ></textarea>
        </div>
        <button className="add_btn" onClick={addNote}>
          Add Note
        </button>
      </form>
    </div>
  );
}
