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

const LOCALSTORAGE_KEY = "save-me";
const LOCALSTORAGE_KEY_COURSE = "save-course";

function App() {

  const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);
  const savedCourse = localStorage.getItem(LOCALSTORAGE_KEY_COURSE);
  const [isLogin, setIsLogin] = useState(false);
  const [memberName, setMemberName] = useState(savedMe || '');
  const [courseName, setCourseName] = useState(savedCourse || '');
  const [memberMail, setMemberMail] = useState("");

  useEffect(() => {
    if (isLogin) {
      localStorage.setItem(LOCALSTORAGE_KEY, memberName);
    }
    else {
      localStorage.setItem(LOCALSTORAGE_KEY, '');
    }
  }, [isLogin, memberName]);

  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEY_COURSE, courseName);
  }, [courseName]);
  
  useEffect(() => {
    if (savedMe !== '') {
      setIsLogin(true);
    }
  }, []);

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
