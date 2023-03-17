import { createContext, useEffect, useState } from "react";
import axios from "axios";
import React from "react";

export const AuthContext = createContext()

export const AuthContextProvider = ({children})=>{
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || null))

    const login = async (userInfo)=>{
        const res = await axios.post("http://localhost:8800/api/login", userInfo)
        setUser(res.data)
    }
    const logout = async ()=>{
        await axios.post("http://localhost:8800/api/logout")
        setUser(null)
    }

    useEffect(()=>{
        localStorage.setItem("user", JSON.stringify(user))
    }, [user])

    return(
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}