import React from 'react'
import { Link } from 'react-router-dom'

function Menu({active}) {


  return (
    <nav className={`menu ${active?'menu-active':undefined}`}>
        <Link className='menu-button' to='/reoutine-keeper'>Úkoly</Link>
        <Link className='menu-button' to='/new'>Vytvořit nový</Link>
        <Link className='menu-button' to='/login'>Přihlásit se</Link>
        <Link className='menu-button' to='/register'>Zaregistrovat se</Link>
    </nav>
  )
}

export default Menu