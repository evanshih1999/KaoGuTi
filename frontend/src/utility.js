    // api/user/set_verify_code
    const handleSetVerifyCode = async () => {
        if (mail.length > 0)  {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(myForm.emailAddr.value)) {
                const {
                    data: { msg },
                } = await instance.post('/user/set_verify_code', {
                    mail
                });
                console.log(msg);
            }
            else {
                alert("You have entered an invalid email address!")
            }
            setTimeout(() => {
                props.navigate(-1);
            }, 300)
        }
    }

    // api/user/register
    const handleRegister = async () => {
        if (mail.length === 0) {
            alert("You have to fill in email address!")
            return
        }
        if (vcode.length === 0) {
            alert("You have to fill in verify code!")
            return
        }
        if (username.length === 0) {
            alert("You have to fill in your username!")
            return
        }
        if (password.length === 0) {
            alert("You have to fill in your password!")
            return
        }
        if (mail.length > 0 && vcode.length > 0 && username.length > 0 && password.length > 0) {
            try {
                const {
                    data: { msg },
                } = await instance.post('/user/register', {
                    mail,
                    vcode,
                    username,
                    password
                });
                console.log(msg);
            }
            catch (error) {
                console.error(error)
                console.log(error.response.data.msg)
            }
            setTimeout(() => {
                props.navigate(-1);
            }, 300)
        }
        else {
            alert("You have to fill in all information!")
        }
    }

    // api/user/login
    const handleLogin = async () => {
        if (username.length === 0) {
            alert("You have to fill in your username!")
            return
        }
        if (password.length === 0) {
            alert("You have to fill in your password!")
            return
        }
        if (username.length > 0 && password.length > 0) {
            try {
                const {
                    data: { msg },
                } = await instance.post('/user/login', {
                    username,
                    password
                });
                console.log(msg);
            }
            catch (error) {
                console.error(error)
                console.log(error.response.data.msg)
            }
            setTimeout(() => {
                props.navigate(-1);
            }, 300)
        }
        else {
            alert("You have to fill in username and password!")
        }
    }

    // api/user/logout
    const handleLogout = async () => {
        try {
            const {
                data: { msg },
            } = await instance.post('/user/logout');
            console.log(msg);
        }
        catch (error) {
            console.error(error)
            console.log(error.response.data.msg)
        }
        setTimeout(() => {
            props.navigate(-1);
        }, 300)
    }

    // api/search/
    const handleSearch = async ( course_name ) => {
        try {
            const { data: { courses } } = await instance.get('/search', {
                course_name
            });
            console.log(courses)
        } 
        catch (error) {
            console.error(error)
            console.log(error.response.data.msg)
        }
        setTimeout(() => {
            props.navigate(-1);
        }, 300)
    }

    // api/search/course/
    const handleSearchCourse = async ( course_id, teacher, tags ) => {
        try {
            const { data: { problems } } = await instance.get('/search/course', {
                course_id,
                teacher,
                tags,
                username
            });
            console.log(problems)
        } 
        catch (error) {
            console.error(error)
            console.log(error.response.data.msg)
        }
        setTimeout(() => {
            props.navigate(-1);
        }, 300)
    }

    // api/problem/
    const handleProblem = async ( problem_id ) => {
        try {
            const { data: { info } } = await instance.get('/problem', {
                username,
                problem_id
            });
            console.log(info)
        } 
        catch (error) {
            console.error(error)
            console.log(error.response.data.msg)
        }
        setTimeout(() => {
            props.navigate(-1);
        }, 300)
    }

    // api/like/problem
    const handleLikeProblem = async ( problem_id ) => {
        try {
            const {
                data: { msg },
            } = await instance.post('/like/problem', {
                username,
                problem_id
            });
            console.log(msg);
        }
        catch (error) {
            console.error(error)
            console.log(error.response.data.msg)
        }
        setTimeout(() => {
            props.navigate(-1);
        }, 300)
    }

    // api/like/answer
    const handleLikeAnswer = async ( answer_id ) => {
        try {
            const {
                data: { msg },
            } = await instance.post('/like/answer', {
                username,
                answer_id
            });
            console.log(msg);
        }
        catch (error) {
            console.error(error)
            console.log(error.response.data.msg)
        }
        setTimeout(() => {
            props.navigate(-1);
        }, 300)
    }

    // api/create/course
    const handleCreateCourse = async () => {
        if (course_name.length > 0) {
            try {
                const {
                    data: { msg },
                } = await instance.post('/create/course', {
                    course_name
                });
                console.log(msg);
            }
            catch (error) {
                console.error(error)
                console.log(error.response.data.msg)
            }
            setTimeout(() => {
                props.navigate(-1);
            }, 300)
        }
        else {
            alert("You have to fill in course name!")
        }
    }

    // api/create/problem
    const handleCreateProblem = async () => {
        if (title.length > 0 && description.length > 0) {
            try {
                const {
                    data: { msg },
                } = await instance.post('/create/problem', {
                    course_id,
                    publisher,
                    title,
                    teacher,
                    description,
                    answer,
                    tags
                });
                console.log(msg);
            }
            catch (error) {
                console.error(error)
                console.log(error.response.data.msg)
            }
            setTimeout(() => {
                props.navigate(-1);
            }, 300)
        }
        else {
            alert("You have to fill in at least a title and some descriptions!")
        }
    }

    // api/create/answer
    const handleCreateAnswer = async () => {
        if (content.length > 0) {
            try {
                const {
                    data: { msg },
                } = await instance.post('/create/answer', {
                    problem_id,
                    content,
                    publisher
                });
                console.log(msg);
            }
            catch (error) {
                console.error(error)
                console.log(error.response.data.msg)
            }
            setTimeout(() => {
                props.navigate(-1);
            }, 300)
        }
        else {
            alert("You have to fill in at least some contents!")
        }
    }