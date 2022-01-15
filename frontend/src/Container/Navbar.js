import { message, Space} from "antd"
import { Link } from "react-router-dom";
import { useState } from "react";
import Cookies from "js.cookie"
import instance from "../api";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from "@mui/material/Button";
import logo from '../logo2.png'
import AccountCircle from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import LogoutIcon from '@mui/icons-material/Logout';

import { width } from "@mui/system";
import { ThemeProvider, createTheme } from '@mui/material/styles';


const Navbare = ({memberName, isLogin, setMemberName, setIsLogin}) => {

    const onClick_Logout = async () => {
        // const result = await logoutCheck();
        await handleLogout()
        setIsLogin(false)
        setMemberName('')
        Cookies.remove("memberName");
    }

    const displayStatus = (payload) => {
		if (payload.msg) {
			const { type, msg } = payload
			const content = { content: msg, duration: 0.5 }
			switch (type) {
				case 'success':
					message.success(content)
					break
				case 'error':
				default:
					message.error(content)
					break
		  }
		}
	}

    const handleLogout = async () => {
        try {
            const {
                data: { msg },
            } = await instance.post('/user/logout');
            console.log(msg);
            if (msg == 'Wrong cookie token') {
                displayStatus({
                    type: "error",
                    msg: msg,
                });
            }
            else {
                displayStatus({
                    type: "success",
                    msg: msg,
                });
            }
            
        }
        catch (error) {
            // console.error(error)
            console.log(error.response.data.msg)
            displayStatus({
                type: "error",
                msg: error.response.data.msg,
            });
        }
    }

    return (
    <>
        <Box sx={{ flexGrow: 1 }}>
            <ThemeProvider theme={darkTheme}>
            <AppBar position="static" enableColorOnDark>
                <Toolbar>
                <div style={{width:"40%", justifyContent:"left", display:"flex"}}>
                    <Link to="/" >
                        <img src={logo} style={{width:"113px", height:"70px"}}/>
                    </Link>
                </div>


                <div style={{width:"20%"}}>

                    <Typography variant="h3" component="div" sx={{ flexGrow: 1 }} style={{justifyContent:'center'}}>
                        KaoGuTi
                    </Typography>

                </div>
                {/* {isLogin ?

                <>
                    <Link to="/createProblem" style={{ textDecoration: "none" ,color:"white", paddingRight: "6px"}}> 
                        <Button >
                            創建問題 
                        </Button>
                    </Link>
                    <Space>
                    <Button onClick={onClick_Logout}> 登出 </Button>
                    </Space>
                </>

                :
                <Link to="/login" style={{ textDecoration: "none" ,color:"white"}}>
                    <Button>
                    登入 / 註冊
                    </Button>
                    </Link>
                } */}
                {
                isLogin?


                <div style={{display:"flex", justifyContent:'right', width:"40%"}}>
                    <div style={{display:"flex",justifyContent:'right', alignItems:"center"}}>
                        <Link to="/createProblem" style={{ textDecoration: "none" ,color:"white"}}> 
                            <Button variant="contained" startIcon={<AddCircleIcon />} color="primary">
                                新增題目
                            </Button>
                        </Link>
                    </div>
                    <div style={{display:"flex",justifyContent:'right', alignItems:"center", marginLeft:"10px"}}>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} color="white" style={{display:"flex",justifyContent:'right', alignItems:"center"}}>
                            Hi! {memberName}
                        </Typography>
                    </div>
                    <Link to='/'>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="logout"
                            aria-haspopup="true"
                            onClick={onClick_Logout}

                        >
                            <LogoutIcon color="white" />
                        </IconButton>
                    </Link>
                </div>
                :
                <div style={{display:"flex", justifyContent:'right', width:"40%"}}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} color="white" style={{display:"flex",justifyContent:'right', alignItems:"center"}}>
                        登入
                    </Typography>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Link to="/login">
                            <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-haspopup="true"
                            >
                            <AccountCircle />
                            </IconButton>
                        </Link>
                    </Box>
                </div>
                }
                </Toolbar>

                
            </AppBar>
            </ThemeProvider>
        </Box>
    </>
    )
};

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
      },
    },
  });

export default Navbare;