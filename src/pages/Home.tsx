import React, { useEffect } from "react";
import Task from "../components/Task";
import Header from "../components/Header";
import { useState } from "react";
import { TaskModel } from "../models/taskModel";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [tasks, setTasks] = useState<TaskModel[]>([]);

  const getAllTasks = async () => {
    const tasksArray = await axios.get("http://localhost:8080/tasks/getTasks", {
      withCredentials: true,
    });
    tasksReset();
    setTasks(sortTasks(tasksArray.data));
    setFiltredTasks(sortTasks(tasksArray.data));
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

  return (
    <>
      <div className="page-container">
        <Header tasks={tasks} setFiltredTasks={setFiltredTasks} />

        {filtredTasks?.length > 0 &&
          filtredTasks.map((task: TaskModel) => {
            return <Task key={task.id} taskInfo={task} />;
          })}
        <Link className="task new-task-button" to="/new">
          +
        </Link>
      </div>
    </>
  );
};

export default Home;
