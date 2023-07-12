import React, { useEffect } from "react";
import { useState } from "react";
import Task from "../components/Task";
import ValidationMessage from "../components/ValidationMessage";
import Menu from "../components/Menu";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  DocumentData,
  DocumentSnapshot,
} from "firebase/firestore";
import { TaskModel } from "../models/taskModel";

function NewTaskForm() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [plannedTime, setPlannedTime] = useState<number>(0);
  const [deadline, setDeadline] = useState<number>(0);

  const [plannedTimeValidation, setPlannedTimeValidation] =
    useState<boolean>(false);
  const [deadlineValidation, setDealineValidation] = useState<boolean>(false);

  const [isNew, setIsNew] = useState<boolean>(true);

  const [conditions, setConditions] = useState<string[]>([]);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const clearInputs = (): void => {
      setName("");
      setDescription("");
      setPlannedTime(0);
      setDeadline(0);
      setIsNew(true);
      setConditions([]);
    };
    if (id) {
      getTask(id).then((docSnap) => {
        if (docSnap.exists()) {
          setIsNew(false);
          const taskData = docSnap.data();
          setName(taskData.name);
          setDescription(taskData.description);
          setPlannedTime(taskData.plannedTime);
          setDeadline(taskData.deadline);
          setConditions(taskData.conditions || []);
        } else {
          clearInputs();
        }
      });
    } else {
      clearInputs();
    }
  }, [id]);

  const getTask = async (
    id: string
  ): Promise<DocumentSnapshot<DocumentData>> => {
    const docRef = doc(db, "tasks", id);
    const docSnap = await getDoc(docRef);
    return docSnap;
  };
  const handleSubmit = (event: any): void => {
    event.preventDefault();
    if (plannedTime >= 0 && plannedTime < 24) {
      setPlannedTimeValidation(false);
    } else {
      setPlannedTimeValidation(true);
      return;
    }
    if (deadline >= 0 && deadline < 24 && plannedTime <= deadline) {
      setDealineValidation(false);
    } else {
      setDealineValidation(true);
      return;
    }

    const formData = {
      name,
      description,
      plannedTime,
      deadline,
      compleated: false,
      compleatedInTime: false,
      conditions: conditions.filter((condition) => condition !== ""),
    };
    if (isNew) {
      storeTask(formData);
    } else {
      updateTask(formData);
    }
  };

  const updateTask = async (task: TaskModel): Promise<void> => {
    if (!id) return;
    try {
      await updateDoc(doc(db, "tasks", id), {
        ...task,
      });
      alert("Úkol byl aktualizován");
      navigate("/routine-keeper");
    } catch {
      alert("Došlo k chybě");
    }
  };
  const storeTask = async (task: TaskModel): Promise<void> => {
    try {
      if (id) {
        await setDoc(doc(db, "tasks", id), {
          ...task,
          compleated: false,
          compleatedInTime: false,
        });
      } else {
        await addDoc(collection(db, "tasks"), {
          ...task,
          compleated: false,
          compleatedInTime: false,
        });
      }
      alert("Úkol byl vytvořen");
      navigate("/routine-keeper");
    } catch {
      alert("Došlo k chybě");
    }
  };

  const deleteTask = async () => {
    if (!id) return;
    if (window.confirm("Vážně chcete smazat tento úkol?")) {
      try {
        await deleteDoc(doc(db, "tasks", id));
        alert("Úkol byl úspěšně smazán");
        navigate("/routine-keeper");
      } catch {
        alert("Došlo k chybě");
      }
    }
  };

  const changeHoursInTime = (
    oldTime: number,
    newHours: number | string
  ): number => {
    if (oldTime || oldTime === 0) {
      return Number(newHours) + (oldTime % 1);
    } else {
      return Number(newHours);
    }
  };
  const changeMinutesInTime = (
    oldTime: number,
    newMins: number | string
  ): number => {
    if (oldTime || oldTime === 0) {
      return Number(newMins) / 60 + Math.floor(oldTime);
    } else {
      return Number(newMins) / 60;
    }
  };

  const calcHours = (time: number | undefined) => {
    return time && Math.floor(time) !== 0 ? Math.floor(time) : "";
  };
  const calcMins = (time: number | undefined) => {
    return time && time % 1 !== 0 ? Math.round((time % 1) * 60) : "";
  };

  const removeFromArrayByIndex = (array: string[], index: number): string[] => {
    return array.filter((item, i) => i !== index);
  };

  return (
    <>
      <div className="page-container">
        <header className="header">
          <Menu />
        </header>
        <form className="new-form" onSubmit={handleSubmit}>
          <div className="form-input">
            <label htmlFor="name">Název:</label>
            <input
              type="text"
              id="name"
              value={name}
              maxLength={25}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="form-input">
            <label htmlFor="description">Poznámka:</label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <div className="form-input">
            <label htmlFor="plannedTime">Naplánovaný čas:</label>
            <div className="time-input-container">
              <input
                type="number"
                className="time-input"
                placeholder="00"
                min={0}
                max={23}
                value={calcHours(plannedTime)}
                onChange={(e) => {
                  setPlannedTime((prevTime) =>
                    changeHoursInTime(prevTime, e.target.value)
                  );
                }}
              />
              <span>:</span>
              <input
                type="number"
                className="time-input"
                id="minute-input"
                placeholder="00"
                min={0}
                max={59}
                value={calcMins(plannedTime)}
                onChange={(e) =>
                  setPlannedTime((prevTime) =>
                    changeMinutesInTime(prevTime, e.target.value)
                  )
                }
              />
            </div>
            {plannedTimeValidation && (
              <ValidationMessage message="Zadej správnou hodnotu" />
            )}
          </div>
          <div className="form-input">
            <label htmlFor="deadline">Nejpozději do:</label>
            <div className="time-input-container">
              <input
                type="number"
                className="time-input"
                placeholder="00"
                min={0}
                max={23}
                value={calcHours(deadline)}
                onChange={(e) => {
                  setDeadline((prevTime) =>
                    changeHoursInTime(prevTime, e.target.value)
                  );
                }}
              />
              <span>:</span>
              <input
                type="number"
                className="time-input"
                id="minute-input"
                placeholder="00"
                min={0}
                max={59}
                value={calcMins(deadline)}
                onChange={(e) => {
                  setDeadline((prevTime) =>
                    changeMinutesInTime(prevTime, e.target.value)
                  );
                }}
              />
            </div>
            {deadlineValidation && (
              <ValidationMessage message="Zadej správnou hodnotu" />
            )}
          </div>
          <div className="task-preview">
            <div className="task-preview-overlay" />
            <Task
              taskInfo={{
                name,
                description,
                plannedTime: plannedTime ? plannedTime : 0,
                deadline,
                compleated: false,
                compleatedInTime: false,
              }}
            />
          </div>
          <div className="form-input">
            <label htmlFor="conditions">Podmínky k splnění:</label>
            {conditions.map((condition, index) => {
              return (
                <div key={index} className="condition">
                  <input
                    type="text"
                    id="condition"
                    maxLength={40}
                    value={condition}
                    onChange={(e) =>
                      setConditions((conditions) => {
                        const updatedConditions = [...conditions];
                        updatedConditions[index] = e.target.value;
                        return updatedConditions;
                      })
                    }
                  />
                  <i
                    onClick={() =>
                      setConditions((conditions) =>
                        removeFromArrayByIndex(conditions, index)
                      )
                    }
                    className="condition-delete-button fa-solid fa-trash"
                  />
                </div>
              );
            })}
            {conditions.length < 5 && (
              <div
                onClick={() =>
                  setConditions((conditions) => [...conditions, ""])
                }
                className="condition-add-button"
              >
                {"přidat podmínku"}
              </div>
            )}
          </div>

          <input className="form-submit" type="submit" value="Uložit" />
          {!isNew && (
            <input
              type="button"
              onClick={deleteTask}
              className="form-submit"
              value="Smazat"
            />
          )}
        </form>
      </div>
    </>
  );
}

export default NewTaskForm;
