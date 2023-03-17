import React, { useEffect } from 'react'
import Task from '../components/Task'
import Header from '../components/Header'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/authContext'
import Menu from '../components/Menu';

import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase/firebase'

const Home = () => {

  const [tasks, setTasks] = useState([])
    // const tasks = [
    //     {
    //       id: 1,
    //       name:'Pepa z Depa',
    //       description:'Ahoj jak se vede :)',
    //       plannedTime: 14.5,
    //       deadline: 15,
    //       compleated: false,
    //       compleatedInTime: false
    //     },
    //     {
    //       id: 2,
    //       name:'Nen9 z Depa',
    //       description:'Ahoj jak se vede Ty kokos :)',
    //       plannedTime: 6,
    //       deadline: 8,
    //       compleated: false,
    //       compleatedInTime: false

    //     },
    //     {
    //       id: 3,
    //       name:'alkjasojlk',
    //       description:'Ahoj jak se vede Ty kokos :)',
    //       plannedTime: 6,
    //       deadline: 7,
    //       compleated: true,
    //       compleatedInTime: true

    //     },
    //     {
    //       id: 4,
    //       name:'Nen9 z Depa',
    //       description:'Ahoj jak se vede Ty kokos :)',
    //       plannedTime: 18,
    //       deadline: 19.5,
    //       compleated: true,
    //       compleatedInTime: false
    //     },
    //   ]
      const getAllTasks = ()=>{
        getDocs(collection(db, 'tasks'))
        .then((res)=>{
          const tasksArray = []
          res.forEach(task =>{
            tasksArray.push({...task.data(), id: task.id })
          })
          setTasks(tasksArray)
          setFiltredTasks(tasksArray)
        })
      }

      useEffect(()=>{
        getAllTasks()
      }, [])

      const [filtredTasks, setFiltredTasks] = useState(tasks)

      const {user} = useContext(AuthContext)

      const [menuActive, setMenuActive]= useState(false)

      const toggleMenu = ()=>{
        setMenuActive((menuActive)=>!menuActive)
      }

      const sortTasks = (task)=>{
        task.sort((a, b) => {
          if (a.plannedTime !== b.plannedTime) {
            return a.plannedTime - b.plannedTime;
          } else {
            return a.deadline - b.deadline;
          }
        });
      }
      sortTasks(tasks)
  return (
    <>
      <Menu active = {menuActive}/>
      
      <div className='page-container'>
        <Header toggleMenu={toggleMenu} menuActive={menuActive} tasks={tasks} setFiltredTasks={setFiltredTasks}/>
        

        {filtredTasks?.length>0 && filtredTasks.map((task)=>{
          return <Task key={task.id} taskInfo = {task}/>
        })}

      </div>
        
      </>
  )
}

export default Home