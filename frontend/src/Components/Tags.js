import React from 'react';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';


const options = [
  { value: 'midtermExam', label: 'Midterm' },
  { value: 'solved', label: 'Solved' },
  { value: 'finalExam', label: 'Final' },
  { value: 'test', label: 'Test' },
]

const animatedComponents = makeAnimated();

export default function AnimatedMulti() {
  console.log("hi")

  return (
    <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      isMulti
      options={options}
    />
  );
}