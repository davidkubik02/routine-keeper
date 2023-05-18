import React, { useEffect } from "react";
import Task from "../components/Task";
import Header from "../components/Header";
import { useState } from "react";
import Menu from "../components/Menu";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { TaskModel } from "../models/taskModel";

const Home = () => {
  const [tasks, setTasks] = useState<TaskModel[]>([]);

  const getAllTasks = () => {
    getDocs(collection(db, "tasks")).then((res) => {
      const tasksArray: TaskModel[] = [];
      res.forEach((task) => {
        tasksArray.push({
          id: task.id,
          name: task.data().name,
          description: task.data().description,
          plannedTime: task.data().plannedTime,
          deadline: task.data().deadline,
          compleated: task.data().compleated,
          compleatedInTime: task.data().compleatedInTime,
        });
      });
      setTasks(sortTasks(tasksArray));
      setFiltredTasks(sortTasks(tasksArray));
    });
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  const [filtredTasks, setFiltredTasks] = useState<TaskModel[]>([]);

  const [menuActive, setMenuActive] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setMenuActive((menuActive) => !menuActive);
  };
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

  return (
    <>
      <Menu active={menuActive} />

      <div className="page-container">
        <Header
          toggleMenu={toggleMenu}
          menuActive={menuActive}
          tasks={tasks}
          setFiltredTasks={setFiltredTasks}
        />

        {filtredTasks?.length > 0 &&
          filtredTasks.map((task: TaskModel) => {
            return <Task key={task.id} taskInfo={task} />;
          })}
      </div>
    </>
  );
};

export default Home;
