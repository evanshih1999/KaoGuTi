import { useState,useEffect } from 'react';


import Login from "../Components/Login"
import Register from "../Components/Register"
import HaveLogin from '../Components/HaveLogin';


const LoginPage =({isLogin, memberName,setMemberName, setIsLogin, setMemberMail}) =>{
	
	const [loginOrRegister,setLoginOrRegister] = useState("login")
	return (
		<>
		{
		isLogin
		?
		<HaveLogin memberName={memberName}/>
		:
		<div className="login" style={{display: 'flex',  justifyContent:'center', alignItems:'top', height: '100vh'}}>
			{loginOrRegister === "login" 
				? 
				<Login setMemberName={setMemberName} setIsLogin={setIsLogin} setLoginOrRegister={setLoginOrRegister} setMemberMail={setMemberMail} ></Login>
				:
				<Register setLoginOrRegister={setLoginOrRegister}></Register>
			}
		</div>
		}
		</>
		)
}
export default LoginPage;