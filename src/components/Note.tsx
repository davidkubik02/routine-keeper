import React, { useState } from "react";
import { TaskModel } from "../models/taskModel";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

function Note({ taskInfo, id }: { taskInfo: TaskModel; id: string }) {
  const [active, setActive] = useState<boolean>(false);
  const [unsaved, setUnsaved] = useState<boolean>(false);
  const [note, setNote] = useState<string>(taskInfo.description);

  const toggleNote = () => {
    if (active && unsaved) {
      if (window.confirm("Poznámka nebyla uložena, chcete ji uložit?")) {
        saveNote();
      }
    }
    setActive((active) => !active);
  };

  const saveNote = async (): Promise<void> => {
    try {
      await updateDoc(doc(db, "tasks", id), {
        description: note,
      });
    } catch (err) {
      alert(err);
      return;
    }
    setUnsaved(false);
  };

  return (
    <>
      <i className="fa-solid fa-file-lines note-icon" onClick={toggleNote} />
      {active && <div className="overlay" onClick={toggleNote} />}
      {active && (
        <div className="note">
          <h3 className="task-note-title">{taskInfo.name}</h3>
          <i className="fa-solid fa-x note-close" onClick={toggleNote} />
          <div className="note-save" onClick={saveNote}>
            {unsaved && <div className="note-unsave-alert" />}
            <i className="fa-solid fa-floppy-disk " />
          </div>
          <textarea
            onChange={(e: any) => {
              !unsaved && setUnsaved(true);
              setNote(e.target.value);
            }}
            className="note-textarea"
            value={note}
          />
        </div>
      )}
    </>
  );
}

export default Note;
