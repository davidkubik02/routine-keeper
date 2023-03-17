import React from 'react'
import { useRef } from 'react'
import { useState } from 'react'

const Header = ({setFiltredTasks, tasks, toggleMenu, menuActive}) => {


  const searchRef = useRef(null)

  const filterTaskHandle = (e)=>{
    if(!e.target.value){
      setFiltredTasks(tasks)
      return
    }
    const filtredUsers = tasks.filter((task)=>{
      return task.name.toLowerCase().includes(e.target.value.toLowerCase())
    })
    setFiltredTasks(filtredUsers)
  }
  

  const clearInput = ()=>{
    setFiltredTasks(tasks)
    searchRef.current.value = ''
    searchRef.current.focus()
  }


  return (
    <header className='header'>
    <div className='search'>
          <div className='search-inputs'>
            <i className="fa-solid fa-magnifying-glass"/>
            <input ref={searchRef} onChange={filterTaskHandle} className='search-input' type="text"  placeholder='Hledat'/>
            <i onClick={clearInput} className="fa-solid fa-circle-xmark"/>
          </div>
        </div>
        <i onClick={toggleMenu} className={`${menuActive?'fa-solid fa-xmark':'fa-solid fa-bars'}`}/>
      </header>
  )
}

export default Header