import React, { useState } from 'react';
import { List, Avatar, Space, Alert, Button, Modal, message } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, DeleteOutlined } from '@ant-design/icons';
import instance from '../api';



const IconText = ({ icon, user_likes, iconNum, memberName, problem_id, deleteion, setDeletion }) => {

    if (icon != LikeOutlined) user_likes = true

    const [pressColor, setpressColor] = useState(!user_likes)
    // const [showModal, setshowModal] = useState(false)
    const [showText, setshowText] = useState(iconNum)

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

    const handleLikeProblem = async () => {
        try {
            const {
                data: { msg },
            } = await instance.post('/like/problem', {
                username: memberName,
                problem_id
            });
            console.log(msg);
            displayStatus({
				type: "success",
				msg: msg,
			});
        }
        catch (error) {
            // console.error(error)
            // console.log(error.response.data.msg)
            displayStatus({
				type: "error",
				msg: error.response.data.msg,
			});
        }
    }

    const handleHideProblem = async () => {
        try {
            const {
                data: { msg },
            } = await instance.post('/hide/problem', {
                username: memberName,
                problem_id
            });
            // console.log(msg);
            displayStatus({
				type: "success",
				msg: msg,
			});
        }
        catch (error) {
            // console.error(error)
            // console.log(error.response.data.msg)
            displayStatus({
				type: "error",
				msg: error.response.data.msg,
			});
        }
    }
    
    const pressButton = async () => {

        // console.log('pressButton')
        // console.log('user_likes', user_likes)
        // console.log('iconNum', iconNum)


        if (memberName == '') {
            // console.log('plz login')
            message.info('請先登入ㄛ')
            return
        }
        if (icon == LikeOutlined) {
            // const res = await likes_post(post_id, memberName)
            // console.log(res)
            setpressColor(prev => !prev)
            setshowText(prev => prev + (pressColor ? -1 : 1))
            await handleLikeProblem()

        }
        if (icon == DeleteOutlined) {
            message.info('刪除貼文')
            // const res = await delete_post(post_id, memberName)
            // console.log(res)

            // const data = await getDepPost(department, memberName);
            // setDepPostData(data)

            // setshowModal(true)
            // onDeleteNotification()
            // setshowModal(false)
            await handleHideProblem();
            setDeletion(deleteion + 1);
        }
        if (icon == MessageOutlined) {
            // setpressColor(prev => !prev)
        }
        // setshowModal(prev => !prev)

    }

    return (
        <Space >
            {
                (icon === MessageOutlined)?
                    <div style={pressColor ? { color: 'blue' } : null} >
                        {React.createElement(icon, { onClick: pressButton,  style: {pointerEvents: "none"} })}
                    </div>
                    :
                    <div style={pressColor ? { color: 'blue' } : null} >
                        {React.createElement(icon, { onClick: pressButton })}
                    </div>
            }
            {showText}
        </Space >
    );

}

export default IconText