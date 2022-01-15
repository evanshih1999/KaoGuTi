import React from 'react';
import Card from './Card';

function CourseSearchList({ filteredCourses, setCourseName}) {
  const filtered = filteredCourses.map(course =>  <Card key={course.course_id} course={course} setCourseName={setCourseName} />); 
  return (
    <div>
      {filtered}
    </div>
  );
}

export default CourseSearchList;