import mongoose from 'mongoose'
 
const Schema = mongoose.Schema;
const AnswerSchema = new Schema({
    problem_id: String,
    answer_id: String,
    content: String,
    publisher: String,
    likes: [String],
    time: Date
});
const Answer = mongoose.model('Answer', AnswerSchema);

export default Answer;