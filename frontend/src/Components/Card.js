import React from 'react';
import { Link } from 'react-router-dom';

function Card({course, setCourseName}) {

    return(
    <Link to="/problem">
        <div className="tc bg-light-gray dib br3 pa3 ma2 grow bw2 shadow-5" onClick={() => setCourseName(course.course_name)}>
            <div>
            <h2>{course.course_name}</h2>
            {/* <p>{course.teacher}</p> */}
            </div>
        </div>
    </Link>
    );
}

export default Card;