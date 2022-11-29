const express = require('express')
const app = express()

const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const person = require('./models/personmodel')
const login = require('./models/loginmodel')
const session = require('./models/sessionmodel')
const project = require('./models/projectmodel')
const validator = require('./models/validatormodel')
const user_json = require('./models/userjsonmodel')
const step = require('./models/stepmodel')
const integrate = require('./models/integratemodel')
dotenv.config({ path: './config/config.env' })
var db = require('./config/db.js');
connectDB()

app.use(cors())
app.use(express.json())


app.post('/api/register', async (req, res) => {
    console.log(req.body)
    try {
        const persons = await person.find({})
        const logins = await login.find({})

        c = persons.length
        u = logins.length
        await person.create({
            pid: c + 1,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            organization: req.body.organization,
            // role: req.body.role,
            role: 0
        })

        login.create({
            uid: u + 1,
            pid: c + 1,
            email: req.body.email,
            password: req.body.password,
            // role: req.body.role,
            role: 0
        })
        res.json({ status: '0', message: 'Registered' })
    } catch (err) {
        console.log(err);
        res.json({ status: '-1', message: 'Already Registered' })
    }
})


app.post('/api/json_upload_admin', async (req, res) => {
    console.log(req.body)
    try {

        await validator.create({
            type: req.body.type,
            file_contents: req.body.file_contents,
        })

        res.json({ status: '0', message: 'Validator Uploaded' })
    } catch (err) {
        console.log(err);
        res.json({ status: '-1', message: 'This validator already uploaded or error in uploading JSON.' })
    }
})

app.post('/api/fetch_encoded_strings', async (req, res) => {
    console.log(req.body)

    const combo = await integrate.find({ Projid: req.body.proj_id })
    console.log(combo.Projid);
    
    if (combo) {
        res.send({ status: '0', message: "Returing Array of strings", base64_strings: combo })
    }

    else {
        res.send({ status: '-1', message: "Base 64 Strings NA" })
    }
})


app.post('/api/upload_json', async (req, res) => {
    console.log(req.body)
    try {

        await user_json.create({
            input_json_content: req.body.input_json_content,
            pid: req.body.pid,
            step_no: req.body.step_no,
            proj_id: req.body.proj_id,
        })

        const current_time = new Date();

        if (req.body.step_no == 4) {
            project.findOneAndUpdate({ Projid: req.body.proj_id }, { LstUpd: current_time, IsFinished: "Yes", Step: 4, Status: "Completed" }, (error, data) => {
                if (error) {
                    res.json({ status: '-1', message: 'Entry does not exist' })
                }
                else {
                    // res.json({ status: '0', message: 'Entry updated' })
                    step.findOneAndUpdate({ Sprojid: req.body.proj_id, Pid: req.body.pid }, { StepID: req.body.step_no, Ssave: req.body.input_json_content, Svalidated: req.body.input_json_content, Ssavetime: current_time, Svalidated_time: current_time, SLstupd: current_time, }, (error, data) => {
                        if (error) {
                            res.json({ status: '-1', message: 'Entry does not exist' })
                        }
                        else {
                            res.json({ status: '0', message: 'Entry updated' })
                        }
                    })
                }
            })            
        }

        else {
            project.findOneAndUpdate({ Projid: req.body.proj_id }, { LstUpd: current_time, Step: req.body.step_no, Status: "Intermediate" }, (error, data) => {
                if (error) {
                    res.json({ status: '-1', message: 'Entry does not exist' })
                }
                else {
                    // res.json({ status: '0', message: 'Entry updated' });
                    step.findOneAndUpdate({ Sprojid: req.body.proj_id, Pid: req.body.pid }, { StepID: req.body.step_no, Ssave: req.body.input_json_content, Svalidated: req.body.input_json_content, Ssavetime: current_time, SLstupd: current_time, }, (error, data) => {
                        if (error) {
                            res.json({ status: '-1', message: 'Entry does not exist' })
                        }
                        else {
                            res.json({ status: '0', message: 'Entry updated' })
                        }
                    })
                }
            })
        }

        // res.json({ status: '0', message: 'Step number updated' })
    } catch (err) {
        console.log(err);
        res.json({ status: '-1', message: 'This entry already exist or error in uploading JSON.' })
    }
})


app.post('/api/view_project', async (req, res) => {
    console.log(req.body)
    try {

        const users_projects = await project.find({
            Ownerid: req.body.pid,
        })

        res.json({ status: '0', message: 'List of projects sent.', list_of_projects: users_projects })
    } catch (err) {
        console.log(err);
        res.json({ status: '-1', message: 'Error in viewing projects.' })
    }
})




app.post('/api/login', async (req, res) => {
    const user = await login.findOne({
        email: req.body.email,
        role: req.body.role,
    })

    if (user) {
        if (req.body.password === user.password) {

            const sessions = await session.find({})
            s = sessions.length;
           // console.log(s + 1);
            const current_time = new Date();

            await session.create({
                usid: s + 1,
                Logpid: user.pid,
                Logintime: current_time,      // This field should be passes by Ayush Bhai from frontend
                Logouttime: "Null",
                Loginas: user.pid,
            })

            res.send({ status: '0', message: "Login Successfull", user: user, session_table_entry: s + 1 }) // session table entry needed for logout
        }
        else {
            res.send({ status: '-1', message: "Incorrect password", user: user })
        }
    }
    else {
        res.send({ status: '-1', message: "User not registered", user: user })
    }


})


app.post('/api/get_standard_json', async (req, res) => {
    console.log(req.body)

    const valid = await validator.find({ type: req.body.type })

    if (valid) {
        res.send({ status: '0', message: "JSON File", json_content: valid })
    }

    else {
        res.send({ status: '-1', message: "Validator not uploaded" })
    }
})

app.post('/api/fetch_edited_json', async (req, res) => {
    console.log(req.body)

    const valid = await user_json.find({ step_no: req.body.step_no, proj_id: req.body.proj_id, pid: req.body.pid })

    if (valid) {
        res.send({ status: '0', message: "JSON File", json_content: valid })
    }

    else {
        res.send({ status: '-1', message: "File Not available" })
    }
})

app.post('/api/create_project', async (req, res) => {
    console.log(req.body.proj_name)
    console.log(req.body.owner_pid)

    try {
        // const projects = await project.find({})

        // p = projects.length
        const current_time = new Date();
        console.log("came here");

        await project.create({
            Projid: req.body.proj_name,
            Ownerid: req.body.owner_pid,
            // Projid: 'SSD',
            // Ownerid: 1112,
            CreatedTime: current_time,
            Status: "Not Validated",
            Step: -1,
            IsFinished: "No",
            LstUpd: current_time,
        })

        const step_count = await step.find({})
        s = step_count.length
        await step.create({
            S1id: s + 1,
            Pid: req.body.owner_pid,
            Sprojid: req.body.proj_name,
            StepID: -1,
            Ssave: "Null",
            Svalidated: "Null",
            Ssavetime: "Null",
            Svalidated_time: "Null",
            SLstupd: current_time,
        })

        res.json({ status: '0', message: 'Project Created' })
    } catch (err) {
        console.log(err);
        res.json({ status: '-1', message: 'Project name already exist or Error in creating project' })
    }
})

app.post('/api/logout', async (req, res) => {
    console.log(req.body)
    try {
        const current_time = new Date();

        session.findOneAndUpdate({ usid: req.body.session_table_entry }, { Logouttime: current_time }, (error, data) => {
            if (error) {
                res.json({ status: '-1', message: 'Entry does not exist' })
            }
            else {
                res.json({ status: '0', message: 'Logged out successfully' })
            }
        })
    } catch (err) {
        console.log(err);
        res.json({ status: '-1', message: 'Error in logging out' })
    }
})


app.listen(1337, () => {
    console.log("Server started on 1337")
})