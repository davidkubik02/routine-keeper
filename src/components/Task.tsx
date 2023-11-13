import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TaskModel } from "../models/taskModel";
import Note from "./Note";
import Conditions from "./Conditions";
import axios from "axios";

const Task = ({ taskInfo }: { taskInfo: TaskModel }) => {
  const navigate = useNavigate();
  const [taskIsCompleated, setTaskIsCompleated] = useState<boolean>(
    taskInfo.compleated
  );

  const toggleTaskStatus = async (): Promise<{
    compleated: boolean;
  } | void> => {
    try {
      const response = await axios.put(
        "http://localhost:8080/tasks/toggleTaskStatus",
        {
          id: taskInfo.id,
        },
        {
          withCredentials: true,
        }
      );
      const compleated = response.data.compleated;
      return { compleated };
    } catch (err) {
      alert(err);
    }
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

  const setTaskColor = (): { backgroundColor: string } => {
    const inTime =
      calculateTime() <=
      (taskInfo.deadline === 0 ? Infinity : taskInfo.deadline);
    const taskTime =
      calculateTime() >= taskInfo.plannedTime &&
      calculateTime() <=
        (taskInfo.deadline === 0 ? Infinity : taskInfo.deadline);
    let taskColor: string;
    if (taskIsCompleated) {
      if (taskInfo.compleatedInTime || inTime) {
        // finished in time
        taskColor = "32ff32";
        // finished late
      } else taskColor = "e2ffb6";
    } else {
      // not finished
      if (taskTime) {
        taskColor = "ffe6b6";
      } else if (inTime) {
        // deadline will be soon
        taskColor = "fff";
        // not finished after deadline
      } else taskColor = "ffacb6";
    }

    return {
      backgroundColor: `#${taskColor}`,
    };
  };

  const [conditionWindowOpen, setConditionWindowOpen] = useState(false);

  const setTaskToComplete = async (): Promise<void> => {
    const compleatedStatus = await toggleTaskStatus();
    if (compleatedStatus) {
      setTaskIsCompleated(() => {
        taskInfo.compleated = compleatedStatus.compleated;
        return compleatedStatus.compleated;
      });
    }
  };

  const validateConditions = () => {
    if (taskInfo.conditions.length && !taskIsCompleated) {
      setConditionWindowOpen(true);
    } else setTaskToComplete();
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
            <div>
              {taskInfo.deadline !== 0
                ? hoursToTime(taskInfo.deadline)
                : "Bez časového omezení"}
            </div>
          </div>
          <div className="flex-center-column">
            <i
              onClick={() => navigate(`/new/${taskInfo.id}`)}
              className="fa-solid fa-gear"
            />
            <input
              className="checkbox"
              type="checkbox"
              checked={taskIsCompleated}
              onChange={validateConditions}
            />
          </div>
        </div>
        {taskInfo.id !== undefined && (
          <Note taskInfo={taskInfo} id={taskInfo.id} />
        )}
        {conditionWindowOpen && (
          <Conditions
            conditionsValidation={setTaskToComplete}
            closeConditions={() => setConditionWindowOpen(false)}
            conditions={taskInfo.conditions}
          />
        )}
      </div>
    </div>
  );
};

export default Task;
