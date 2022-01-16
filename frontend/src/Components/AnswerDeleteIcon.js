import React, { useState } from 'react';
import { List, Avatar, Space, Alert, Button, Modal, message } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, DeleteOutlined } from '@ant-design/icons';
import instance from '../api';




const AnswerDeleteIcon = ({memberName, answer_id, deleteAnswer, setDeleteAnswer}) => {


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

    const handleDeleteAnswer = async () => {
        try {
            // console.log("sdfeijfeijkoe")
            const {
                data: { msg },
            } = await instance.post('/hide/answer', {
                username: memberName,
                answer_id
            });
            // console.log(msg);
            displayStatus({
				type: "success",
				msg: msg,
			});
        }
        catch (error) {
            displayStatus({
				type: "error",
				msg: error.response.data.msg,
			});
        }
    }

    const pressButton = async () => {

        if (memberName == '') {
            // console.log('plz login')
            message.info('請先登入ㄛ')
            return
        }
        await handleDeleteAnswer()
        setDeleteAnswer(deleteAnswer+1)
    }

    return (
        <Space >
            <div style={{paddingLeft:"10px"}}>
                {React.createElement(DeleteOutlined, { onClick: pressButton })}
            </div>
        </Space >
    );

}

export default AnswerDeleteIcon