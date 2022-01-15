import { React, useState, useEffect } from "react";
import './App.css';
import 'antd/dist/antd.min.css'
import {StepBackwardOutlined} from '@ant-design/icons'
import { Button, Menu } from "antd"
import ScrollToTop from "./Components/ScrollToTop";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Container/LoginPage";
import Navbar from "./Container/Navbar"
import SearchCourse from "./Container/SearchCourse";
import CoursePage from "./Container/CoursePage";

import CreateProblem from "./Container/CreateProblem";

import Cookie from "js.cookie";

function App() {

  const [isLogin, setIsLogin] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [memberMail, setMemberMail] = useState("");


  return (
    <div className="App">
      <Router>
        <div className="navbar">
          <Navbar memberName={memberName} isLogin={isLogin}
            setMemberName={setMemberName} setIsLogin={setIsLogin}
          />
        </div>
        <ScrollToTop>
          <Routes>
            <Route exact path="/" element={
              <div className="tc bg-white ma0 pa4 min-vh-100">
                <SearchCourse  setCourseName={setCourseName}/>
              </div>
            }
            />
            <Route path="/login"element={
              <div className="tc bg-white ma0 pa4 min-vh-100">
                <LoginPage isLogin={isLogin} memberName={memberName} setMemberName={setMemberName} setIsLogin={setIsLogin}setMemberMail={setMemberMail} />
              </div>
            }/>
            <Route path="/createProblem" element={
              <div className="tc bg-white ma0 pa4 min-vh-100" style={{display: 'flex',  justifyContent:'center', alignItems:'top', height: '100vh'}}>
                <CreateProblem courseName={courseName} setCourseName={setCourseName} username={memberName}/>
              </div>
            }/>
            <Route path="/problem" element={
              <div className="tc bg-white ma0 pa4 min-vh-100" >
                <CoursePage courseName={courseName} isLogin={isLogin} memberName={memberName}/>
              </div>
            }/>
          </Routes>
        </ScrollToTop>
      </Router>
    </div>
  );
}

export default App;
