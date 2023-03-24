import React, { useState } from 'react'
import {useNavigate} from "react-router-dom"
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/firebase'


const Task = ({taskInfo}) => {

  const navigate = useNavigate()
  const [taskIsCompleated, setTaskIsCompleated] = useState(taskInfo.compleated)

  const updateTask = async (compleated, inTime)=>{
    await updateDoc(doc(db, "tasks", taskInfo.id), {
        compleated,
        compleatedInTime: inTime
    });
}

  const calculateTime= ()=>{
    const hours = new Date().getHours()
    const mins = new Date().getMinutes()
    return hours + mins/60
  }
  const hoursToTime = (timeInhours) => {
    const hours = Math.floor(timeInhours)
    const minutes = Math.round((timeInhours - hours) * 60)
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`
  }
  

  const setTaskColor = ()=>{
    const inTime = calculateTime()<=taskInfo.deadline
    if(taskIsCompleated){
      if(taskInfo.compleatedInTime || inTime){
        return 'task-finnished'
      }else return 'task-finnished-late'
    }
    else{
      return inTime?undefined:'task-not-finnished'
    }
  }
  const setTaskToComplete = ()=>{
    const inTime = calculateTime()<=taskInfo.deadline
    const compleated = !taskIsCompleated
    updateTask(compleated, inTime)
    setTaskIsCompleated((taskIsCompleated)=>!taskIsCompleated)

  }
  return (
    <div className={`task ${setTaskColor()}`}>
          <div className='task-p'>
              <div className='task-header'>
                <div className='task-header-user-info'>
                  <div className='big-text'>{taskInfo.name}</div>
                </div>
                <div className='flex-center-column'>
                  <div className='big-text'>{hoursToTime(taskInfo.plannedTime)}</div>
                  <div>{hoursToTime(taskInfo.deadline)}</div>
                </div>
                <div className='flex-center-column'>
                  <i onClick={()=>navigate(`/new/${taskInfo.id}`)} className="fa-solid fa-gear"/>
                  <i onClick={setTaskToComplete} className={`${taskIsCompleated?"fa-sharp fa-regular fa-square-check":"far fa-square"}`}></i>
                </div>
              </div>
              <p>{taskInfo.description}</p>
           </div>
        </div>
  )
}

export default Task