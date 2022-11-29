import './App.css';
import Login from "./components/Login/login"
import Register from "./components/Register/register"
import User_home from "./components/User/user"
import Admin_home from "./components/Admin/admin"
import Create_Project from "./components/Project_Mgmt/create_project"
import Manage_Project_1 from "./components/Project_Mgmt_Manage/manage_project_1"
import Manage_Project_2 from "./components/Project_Mgmt_Manage/manage_project_2"
import Manage_Project_3 from "./components/Project_Mgmt_Manage/manage_project_3"
import Manage_Project_4 from "./components/Project_Mgmt_Manage/manage_project_4"
import Manage_Project_5 from "./components/Project_Mgmt_Manage/manage_project_5"
import View_Project from "./components/Project_Mgmt_View/view_project"
import Show_Project_Status from "./components/Project_Status/show_project_status"
import React, { useState } from "react"
import { BrowserRouter, Routes, Route} from "react-router-dom";

function App() {

  const [user, setLoginUser] = useState({}) 

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
         <Route exact path="/" element={user && user._id ? ((user.role == 0) ? <View_Project setLoginUser={setLoginUser}/> : <Admin_home setLoginUser={setLoginUser}/>) : <Login setLoginUser={setLoginUser}/>} />
         <Route path="/register" element={<Register />} />
         <Route path="/create_project" element={<Create_Project setLoginUser={setLoginUser}/>}/>
         <Route path="/manage_project_1" element={<Manage_Project_1 setLoginUser={setLoginUser}/>}/>
         <Route path="/manage_project_2" element={<Manage_Project_2 setLoginUser={setLoginUser}/>}/>
         <Route path="/manage_project_3" element={<Manage_Project_3 setLoginUser={setLoginUser}/>}/>
         <Route path="/manage_project_4" element={<Manage_Project_4 setLoginUser={setLoginUser}/>}/>
         <Route path="/manage_project_5" element={<Manage_Project_5 setLoginUser={setLoginUser}/>}/>
         <Route path="/view_project" element={<View_Project setLoginUser={setLoginUser}/>}/>
         <Route path="/show_project_status" element={<Show_Project_Status setLoginUser={setLoginUser}/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
