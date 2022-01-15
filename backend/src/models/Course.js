import mongoose from 'mongoose'
 
const Schema = mongoose.Schema;
const CourseSchema = new Schema({
    course_name: String,
    course_id: String,
});
const Course = mongoose.model('Course', CourseSchema);

export default Course;