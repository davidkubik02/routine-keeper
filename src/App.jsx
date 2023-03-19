import './App.css';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import {Route, Routes, BrowserRouter} from "react-router-dom"
import NewTaskForm from './pages/NewTaskForm';


function App() {

  // const {user, logout} = useContext(AuthContext)
  // console.log(user)
  const basePath = "/reoutine-keeper"
  return (
    <BrowserRouter>
    <div>sahoidsahoidsa</div>
    <div>sahoidsahoidsa</div>
    <div>sahoidsahoidsa</div>
    <div>sahoidsahoidsa</div>
      {/* {user && <h1 onClick={logout}>{user.name}</h1>} */}
      <Routes>
        <Route path={basePath} element={<Home/>}/>
        <Route path={basePath+"/new"} element={<NewTaskForm/>}/>
        <Route path={basePath+"/new/:id"} element={<NewTaskForm/>}/>
        <Route path={basePath+"/login"} element={<Login/>}/>
        <Route path={basePath+"/register"} element={<Register/>}/>

      </Routes>
    
    </BrowserRouter>
  );
}

export default App;
