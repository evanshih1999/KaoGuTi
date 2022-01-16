import React, { useState } from 'react';
import Scroll from './Scroll';
import CourseSearchList from './CourseSearchList';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import { width } from '@mui/system';
import { Card } from 'antd';

function Search({ details, setCourseName }) {

  const [searchField, setSearchField] = useState("");
  // console.log(details)
  const filteredCourses = details.filter(
    person => {
      return (
        person
        .course_name
        .replace(/ /g, "")
        .includes(searchField.toLowerCase())
        // ||
        // person
        // .teacher
        // .toLowerCase()
        // .includes(searchField.toLowerCase())
      );
    }
  );

  const handleChange = e => {
    setSearchField(e.target.value);
  };

  function searchList() {
    return (
      <Scroll>
        <CourseSearchList filteredCourses={filteredCourses} setCourseName={setCourseName}/>
      </Scroll>
    );
  }

  return (
    <Card>
      <div className="pa2" style={{alignItems:"center", display:"flex", justifyContent:"center", flexDirection:"row"}}>
        <div style={{alignItems:"center", display:"flex", justifyContent:"center", flexDirection:"row", width:"350px", height:"75%"}}>
        <div style={{width:"50px"}}>
          <SearchIcon color="primary" style={{width:"50px", height:"50px", paddingTop:"10px"}}/>
        </div>
        <input 
          className="pa3 bb br3 grow b--none bg-lightest-white ma3"
          type = "search" 
          placeholder = "Search Course Name" 
          onChange = {handleChange}
          style={{borderBlockColor:"blue", width:"300px", height: "50px", fontSize:"25px"}}
        />
        </div>

      </div>
      {searchList()}
    </Card>
  );
}

export default Search;