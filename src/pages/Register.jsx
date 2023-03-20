import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import Menu from '../components/Menu';

const Register = () => {

    const [userInfo, setUserInfo] = useState(
        {
            name:'',
            password:'',
            repeatPassword:'',
        }
    )

    const navigate = useNavigate()

    const [alert, setAlert] = useState('')
    const updateUserInfo = (e)=>{
        setUserInfo(prev=>({...prev, [e.target.name]:e.target.value}))

        

    }
    const handleSubmit = async(e)=>{
        e.preventDefault()

        if(userInfo.repeatPassword !== userInfo.password){
            setAlert('Hesla musí být stejné')
            return
        }else setAlert('')
        try{

            await axios.post("http://localhost:8800/api/register", userInfo)
            navigate("/login")
        }catch(err){
            setAlert(err.response.data)
        }
    }

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
        <form className='auth-form'>
            <h2>Zaregistruj se</h2>
            <input placeholder='Uživatelské jméno' name='name' type="text" onChange={updateUserInfo}/>
            <input placeholder='Heslo' name='password' type="password" onChange={updateUserInfo}/>
            <input placeholder='Heslo znovu' name='repeatPassword' type="password" onChange={updateUserInfo}/>
            <button onClick={handleSubmit}>Zaregistrovat se</button>
            {alert && <p className='alert'>{alert}</p>}
        </form>
    </div>
    </>
  )
}

export default Register