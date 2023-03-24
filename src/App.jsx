import './App.css';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import {Route, Routes, BrowserRouter} from "react-router-dom"
import NewTaskForm from './pages/NewTaskForm';


function App() {

  // const {user, logout} = useContext(AuthContext)
  // console.log(user)
  return (
    <BrowserRouter>
      {/* {user && <h1 onClick={logout}>{user.name}</h1>} */}
      <Routes>
        <Route path="/reoutine-keeper" element={<Home/>}/>
        <Route path="/new" element={<NewTaskForm/>}/>
        <Route path="/new/:id" element={<NewTaskForm/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>

      </Routes>
    
    </BrowserRouter>
  );
}

export default App;
