import React, { useState } from "react"
import axios from "axios"
import VR_IMG from '../../images/vr_new.png';
import LOADER from '../../images/loader.gif';
import { useNavigate } from "react-router-dom";
import "./create_project.css"

// Create Project 

const Create_Project = ({ setLoginUser }) => {

    const navigate = useNavigate()

    const [project_info, setProject] = useState({
        proj_name: "",
        owner_pid: JSON.parse(localStorage.getItem("user")).pid
    })

    const handle_change = e => {
        const { name, value } = e.target

        setProject({
            ...project_info,
            [name]: value
        })

    }

    const logout = () => {
        if (window.confirm("Are you sure you want to Logout ?")) {
            setLoginUser({})
            localStorage.clear();
            navigate("/")
        }
    }

    const project_creation_confirmation = () => {

        if (project_info.proj_name.trim().length == 0) {
            document.getElementById("error_msg").innerHTML = "Invalid Project Name";
            return;
        }

        if (window.confirm("Are you sure you want to create this project ?")) {
            // send project_info object to backend
            document.getElementById("error_msg").innerHTML = '<img src="' + LOADER + '" width="100px" /> &nbsp;Uploading..';

            axios.post("http://localhost:1337/api/create_project", project_info)
                .then((response) => {
                    console.log(response.data.status);

                    if (response.data.status == "-1") {
                        document.getElementById("error_msg").innerHTML = "Project Name already Exists..!!";
                        return;
                    }

                    // all set
                    document.getElementById("error_msg").innerHTML = "Project Created Successfully..!!"
                    document.getElementById("id_p_name").value = "";
                });
        } else {
            document.getElementById("error_msg").innerHTML = "";
        }
    }

    return (
        <div>
            {console.log("Project_Data", project_info)}
            <div id="header">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <img src={VR_IMG} id="vr_logo" />
                            </td>
                            <td id="description">
                                <a href="#">Working with VReqSL</a>
                            </td>
                            <td id="about_us">
                                <a href="#">About Us</a>
                            </td>
                            <td>
                                <p>
                                    <span id="user_desc">Welcome {JSON.parse(localStorage.getItem("user")).email}</span>
                                    <br />
                                    <button type="button" className="btn btn-danger btn-lg" onClick={logout}>
                                        <span className="glyphicon glyphicon-log-out"></span> Logout
                                    </button>
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <hr />
            </div>

            <table id="data_table">
                <tbody>
                    <tr>
                        <td id="left_panel">
                            <p>
                                <a href="./create_project" className="btn btn-default btn-lg">
                                    <span className="glyphicon glyphicon-plus-sign"></span>&nbsp;&nbsp;
                                    <span className="options">Create Project</span>
                                </a>
                            </p>
                            <p>
                                <a href="view_project" className="btn btn-default btn-lg">
                                    <span className="glyphicon glyphicon-random"></span>&nbsp;&nbsp;
                                    <span className="options">Manage Project</span>
                                </a>
                            </p>
                        </td>
                        <td>
                            <table id="t1">
                                <tbody>
                                    <tr>
                                        <td>
                                            &#9755;&nbsp;&nbsp;Name of Project&nbsp;&nbsp;:
                                        </td>
                                        <td>
                                            <input id="id_p_name" type="text" name="proj_name" value={project_info.proj_name} placeholder="Project Name" onChange={handle_change} />
                                        </td>
                                        <td>
                                            <button type="button" className="btn btn-primary btn-lg" onClick={project_creation_confirmation}>
                                                <span className="glyphicon glyphicon-send"></span> Create
                                            </button>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>



            <div id="error_msg"></div>
        </div>
    )
}

export default Create_Project