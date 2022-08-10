import React, { useState, useEffect } from "react";
import { apiBaseUrl } from "../../api/api.js";
import { useNavigate } from "react-router-dom";

export default function DetailNote({
  id,
  i,
  deleteNote,
  title,
  content,
  token,
}) {
  const [notes, setNotes] = useState([]);
  const [editmode, setEditMode] = useState(false);
  const [detailTitle, setDetailTitle] = useState("");
  const [detailContent, setDetailContent] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    if (notes) {
      setDetailTitle(notes.title);
      setDetailContent(notes.content);
    }
  }, [notes]);

  const editNote = (id) => {
    fetch(`${apiBaseUrl}/note/edit/${id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        token: `JWT ${token}`,
      },
      body: JSON.stringify({
        id,
        title: detailTitle,
        content: detailContent,
      }),
    })
      .then((res) => res.json())
      .then(() => setNotes((prevNotes) => [...prevNotes]));
    navigate("/", { replace: true });
  };

  return (
    <div key={i} className="note_item">
      <h3>{title}</h3>
      <p>➥ {content}</p>
      <div className="buttons">
        <button className="delete_btn" onClick={() => deleteNote(id)}>
          Delete note
        </button>
        <button
          className="edit_btn"
          onClick={() => setEditMode((prev) => !prev)}
        >
          Edit Note
        </button>
      </div>
      {editmode && (
        <form className="edit_form">
          <h3 className="add_headline">Edit Note:</h3>

          <div className="edit_grid">
            <div>
              <label htmlFor="title">Your Note Title: </label>
              <input
                type="text"
                id="title"
                // value={title}
                onChange={(e) => setDetailTitle(e.target.value)}
                placeholder={title}
                required
              />
            </div>
            <div>
              <label htmlFor="content">Note Itself: </label>
              <input
                type="text"
                id="content"
                // value={content}
                onChange={(e) => setDetailContent(e.target.value)}
                placeholder={content}
                required
              />
            </div>
          </div>
          <button className="sub_btn" onClick={() => editNote(id)}>
            Submit Edit
          </button>
        </form>
      )}
    </div>
  );
}
