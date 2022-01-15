import React, { useState } from 'react';
import { List, Avatar, Space, Alert, Button, Modal, message } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, DeleteOutlined } from '@ant-design/icons';
import instance from '../api';



const Replyicon = ({user_likes, iconNum, memberName, answer_id, newLike, setNewLike}) => {


    const [pressColor, setpressColor] = useState(memberName? !user_likes : user_likes)

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
            } = await instance.post('/like/answer', {
                username: memberName,
                answer_id
            });
            console.log(msg);
            displayStatus({
				type: "success",
				msg: msg,
			});
            setNewLike(newLike+1);
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

    const pressButton = async () => {

        if (memberName == '') {
            console.log('plz login')
            message.info('請先登入ㄛ')
            return
        }
        
        setpressColor(prev => !prev)
        setshowText(prev => prev + (pressColor ? -1 : 1))
        await handleLikeProblem()

        
    }

    return (
        <Space >
            <div style={pressColor ? { color: 'blue' } : null} >
                {React.createElement(LikeOutlined, { onClick: pressButton })}
            </div>
            {showText}
        </Space >
    );

}

export default Replyicon