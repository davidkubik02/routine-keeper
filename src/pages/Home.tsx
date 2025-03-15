import React, { useEffect } from "react";
import Task from "../components/Task";
import Header from "../components/Header";
import { useState } from "react";
import { TaskModel } from "../models/taskModel";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "../components/footer/Footer";

const Home = () => {
  const [tasks, setTasks] = useState<TaskModel[]>([]);

  const getAllTasks = async () => {
    const tasksArray = await axios.get("http://localhost:8080/tasks/getTasks", {
      withCredentials: true,
    });
    tasksReset();
    setTasks(sortTasks(tasksArray.data));
  };
  const tasksReset = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/tasks/resetTasks",
        null,
        {
          withCredentials: true,
        }
      );
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
      if (a.compleated !== b.compleated) {
        return a.compleated ? 1 : -1;
      } else if (a.plannedTime !== b.plannedTime) {
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

  const toggleTaskStatus = async (id: string | void): Promise<void> => {
    try {
      const response = await axios.put(
        "http://localhost:8080/tasks/toggleTaskStatus",
        {
          id,
        },
        {
          withCredentials: true,
        }
      );
      const compleated = response.data.compleated;
      setTasks((prev) => {
        return prev.map((task) =>
          task.id === id ? { ...task, compleated } : task
        );
      });
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <div className="page-container">
        <Header tasks={tasks} setFiltredTasks={setFiltredTasks} />

        {filtredTasks?.length > 0 &&
          filtredTasks.map((task: TaskModel) => {
            return (
              <Task
                key={task.id}
                taskInfo={task}
                toggleTaskStatus={toggleTaskStatus}
              />
            );
          })}
        <Link className="task new-task-button" to="/new">
          +
        </Link>
        <Footer
          taskAmount={tasks.length}
          finishedTaskAmount={getFinishedTaskAmount()}
        />
      </div>
    </>
  );
};

export default Home;
