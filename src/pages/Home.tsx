import React, { useEffect } from "react";
import Task from "../components/Task";
import Header from "../components/Header";
import { useState } from "react";
import Menu from "../navigation/Menu";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { TaskModel } from "../models/taskModel";
import { Link } from "react-router-dom";

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
          conditions: task.data().conditions || [],
        });
      });
      tasksReset(tasksArray);
      setTasks(sortTasks(tasksArray));
      setFiltredTasks(sortTasks(tasksArray));
    });
  };
  const tasksReset = async (tasks: TaskModel[]) => {
    try {
      const docRef = doc(db, "date", "date");
      const snapshot = await getDoc(docRef);
      const data = snapshot.data();
      const dbDate = data?.date;
      const currentDate = new Date();
      const isNewDay =
        !dbDate || dbDate.toDate().getDate() !== currentDate.getDate();

      if (isNewDay) {
        const batch = writeBatch(db);
        tasks.forEach(async (task) => {
          if (task.id) {
            const taskRef = doc(db, "tasks", task.id);
            batch.update(taskRef, {
              compleated: false,
              compleatedInTime: false,
            });
          }
        });
        batch.set(doc(db, "date", "date"), {
          date: currentDate,
        });
        await batch.commit();
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
