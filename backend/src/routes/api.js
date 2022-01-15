import express from 'express'
import nodemailer from 'nodemailer'
import dotenv from "dotenv-defaults"
import bcrypt from "bcrypt"
import User from '../models/User.js'
import Vcode from '../models/Vcode.js'
import { v4 as uuidv4 } from 'uuid'
import Course from '../models/Course.js'
import Problem from '../models/Problem.js'
import Answer from '../models/Answer.js'
import Cookie from '../models/Cookie.js'

dotenv.config();

// generate vcode
function makevcode(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const router = express.Router()

router.post('/user/set_verify_code', async (req, res) => {
    const email = req.body.mail
    const vcode = makevcode(6)
    
    if (await Vcode.findOne({ email: email })) {
        try {
            await Vcode.updateOne({ email: email }, { $set: { vcode: vcode }})
        } catch(e) { throw new Error("Verification code update error")}
    } else {
        try {
            const newVcode = new Vcode({ email, vcode })
            await newVcode.save()
        } catch (e) { throw new Error("Verification code creation error")}
    }

    var transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD
        }
    })
      
    var mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'KaoGuTi Website verification code',
        text: 'Your verification code is: ' + vcode
    }
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    })

    res.json({msg: 'Verificaiton code sent to ' + email})
})

router.post('/user/register', async (req, res) => {
    const email = req.body.mail
    const vcode = req.body.vcode
    const username = req.body.username
    const password = await bcrypt.hash(req.body.password,10)
    if (!vcode) {
        res.status(400).send({ msg: "Didn't click verify button!" })
        return
    }
    if (!(await Vcode.findOne({ email: email, vcode: vcode }))) {
        res.status(400).send({ msg: 'Wrong verify code!'})
        return
    }
    if (await User.findOne({ username: username })) {
        res.status(400).send({ msg: 'username exist!' })
        return
    }
    if (await User.findOne({ email: email })) {
        res.status(400).send({ msg: 'email exist!' })
        return
    }
    try {
        const newUser = new User({ username, email, password })
        await newUser.save()
        res.json({msg: 'User created'})
        await Vcode.deleteOne({email: email, vcode: vcode})
    } catch (e) { throw new Error("User creation error")}
})

router.post('/user/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const user = await User.findOne({ username: username })
    if (user) {
        if (await bcrypt.compare(password, user.password)) {
            try {
                const token = makevcode(6)
                const newCookie = new Cookie({ username, token })
                await newCookie.save()
                res.cookie('username', username)
                res.cookie('token', token)
            } catch (e) { throw new Error("Cookie creation error")}
            res.json({ msg: 'Success!' })
            return
        }
        res.status(400).send({ msg: 'Incorrect password' })
        return
    }
    res.status(400).send({ msg: "Username doesn't exist" })
})

router.post('/user/logout', async (req, res) => {
    const username = req.cookies.username
    const token = req.cookies.token
    if (await Cookie.findOne({ username: username, token: token })) {
        await Cookie.deleteOne({ username: username, token: token })
        res.clearCookie('token')
        res.clearCookie('username')
        res.json({ msg: 'Logout success' })
    } else {
        res.json({ msg: 'Wrong cookie token' })
    }
})

router.post('/create/course', async (req, res) => {
    const username = req.cookies.username
    const token = req.cookies.token
    if (!await Cookie.findOne({ username: username, token: token })) {
        res.json({ msg: 'Wrong cookie token' })
        return
    }
    const course_name = req.body.course_name
    const course_id = uuidv4()
    try {
        const newCourse = new Course({ course_name, course_id })
        await newCourse.save()
        res.json({msg: 'Course created', course_id: course_id})
    } catch (e) { throw new Error("Course creation error")}
})

router.post('/create/problem', async (req, res) => {
    const username = req.cookies.username
    const token = req.cookies.token
    if (!await Cookie.findOne({ username: username, token: token })) {
        res.json({ msg: 'Wrong cookie token' })
        return
    }
    const course_name = req.body.course_name
    const course = await Course.findOne({course_name: course_name})
    let course_id = ""
    if (course) {
        course_id = course.course_id
    } else {
        course_id = uuidv4()
        try {
            const newCourse = new Course({ course_name, course_id })
            await newCourse.save()
        } catch (e) { throw new Error("Course creation error")}
    }
    const problem_id = uuidv4()
    const title = req.body.title
    const description = req.body.description
    const tags = req.body.tags
    const teacher = req.body.teacher
    const publisher = username
    const likes = []
    const content = req.body.answer
    const time = Date()
    try {
        const newProblem = new Problem({ course_id, problem_id, title, description, tags, teacher, publisher, likes, time })
        await newProblem.save()
        if (content) {
            const answer_id = uuidv4()
            const newAnswer = new Answer({ problem_id, answer_id, content, publisher, likes, time })
            await newAnswer.save()
        }
        res.json({msg: 'Problem created'})
    } catch (e) { throw new Error("Problem creation error")}
})

router.post('/create/answer', async (req, res) => {
    const username = req.cookies.username
    const token = req.cookies.token
    if (!await Cookie.findOne({ username: username, token: token })) {
        res.json({ msg: 'Wrong cookie token' })
        return
    }
    const problem_id = req.body.problem_id
    const answer_id = uuidv4()
    const content = req.body.content
    const publisher = username
    const likes = []
    const time = Date()
    try {
        const newAnswer = new Answer({ problem_id, answer_id, content, publisher, likes, time })
        await newAnswer.save()
        res.json({msg: 'Answer created'})
    } catch (e) { throw new Error("Answer creation error")}
})

router.get('/search', async (req, res) => {
    const search_name = req.query.course_name
    const courses = await Course.find({course_name: {$regex: search_name}})
    for (let i=0; i<courses.length; i++) {
        courses[i] = {course_name: courses[i].course_name, course_id: courses[i].course_id}
    }
    res.json(courses)
})

router.post('/search/course', async (req, res) => {
    const course_name = req.body.course_name
    const course = await Course.findOne({course_name: course_name})
    if (!course) {
        res.status(400).send({ msg: "Course doesn't exist" })
    }
    const course_id = course.course_id
    const teacher = req.body.teacher
    const tags = req.body.tags
    const username = req.cookies.username
    let problems = await Problem.find({course_id: course_id, teacher: {$regex: teacher}, tags: {$all: tags}}).sort({time:-1})
    if (tags.length===0) {
        problems = await Problem.find({course_id: course_id, teacher: {$regex: teacher}}).sort({time:-1})
    }
    for (let i=0; i<problems.length; i++) {
        problems[i] = {problem_id: problems[i].problem_id,
            title: problems[i].title,
            teacher: problems[i].teacher,
            likes_num: problems[i].likes.length,
            tags: problems[i].tags,
            publisher: problems[i].publisher,
            able_to_like: !(problems[i].likes.includes(username))||!(username),
            time: problems[i].time,
            answers_num: (await Answer.find({problem_id: problems[i].problem_id})).length
        }
    }
    res.json(problems)
})

router.get('/problem', async (req, res) => {
    const problem_id = req.query.problem_id
    const username = req.cookies.username
    const problem = await Problem.findOne({problem_id: problem_id})
    const answers = await Answer.find({problem_id: problem_id})
    for (let i=0; i<answers.length; i++) {
        answers[i] = {answer_id: answers[i].answer_id,
            content: answers[i].content,
            publisher: answers[i].publisher,
            likes_num: answers[i].likes.length,
            able_to_like: !(answers[i].likes.includes(username)||!(username)),
            time: answers[i].time
        }
    }
    answers.sort(function (a,b){return b.likes_num-a.likes_num})
    res.json({
        title: problem.title,
        description: problem.description,
        teacher: problem.teacher,
        publisher: problem.publisher,
        tags: problem.tags,
        likes_num: problem.likes.length,
        able_to_like: !(problem.likes.includes(username)||!(username)),
        answers: answers,
        time: problem.time
    })
})

router.post('/like/problem', async(req, res) => {
    const username = req.cookies.username
    const token = req.cookies.token
    if (!await Cookie.findOne({ username: username, token: token })) {
        res.json({ msg: 'Wrong cookie token' })
        return
    }
    const problem_id = req.body.problem_id
    try {
        const problem = await Problem.findOne({ problem_id: problem_id })
        if (problem.likes.includes(username)) {
            problem.likes = problem.likes.filter((user) => {
                return user !== username
            })
            res.json({msg: 'unliked'})
        } else {
            problem.likes.push(username)
            res.json({msg: 'liked'})
        }
        const likes = problem.likes
        await Problem.updateOne({ problem_id: problem_id }, { $set: { likes: likes }})
    } catch (e) { throw new Error("Problem liking error")}
})

router.post('/like/answer', async(req, res) => {
    const username = req.cookies.username
    const token = req.cookies.token
    if (!await Cookie.findOne({ username: username, token: token })) {
        res.json({ msg: 'Wrong cookie token' })
        return
    }
    const answer_id = req.body.answer_id
    try {
        const answer = await Answer.findOne({ answer_id: answer_id })
        if (answer.likes.includes(username)) {
            answer.likes = answer.likes.filter((user) => {
                return user !== username
            })
            res.json({msg: 'unliked'})
        } else {
            answer.likes.push(username)
            res.json({msg: 'liked'})
        }
        const likes = answer.likes
        await Answer.updateOne({ answer_id: answer_id }, { $set: { likes: likes }})
    } catch (e) { throw new Error("Answer liking error")}
})

export default router