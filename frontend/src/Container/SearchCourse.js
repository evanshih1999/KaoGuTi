import { useState, useEffect } from 'react';
import Search from '../Components/Search'
import {testData} from '../testData';
import instance from '../api';


function SearchCourse({setCourseName}) {
	let [courses, setCourses] = useState([]);

	useEffect(async () => {
		handleSearch("");
	}, []);

	const handleSearch = async ( course_name ) => {
        try {
            console.log(course_name);
            const { data } = await instance.get('/search', {
                params: {
                    course_name
                },
            });
            console.log(data)
			setCourses(data);
        } 
        catch (error) {
            // console.error(error)
            console.log(error.response.data.msg)
        }
    }

	return (
		<div className="tc bg-balck ma0 pa4 min-vh-100">
			<Search details={courses} setCourseName={setCourseName}/>
		</div>
	);
}
  
  export default SearchCourse;