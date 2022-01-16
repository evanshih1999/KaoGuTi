import { Space, Card} from "antd";
import { Form,  Input,  Row, Col,  Checkbox,  Button,  message,} from 'antd';
import { useState } from "react";
// import {setVerifyCode, createUser} from "../api/User"
import instance from "../api";
import sha256 from 'crypto-js/sha256'
import { stripIgnoredCharacters } from "graphql";


const Register = ( {setLoginOrRegister} ) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [captcha, setCaptcha] = useState('');


  const submit = async (values) => {
    let msg = await handleRegister();
		console.log(msg)
		if (msg === "User created") {
			displayStatus({
				type: "success",
				msg: msg,
			});
			setLoginOrRegister("login");
		}
		else {
			// alert(msg)
			displayStatus({
				type: "error",
				msg: msg,
			});
		}
  };
	
  const handleRegister = async () => {
    if (email.length > 0 && captcha.length > 0 && nickname.length > 0 && password.length > 0) {
      const hashDigest = sha256(password)
      let hash = ''
      for (let i=0; i<hashDigest.words.length; i++) {
        hash += hashDigest.words[i].toString()
      }
      console.log(hash)
      try {
        const {
          data: { msg },
        } = await instance.post('/user/register', {
          mail: email,
          vcode: captcha,
          username: nickname,
          password: hash
        });
        console.log(msg);
        return msg
      }
      catch (error) {
        // console.error(error)
        console.log(error.response.data.msg)
        return error.response.data.msg
      }
    }
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

	const onClickLogin =(e)=> {
		e.preventDefault();
		setLoginOrRegister("login");
	}
	const getCode = async () => {
	let emailLower = email.toLowerCase();
    if(emailLower.indexOf("@") === -1 || (emailLower.indexOf("edu") === -1 && emailLower.indexOf("com") === -1)){
      message.error("請輸入有效之email")
    }
    else if (emailLower.indexOf(",") !== -1 || emailLower.indexOf("#") !== -1 || emailLower.indexOf("$") !== -1 ||
            emailLower.indexOf("%") !== -1  || emailLower.indexOf("&") !== -1 || emailLower.indexOf("^") !== -1){
      message.error("請輸入有效之email")      
    }
    else if(emailLower.split('@') <= 2){
      message.error("請輸入正確之email")
    }
    else {
    //   const data = await setVerifyCode(email);
    //   if(data === "User mail exist")
    //     message.error("此電子郵件已被註冊")
    //   else if (data === "Good.")
    //     message.success("已寄出驗證碼")
      let msg = await handleSetVerifyCode()
      displayStatus({
				type: "success",
				msg: msg,
			});
    }
  }

  const handleSetVerifyCode = async () => {
    if (email.length > 0)  {
      try {
        const {
          data: { msg },
        } = await instance.post('/user/set_verify_code', {
          mail: email
        });
        console.log(msg);
        return msg
      }
      catch (error) {
        // console.error(error)
        console.log(error.response.data.msg)
        return error.response.data.msg
      } 
    }
  }

  const onChangeEmail = (e) =>{
    setEmail(e.target.value);
  }
  const onChangePassword = (e) =>{
    setPassword(e.target.value);
  }  
  const onChangeNickname = (e) =>{
    setNickname(e.target.value);
  }
  const onChangeCaptcha = (e) =>{
    setCaptcha(e.target.value);
  }

	const [form] = Form.useForm();

	const formItemLayout = {
    labelCol: {
      xs: {
      span: 24,
      },
      sm: {
      span: 8,
      },
    },
    wrapperCol: {
      xs: {
      span: 24,
      },
      sm: {
      span: 16,
      },
    },
	};
	const tailFormItemLayout = {
    wrapperCol: {
      xs: {
      span: 24,
      offset: 0,
      },
      sm: {
      span: 16,
      offset: 8,
      },
    },
	};

  return (
    <div className="site-card-border-less-wrapper" style={{paddingTop:"80px"}}>
      <Card  title="註冊" bordered={true} style={{ width: 500 }}>   
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={submit}
        scrollToFirstError
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: '這不是有效的email!',
            },
            {
              required: true,
              message: '請輸入您的email!',
            },
          ]}
        >
          <Input onChange={onChangeEmail}/>
        </Form.Item>

        <Form.Item
          name="password"
          label="密碼"
          rules={[
            {
              required: true,
              message: '請輸入您的密碼!',
            },
          ]}
          hasFeedback
        >
          <Input.Password onChange={onChangePassword}/>
        </Form.Item>

        <Form.Item
          name="confirm password"
          label="再次輸入密碼"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '請確認密碼!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error('兩次輸入的密碼不一致!'));
              },
            }),
          ]}
        >
          <Input.Password onChange={onChangePassword}/>
        </Form.Item>

        <Form.Item
          name="nickname"
          label="暱稱"
          rules={[
            {
              required: true,
              message: '請輸入您的暱稱!',
              whitespace: true,
            },
          ]}
        >
          <Input onChange={onChangeNickname}/>
        </Form.Item>

        <Form.Item label="驗證碼"  tooltip="點擊右側獲取驗證碼後，請去第一欄填的信箱收信" extra="請勿使用 @ntu.edu.tw 信箱註冊(已被計中封鎖了)">
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name="captcha"
                noStyle

                rules={[
                  {
                    required: true,
                    message: '請輸入寄到您註冊信箱的驗證碼!',
                  },
                ]}
              >
                <Input onChange={onChangeCaptcha}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Button onClick={getCode}>獲取驗證碼</Button>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          // rules={[
          //   {
          //     validator: (_, value) =>
          //       value ? Promise.resolve() : Promise.reject(new Error('錯誤嘍')),
          //   },
          // ]}
          {...tailFormItemLayout}
        >
        </Form.Item>
        <Form.Item         {...tailFormItemLayout}>
          <Space>      
            <Button type="primary" htmlType="submit" className="login-form-button" onClick>
              註冊
            </Button>
            <p>
            </p>
            <a onClick={onClickLogin}> 已有帳號?馬上登入!</a>
          </Space>
        </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;