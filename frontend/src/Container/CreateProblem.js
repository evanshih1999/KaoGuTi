import { useState,useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import katex from 'katex';
import 'katex/dist/katex.css'
import { Typography, Button, Input, message, Form, Space, Card, Select, Tag} from 'antd'
import { Link } from "react-router-dom";
import instance from '../api';
import AnimatedMulti from '../Components/Tags'
import { style } from '@mui/system';

const { Option } = Select;

const children = ["midterm", "final", "solved", "quiz", "test", "homework"]

const mdKaTeX = `This is to display the 
\`\$\$\c = \\pm\\sqrt{a^2 + b^2}\$\$\`
 in one line

\`\`\`KaTeX
c = \\pm\\sqrt{a^2 + b^2}
\`\`\`
`;


export default function CreateProblem({courseName, username, isLogin, setCourseName}) {
    const [summitCourseName, setSummitCourseName] = useState(courseName)
    const [title, setTitle] = useState("")
    const [teacher, setTeacher] = useState("")
    const [content, setContent] = useState("")
    const [answer, setAnswer] = useState("")
    const [tags, setTags] = useState([])

    const submit = async (values) => {
        await handleCreateProblem();
    };

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

    const handleCreateProblem = async () => {
        if (title.length > 0 && content.length > 0) {
            setCourseName(summitCourseName)
            try {
                const {
                    data: { msg },
                } = await instance.post('/create/problem', {
                    course_name: summitCourseName,
                    username,
                    title,
                    teacher,
                    description: content,
                    answer,
                    tags
                });
                // console.log(msg);
                displayStatus({
                    type: "success",
                    msg: msg,
                });
            }
            catch (error) {
                // console.error(error)
                // console.log(error.response.data.msg)
                displayStatus({
                    type: "error",
                    msg: error.response.data.msg,
                });
            }
        }
        else {
            alert("You have to fill in at least a course name, a title and some descriptions!")
        }
    }

    return (
    <>
        <Card title="新增問題"style={{ width: 800 }}>
        <Form
					name="normal_login"
					className="login-form"
					initialValues={{
						remember: true,
					}}
					onFinish={submit}
				>
					<Form.Item
                        label="課程名稱"
						rules={[
							{
								required: true,
								message: '請輸入課程名稱!',
							},
						]}
					>
						<Input.TextArea
							onChange={(e)=>{setSummitCourseName(e.target.value)}}
                            value={summitCourseName}
						/>
					</Form.Item>

                    <Form.Item
                        label="題目標題"
						rules={[
							{
								required: true,
							},
						]}
					>

						<Input.TextArea
							onChange={(e)=> setTitle(e.target.value)}
						/>

					</Form.Item>

					<Form.Item
                        label="授課老師"
						rules={[
							{
								required: true,
							},
						]}
					>

						<Input.TextArea
							onChange={(e)=> setTeacher(e.target.value)}
						/>

					</Form.Item>
                    <Form.Item
                        label="題目標籤"
                        rules={[
							{
								required: true,
							},
						]}
                    >
                    <Select
                        mode="tags"
                        showArrow
                        tagRender={tagRender}
                        style={{ width: '100%' }}
                        options={options}
                        onChange={(value)=>{setTags([...value])}}
                    >

                    {children}

                    </Select>
                    </Form.Item>
					<Form.Item
                        label="題目描述"
                    >
                    <MDEditor
                        value={content}
                        onChange={(val) => {
                            setContent(val);
                        }}
                        previewOptions={{
                            components: {
                            code: ({ inline, children = [], className, ...props }) => {
                                const txt = children[0] || '';
                                if (inline) {
                                if (typeof txt === 'string' && /^\$\$(.*)\$\$/.test(txt)) {
                                    const html = katex.renderToString(txt.replace(/^\$\$(.*)\$\$/, '$1'), {
                                    throwOnError: false,
                                    });
                                    return <code dangerouslySetInnerHTML={{ __html: html }} />;
                                }
                                return <code>{txt}</code>;
                                }
                                if (
                                typeof txt === 'string' &&
                                typeof className === 'string' &&
                                /^language-katex/.test(className.toLocaleLowerCase())
                                ) {
                                const html = katex.renderToString(txt, {
                                    throwOnError: false,
                                });
                                return <code dangerouslySetInnerHTML={{ __html: html }} />;
                                }
                                return <code className={String(className)}>{txt}</code>;
                            },
                            },
                        }}
                    />
                    </Form.Item>

                    <Form.Item
                        label="正確答案"
                    >
                    <MDEditor
                        value={answer}
                        onChange={(val) => {
                            setAnswer(val);
                        }}
                        previewOptions={{
                        components: {
                            code: ({ inline, children = [], className, ...props }) => {
                            const txt = children[0] || '';
                            if (inline) {
                                if (typeof txt === 'string' && /^\$\$(.*)\$\$/.test(txt)) {
                                const html = katex.renderToString(txt.replace(/^\$\$(.*)\$\$/, '$1'), {
                                    throwOnError: false,
                                });
                                return <code dangerouslySetInnerHTML={{ __html: html }} />;
                                }
                                return <code>{txt}</code>;
                            }
                            if (
                                typeof txt === 'string' &&
                                typeof className === 'string' &&
                                /^language-katex/.test(className.toLocaleLowerCase())
                            ) {
                                const html = katex.renderToString(txt, {
                                throwOnError: false,
                                });
                                return <code dangerouslySetInnerHTML={{ __html: html }} />;
                            }
                            return <code className={String(className)}>{txt}</code>;
                            },
                        },
                        }}
                    />
                    </Form.Item>

					<Form.Item>
						<Space>
                        {(courseName === summitCourseName )?
                        <Link to="/problem">
                            <Button type={"primary"}onClick={submit}>
                                Submit
                            </Button>
                        </Link>
                        :
                        <Link to="/">
                            <Button type={"primary"}onClick={submit}>
                                Submit
                            </Button>
                        </Link>
                        }
						</Space>
					</Form.Item>

				</Form>
        </Card>

    </>
    );
}
const options = [{ value: 'solved', label:"solved", color:"gold" }, { value: 'midterm', label:"midterm", color:"lime" }, { value: 'final', label:"final", color:"green" }, { value: 'test', label:"test", color:"cyan" }
                ,{value: 'quiz', label:'quiz'} , {value: 'homework', label:'homework'} 
]

function tagRender(props) {
    const { label, value, closable, onClose, color } = props;
    const onPreventMouseDown = event => {
        event.preventDefault();
        event.stopPropagation();
    };
    return (
        <Tag
        color={value === "solved"? "gold" : value === "midterm"? "lime" : value === "final" ?"green": value === "test" ? "cyan" : value === "quiz" ? "red" : value === "homework" ? "orange" :"silver"}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
        >
        {label}
        </Tag>
    );
}