import React from 'react'
import { Link } from 'react-router-dom'

function Menu({active}) {


  const basePath = "/reoutine-keeper"
  return (
    <nav className={`menu ${active?'menu-active':undefined}`}>
        <Link className='menu-button' to={basePath}>Úkoly</Link>
        <Link className='menu-button' to={basePath+'/new'}>Vytvořit nový</Link>
        <Link className='menu-button' to={basePath+'/login'}>Přihlásit se</Link>
        <Link className='menu-button' to={basePath+'/register'}>Zaregistrovat se</Link>
    </nav>
  )
}

export default Menu