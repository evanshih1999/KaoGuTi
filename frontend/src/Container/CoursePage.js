import { useState,useEffect } from 'react';
import ProblemListView from '../Components/ProblemListView';
import { testProblem } from '../testData';
import { message } from 'antd'
import instance from '../api';
import qs from 'qs';

const CoursePage = ({courseName, isLogin, memberName}) => {
    const [courseProblemData, setCourseProblemData] = useState([]);
	const [teacher, setTeacher] = useState("");
	const [tags, setTags] = useState([]);

	

	useEffect(async () => {
		if (courseName) {
			await handleSearchCourse()
		}
	}, [courseName]);

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

	const handleSearchCourse = async () => {
		console.log(courseName);
        try {
            const { data } = await instance.post('/search/course', {
				course_name: courseName,
				teacher,
				tags,
				username: memberName
            });
            console.log(data)
			setCourseProblemData(data)
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
        <div className="Problems">
			{
				courseName
					?
					<>
						<ProblemListView courseProblemData={courseProblemData} isLogin={isLogin} memberName={memberName}/>
					</>
					:
					null
			}
		</div>

    )
}

export default CoursePage;