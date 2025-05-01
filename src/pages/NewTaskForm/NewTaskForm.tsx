import React, { useEffect } from "react";
import { useState } from "react";
import Task from "../../components/Task";
import ValidationMessage from "../../components/ValidationMessage";
import Menu from "../../navigation/Menu";
import { useNavigate, useParams } from "react-router-dom";
import { TaskModel, value } from "../../models/taskModel";
import axios from "axios";
import Conditions from "./Conditions/Conditions";
import { ConditionsType } from "./types/condition";
import "./NewTaskForm.css";
import Button from "../../components/Button";
interface TaskData {
  name: string;
  description: string;
  plannedTime: number;
  deadline: number;
  value: value;
  conditions: ConditionsType[];
}

function NewTaskForm() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [plannedTime, setPlannedTime] = useState<number>(0);
  const [deadline, setDeadline] = useState<number>(0);

  const [plannedTimeValidation, setPlannedTimeValidation] = useState<boolean>(false);
  const [deadlineValidation, setDealineValidation] = useState<boolean>(false);

  const [isNew, setIsNew] = useState<boolean>(true);
  const [value, setValue] = useState<value>(3);

  const [conditions, setConditions] = useState<ConditionsType[]>([]);

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
      setValue(1);
    };
    if (id) {
      getTask(id).then((taskData) => {
        if (taskData) {
          setIsNew(false);
          setName(taskData.name);
          setDescription(taskData.description);
          setPlannedTime(taskData.plannedTime);
          setDeadline(taskData.deadline);
          setConditions(taskData.conditions || []);
          setValue(taskData.value);
        } else {
          clearInputs();
        }
      });
    } else {
      clearInputs();
    }
  }, [id]);
  const getTask = async (id: string | undefined): Promise<TaskData | null> => {
    const response = await axios.get("http://localhost:8080/tasks/getTask", {
      params: {
        id,
      },
      withCredentials: true,
    });
    return response.data;
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
    if (
      conditions.some(
        (condition) =>
          condition.controled &&
          (condition.maximum === undefined ||
            condition.minimum === undefined ||
            condition.unit === undefined ||
            condition.minimum >= condition.maximum)
      )
    ) {
      return;
    }

    const formData = {
      name,
      description,
      plannedTime,
      deadline,
      compleated: false,
      compleatedInTime: false,
      conditions: conditions.filter((condition) => condition.name !== ""),
      value,
    };
    if (isNew) {
      storeTask(formData);
    } else {
      updateTask(formData);
    }
  };

  const updateTask = async (task: TaskModel): Promise<void> => {
    try {
      const response = await axios.put(
        "http://localhost:8080/tasks/updateTask",
        {
          id,
          taskData: task,
        },
        {
          withCredentials: true,
        }
      );
      alert(response.data);
      navigate("/routine-keeper");
    } catch (err: any) {
      alert(err.response.data);
    }
  };
  const storeTask = async (task: TaskModel): Promise<void> => {
    try {
      const response = await axios.post(
        "http://localhost:8080/tasks/storeTask",
        {
          taskData: task,
        },
        {
          withCredentials: true,
        }
      );
      alert(response.data);
      navigate("/routine-keeper");
    } catch (err: any) {
      alert(err.response.data);
    }
  };

  const deleteTask = async () => {
    if (window.confirm("Vážně chcete smazat tento úkol?")) {
      try {
        const response = await axios.delete("http://localhost:8080/tasks/deleteTask", {
          params: {
            id,
          },
          withCredentials: true,
        });
        alert(response.data);
        navigate("/routine-keeper");
      } catch (err: any) {
        alert(err.response.data);
      }
    }
  };

  const changeHoursInTime = (oldTime: number, newHours: number | string): number => {
    if (oldTime || oldTime === 0) {
      return Number(newHours) + (oldTime % 1);
    } else {
      return Number(newHours);
    }
  };
  const changeMinutesInTime = (oldTime: number, newMins: number | string): number => {
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

  const removeFromArrayByIndex = (array: ConditionsType[], index: number): ConditionsType[] => {
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
            <textarea id="description" value={description} onChange={(event) => setDescription(event.target.value)} />
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
                  setPlannedTime((prevTime) => changeHoursInTime(prevTime, e.target.value));
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
                onChange={(e) => setPlannedTime((prevTime) => changeMinutesInTime(prevTime, e.target.value))}
              />
            </div>
            {plannedTimeValidation && <ValidationMessage message="Zadej správnou hodnotu" />}
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
                  setDeadline((prevTime) => changeHoursInTime(prevTime, e.target.value));
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
                  setDeadline((prevTime) => changeMinutesInTime(prevTime, e.target.value));
                }}
              />
            </div>
            {deadlineValidation && <ValidationMessage message="Zadej správnou hodnotu" />}
          </div>
          <div className="form-input">
            <label htmlFor="value">Důležitost</label>
            <div>
              {[...Array(3)].map((_, index) => {
                let val = (index + 1) as value;
                return (
                  <label key={"vale" + index}>
                    <input type="radio" name="value" value={value} onClick={() => setValue(val)} />
                    <i className={`fa-${val <= value ? "solid" : "regular"} fa-star`} />
                  </label>
                );
              })}
            </div>
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
                conditions: [],
                value,
              }}
            />
          </div>
          <Conditions
            conditions={conditions}
            setConditions={setConditions}
            removeFromArrayByIndex={removeFromArrayByIndex}
          />
          <Button type="submit" value="Uložit" />
          {!isNew && <Button type="button" clickHandle={deleteTask} value="Smazat" />}
        </form>
      </div>
    </>
  );
}

export default NewTaskForm;
