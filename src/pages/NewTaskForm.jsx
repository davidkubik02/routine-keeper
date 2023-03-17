import React, { useEffect } from 'react'
import { useState } from 'react';
import Task from '../components/Task';
import ValidationMessage from '../components/ValidationMessage';
import Menu from '../components/Menu';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { collection, addDoc, getDoc, doc, updateDoc, setDoc } from 'firebase/firestore';

function NewTaskForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [plannedTimeHours, setPlannedTimeHours] = useState('');
  const [plannedTimeMins, setPlannedTimeMins] = useState('');

  const [deadlineHours, setDeadlineHours] = useState('');
  const [deadlineMins, setDeadlineMins] = useState('');

  const [plannedTimeValidation, setPlannedTimeValidation] = useState(false)
  const [deadlineValidation, setDealineValidation] = useState(false)

  const [isNew, setIsNew] = useState(true)
  const {id} = useParams()

  useEffect(() => {
    const clearInputs = ()=>{
      setName("")
      setDescription("")
      setPlannedTimeHours("")
      setPlannedTimeMins("")
      setDeadlineHours("")
      setDeadlineMins("")
      setIsNew(true)
    }
    if(id){
      getTask(id).then((docSnap)=>{
        if (docSnap.exists()) {
          setIsNew(false)
          const taskData = docSnap.data()
          setName(taskData.name)
          setDescription(taskData.description)
          const plannedTimeInHours = Math.floor(taskData.plannedTime)
          const plannedTimeInMinutes = Math.round((taskData.plannedTime - plannedTimeInHours) * 60)
          setPlannedTimeHours(plannedTimeInHours)
          setPlannedTimeMins(plannedTimeInMinutes)
          const deadlineTimeInHours = Math.floor(taskData.deadline)
          const deadlineTimeInMinutes = Math.round((taskData.deadline - deadlineTimeInHours) * 60)
          setDeadlineHours(deadlineTimeInHours)
          setDeadlineMins(deadlineTimeInMinutes)
        } else {
          clearInputs();
        }
      })    
    }
    else{
      clearInputs()
    }
  }, [id])

  const getTask = async (id)=>{
    const docRef = doc(db, "tasks", id);
    const docSnap = await getDoc(docRef)
    return docSnap
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const plannedTimeInHours = timeToHours(plannedTimeHours, plannedTimeMins);
    const deadlineInHours = timeToHours(deadlineHours, deadlineMins);
    if(plannedTimeInHours>0 && plannedTimeInHours<24){
      setPlannedTimeValidation(false)
    }else {
      setPlannedTimeValidation(true)
      return
    }
    if(deadlineInHours>0 && deadlineInHours<24 && plannedTimeInHours<=deadlineInHours){
      setDealineValidation(false)
    }else {
      setDealineValidation(true)
      return
    }
    const formData = {
      name,
      description,
      plannedTime: plannedTimeInHours,
      deadline: deadlineInHours
    };
    if(isNew){
      storeTask(formData)
    }
    else{
      updateTask(formData)
    }
    
    
  };

  const updateTask = async (task)=>{
      await updateDoc(doc(db, "tasks", id), {
        ...task
      });
    
  }
  const storeTask = async (task)=>{
    if(id){
      await setDoc(doc(db, "tasks",id), {
        ...task,
        compleated: false,
        compleatedInTime: false
      });
    }else{
      await addDoc(collection(db, "tasks"), {
        ...task,
        compleated: false,
        compleatedInTime: false
      });
    }
    
  }
  const timeToHours = (hours, minutes) => {
    return Number(hours) + Number(minutes) / 60;
  };

  const [menuActive, setMenuActive]= useState(false)

  const toggleMenu = ()=>{
    setMenuActive((menuActive)=>!menuActive)
  }

  return (
    <>
      <Menu active = {menuActive}/>

    <div className='page-container'>
    <header className='header'>
      <div/>
      <i onClick={toggleMenu} className={`${menuActive?'fa-solid fa-xmark':'fa-solid fa-bars'}`}/>
    </header>
    <form className='new-form' onSubmit={handleSubmit}>
      <div className='form-input'>
        <label htmlFor="name">Název:</label>
        <input
          type="text"
          id="name"
          value={name}
          maxLength={9}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div className='form-input'>
        <label htmlFor="description">Popis:</label>
        <input
          type="text"
          id="description"
          value={description}
          maxLength={15}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <div className='form-input'>
        <label htmlFor="plannedTime">Naplánovaný čas:</label>
        <div className="time-input-container">
      <input
        type="text"
        className="time-input"
        placeholder="00"
        value={plannedTimeHours}
        onChange={(e)=>setPlannedTimeHours(e.target.value)}
        maxLength={2}
      />
      <span>:</span>
      <input
        type="text"
        className="time-input"
        id="minute-input"
        placeholder="00"
        value={plannedTimeMins}
        onChange={(e)=>setPlannedTimeMins(e.target.value)}
        maxLength={2}
      />
    </div>
      {plannedTimeValidation && <ValidationMessage message="Zadej správnou hodnotu"/>}
      </div>
      <div className='form-input'>
        <label htmlFor="deadline">Nejpozději do:</label>
        <div className="time-input-container">
      <input
        type="text"
        className="time-input"
        placeholder="00"
        value={deadlineHours}
        onChange={(e)=>setDeadlineHours(e.target.value)}
        maxLength={2}
      />
      <span>:</span>
      <input
        type="text"
        className="time-input"
        id="minute-input"
        placeholder="00"
        value={deadlineMins}
        onChange={(e)=>setDeadlineMins(e.target.value)}
        maxLength={2}
      />
    </div>
    {deadlineValidation && <ValidationMessage message="Zadej správnou hodnotu"/>}
      </div>
      <div className='task-preview'>
        <div className='task-preview-overlay'/>
        <Task taskInfo={{
        name,
        description,
        plannedTime: timeToHours(plannedTimeHours, plannedTimeMins),
        deadline: timeToHours(deadlineHours, deadlineMins)
      }}/>
      </div>
      <button className='form-submit' type="submit">Uložit</button>
    </form>
    </div>
    </>
  );
};

export default NewTaskForm