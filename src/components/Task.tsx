import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { TaskModel } from "../models/taskModel";

const Task = ({ taskInfo }: { taskInfo: TaskModel }) => {
  const navigate = useNavigate();
  const [taskIsCompleated, setTaskIsCompleated] = useState<boolean>(
    taskInfo.compleated
  );

  const updateTask = async (
    compleated: boolean,
    inTime: boolean
  ): Promise<void> => {
    taskInfo.id &&
      (await updateDoc(doc(db, "tasks", taskInfo.id), {
        compleated,
        compleatedInTime: inTime,
      }));
  };

  const calculateTime = (): number => {
    const hours = new Date().getHours();
    const mins = new Date().getMinutes();
    return hours + mins / 60;
  };
  const hoursToTime = (timeInhours: number): string => {
    const hours = Math.floor(timeInhours);
    const minutes = Math.round((timeInhours - hours) * 60);
    return `${hours < 10 ? "0" : ""}${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes}`;
  };

  const setTaskColor = ():
    | {
        backgroundColor: string;
        textShadow?: string;
        color?: string;
      }
    | undefined => {
    const inTime = calculateTime() <= taskInfo.deadline;
    const timeWillBeSoon =
      calculateTime() > taskInfo.deadline - 0.5 &&
      calculateTime() < taskInfo.deadline;

    let taskColor: undefined | string;
    if (taskIsCompleated) {
      if (taskInfo.compleatedInTime || inTime) {
        // finished in time
        return {
          backgroundColor: "#339900",
          textShadow: "#ffd700 1px 0 15px",
          color: "#ffd700",
        };
        // finished late
      } else taskColor = "99cc33";
    } else {
      // not finished
      if (timeWillBeSoon) {
        taskColor = "ff9966";
      } else if (inTime) {
        // deadline will be soon
        taskColor = "fff";
        // not finished after deadline
      } else taskColor = "CC3333";
    }
    return {
      backgroundColor: `#${taskColor}`,
    };
  };
  const setTaskToComplete = (): void => {
    const inTime = calculateTime() <= taskInfo.deadline;
    const compleated = !taskIsCompleated;
    updateTask(compleated, inTime);
    setTaskIsCompleated((taskIsCompleated: boolean) => !taskIsCompleated);
  };
  return (
    <div style={setTaskColor()} className={"task"}>
      <div className="task-p">
        <div className="task-header">
          <div className="task-header-user-info">
            <div className="big-text">{taskInfo.name}</div>
          </div>
          <div className="flex-center-column">
            <div className="big-text">{hoursToTime(taskInfo.plannedTime)}</div>
            <div>{hoursToTime(taskInfo.deadline)}</div>
          </div>
          <div className="flex-center-column">
            <i
              onClick={() => navigate(`/new/${taskInfo.id}`)}
              className="fa-solid fa-gear"
            />
            <i
              onClick={setTaskToComplete}
              className={`${
                taskIsCompleated
                  ? "fa-sharp fa-regular fa-square-check"
                  : "far fa-square"
              }`}
            ></i>
          </div>
        </div>
        <p>{taskInfo.description}</p>
      </div>
    </div>
  );
};

export default Task;