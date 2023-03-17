import React from 'react'
import { useState, useContext } from 'react'
import { AuthContext } from '../context/authContext'
import {useNavigate} from "react-router-dom"
import Menu from '../components/Menu';

const Login = () => {

    const [userInfo, setUserInfo] = useState(
        {
            name:'',
            password:'',
        }
    )

    const navigate = useNavigate()


    const [alert, setAlert] = useState('')

    const {login} = useContext(AuthContext)

    const updateUserInfo = (e)=>{
        setUserInfo(prev=>({...prev, [e.target.name]:e.target.value}))

        

    }
    const handleSubmit = async(e)=>{
        e.preventDefault()
        try{

            await login(userInfo)
            navigate("/")
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
            <h2>Přihlásit se</h2>
            <input placeholder='Uživatelské jméno' name='name' type="text" onChange={updateUserInfo}/>
            <input placeholder='Heslo' name='password' type="password" onChange={updateUserInfo}/>
            <button onClick={handleSubmit}>Přihlásit se</button>
            {alert && <p className='alert'>{alert}</p>}
        </form>
    </div>
    </>
  )
}

export default Login