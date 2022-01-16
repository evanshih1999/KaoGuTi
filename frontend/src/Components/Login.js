import { useState } from 'react';
import { Form, Input, Button, Checkbox, Space, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { link, Redirect } from '@uiw/react-md-editor';
// import { getMail, loginCheck } from '../api/User';
import instance from '../api';
import sha256 from 'crypto-js/sha256'
import { Link } from 'react-router-dom';


const Login = ({ setMemberName, setIsLogin, setLoginOrRegister, setMemberMail, islogin }) => {
	const [username, setUsername] = useState("initialState");
	const [password, setPassword] = useState("initialState");

	const Submit = async (values) => {
		let msg = await handleLogin();
		// console.log(msg)
		if (msg === "Success!") {
			displayStatus({
				type: "success",
				msg: msg,
			});
			setIsLogin(true);
			setMemberName(values.username);
		}
		else {
			// alert(msg)
			displayStatus({
				type: "error",
				msg: msg,
			});
		}
	};

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

	const handleLogin = async () => {
        if (username.length === 0) {
            alert("You have to fill in your username!")
            return
        }
        if (password.length === 0) {
            alert("You have to fill in your password!")
            return
        }
        if (username.length > 0 && password.length > 0) {
            const hashDigest = sha256(password)
			let hash = ''
			for (let i=0; i<hashDigest.words.length; i++) {
				hash += hashDigest.words[i].toString()
			}
			// console.log(hash)
			try {
                const {
                    data: { msg },
                } = await instance.post('/user/login', {
                    username,
                    password: hash
                });
                // console.log(msg);
				return msg;
            }
            catch (error) {
                // console.error(error)
                // console.log(error.response.data.msg)
				return error.response.data.msg
            }
        }
        else {
            alert("You have to fill in username and password!")
        }
    }

	const onChange_Username = (e) => {
		setUsername(e.target.value)
	}
	const onChange_Password = (e) => {
		setPassword(e.target.value)
	}

	const onClickRegister = (e) => {
		e.preventDefault();
		setLoginOrRegister("register")
	}

	return (
		<div className="site-card-border-less-wrapper">
			{islogin}
			<Card title="登入" bordered={true} style={{ width: 300 ,flex: 1, alignItems: 'center', justifyContent: 'center'}}>
				<Form
					name="normal_login"
					className="login-form"
					initialValues={{
						remember: true,
					}}
					onFinish={Submit}
				>
					<Form.Item
						name="username"
						rules={[
							{
								required: true,
								message: '請輸入您的暱稱!',
								whitespace: true,
							},
						]}
					>
						<Input
							prefix={<UserOutlined className="site-form-item-icon" />}
							placeholder="使用者姓名"
							onChange={onChange_Username}
						/>
					</Form.Item>
					<Form.Item
						name="password"
						rules={[
							{
								required: true,
								message: '請輸入你的密碼!',
							},
						]}
					>

						<Input
							prefix={<LockOutlined className="site-form-item-icon" />}
							type="password"
							placeholder="密碼"
							onChange={onChange_Password}
						/>
					</Form.Item>
					{/* <Form.Item>
						<Form.Item name="remember" valuePropName="checked" noStyle>
							<Checkbox>記住我</Checkbox>
						</Form.Item>
					</Form.Item> */}

					<Form.Item>
						<Space>
							<Link to="/">
								<Button type="primary" htmlType="submit" className="login-form-button" onClick={Submit}>
									登入
								</Button>
							</Link>
							<p>
							</p>
							<a onClick={onClickRegister}> 沒有帳號?馬上註冊!</a>
						</Space>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
};

export default Login;