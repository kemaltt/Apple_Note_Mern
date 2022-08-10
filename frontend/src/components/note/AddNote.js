import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiBaseUrl } from "../../api/api.js";

export default function AddNote({ token }) {
  let navigate = useNavigate();
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
    setTitle("");
    setContent("");
    navigate("/", { replace: true });
  };

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
            cols="30"
            rows="10"
            placeholder="Note here..."
          ></textarea>
        </div>
        <button className="sub_btn" onClick={addNote}>
          Add Note
        </button>
      </form>
    </div>
  );
}
