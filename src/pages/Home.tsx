import React, { useEffect } from "react";
import Task from "../components/Task";
import Header from "../components/Header";
import { useState } from "react";
import { TaskModel } from "../models/taskModel";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "../components/footer/Footer";
import { ConditionsType } from "./NewTaskForm/types/condition";

const Home = () => {
  const [tasks, setTasks] = useState<TaskModel[]>([]);

  const getAllTasks = async () => {
    const tasksArray = await axios.get("/tasks/getTasks", {
      withCredentials: true,
    });
    tasksReset();
    setTasks(sortTasks(tasksArray.data));
  };
  const tasksReset = async () => {
    try {
      const response = await axios.post("/tasks/dailyReset", null, {
        withCredentials: true,
      });
      if (response.data) {
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  useEffect(() => {
    setFiltredTasks(sortTasks(tasks));
  }, [tasks]);

  const [filtredTasks, setFiltredTasks] = useState<TaskModel[]>([]);
  const sortTasks = (tasks: TaskModel[]): TaskModel[] => {
    return tasks.sort((a, b) => {
      if (a.plannedTime !== b.plannedTime) {
        return a.plannedTime - b.plannedTime;
      } else {
        return a.deadline - b.deadline;
      }
    });
  };

  const getFinishedTaskAmount = (): number => {
    let finishedTaskAmount = 0;
    tasks.forEach((task) => {
      if (task.compleated) finishedTaskAmount++;
    });
    return finishedTaskAmount;
  };

  const toggleTaskStatus = async (id: string, conditions: ConditionsType[] | undefined): Promise<void> => {
    try {
      const response = await axios.put(
        "/tasks/toggleTaskStatus",
        {
          id,
          conditions,
        },
        {
          withCredentials: true,
        }
      );
      const compleated = response.data.compleated;
      setTasks((prev) => {
        return prev.map((task) => (task.id === id ? { ...task, compleated } : task));
      });
    } catch (err) {
      alert(err);
    }
  };

  const evaluateTasks = async () => {
    if (!window.confirm("Vážně chcš vyhodnotit úkol?")) {
      return;
    }
    try {
      const response = await axios.post(
        "/evaluation",
        {},
        {
          withCredentials: true,
        }
      );
      if (response.data.avilable) {
        const newRewardName = window.prompt(
          "Dobrá práce, máš nárok na odměnu!                                                 Zadej popis odměny:"
        );
        if (newRewardName !== null) {
          await addReward(newRewardName);
        } else {
          return;
        }
      } else {
        window.alert("Nemáš nárok na odměnu!");
      }
    } catch (error) {
      alert(error);
    }
  };
  const addReward = async (description: string) => {
    try {
      const response = await axios.post(
        "/evaluation/addReward",
        { description },
        {
          withCredentials: true,
        }
      );
      alert(response.data);
      window.location.reload();
    } catch (err) {
      alert(err);
    }
  };

  const resetTasks = async () => {
    try {
      const response = await axios.post(
        "/tasks/resetTasks",
        {},
        {
          withCredentials: true,
        }
      );
      alert(response.data);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="page-container">
        <Header tasks={tasks} setFiltredTasks={setFiltredTasks} />

        {filtredTasks?.length > 0 &&
          filtredTasks.map((task: TaskModel) => {
            return <Task key={task.id} taskInfo={task} toggleTaskStatus={toggleTaskStatus} />;
          })}
        <Link className="task new-task-button" to="/new">
          +
        </Link>
        <Footer
          evaluationHandle={evaluateTasks}
          resetHandle={resetTasks}
          taskAmount={tasks.length}
          finishedTaskAmount={getFinishedTaskAmount()}
        />
      </div>
    </>
  );
};

export default Home;
