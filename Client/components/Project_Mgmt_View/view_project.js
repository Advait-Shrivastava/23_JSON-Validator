import React, { useState, useEffect } from "react"
import axios from "axios"
import VR_IMG from '../../images/vr_new.png';
import { useNavigate } from "react-router-dom";
import LOADER from '../../images/loader.gif';
import "./view_project.css"

// View Project 
// Onload project details are required

const View_Project = ({ setLoginUser }) => {
    const navigate = useNavigate()

    const [project_list, setData] = useState([])

    let sr_no = 1;

    // const logout = () => {
    //     if (window.confirm("Are you sure you want to Logout ?")) {
    //         setLoginUser({})
    //         localStorage.clear();
    //         navigate("/")
    //     }
    // }

    const logout = () => {
        if (window.confirm("Are you sure you want to Logout ?")) {

            axios.post("http://localhost:1337/api/logout", { session_table_entry: localStorage.getItem("session_table_entry") })
                .then((response) => {
                    console.log(response.data.message);
                    console.log(response.data.status);

                    if (response.data.status == -1) {
                        alert("Failed to logout");
                        return;
                    }

                    setLoginUser({})
                    localStorage.clear();
                    navigate("/")

                    return;
                });
        }
    }

    const edit_project = (e, name, step_no) => {
        if (step_no == -1) {
            navigate("../manage_project_1?proj_id=" + e.target.id + "&&p_name=" + name);
        } else if (step_no == 0) {
            navigate("../manage_project_2?proj_id=" + e.target.id + "&&p_name=" + name);
        } else if (step_no == 1) {
            navigate("../manage_project_3?proj_id=" + e.target.id + "&&p_name=" + name);
        } else if (step_no == 2) {
            navigate("../manage_project_4?proj_id=" + e.target.id + "&&p_name=" + name);
        } else if (step_no == 3) {
            navigate("../manage_project_5?proj_id=" + e.target.id + "&&p_name=" + name);
        }
    }

    const view_project_info = (e, name, step_no) => {
        navigate("../show_project_status?proj_id=" + e.target.id + "&&p_name=" + name + "&&curr_step=" + step_no);
    }

    useEffect(() => {
        axios.post("http://localhost:1337/api/view_project", { pid: JSON.parse(localStorage.getItem("user")).pid })
            .then(function (response) {
                console.log(response.data.list_of_projects);
                setData(response.data.list_of_projects);
                document.getElementById("loader_row").style.display = "none";
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }, []);

    return (
        <div>
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
                        </td>
                        <td>
                            <div className="progress">
                                <div className="progress-bar progress-bar-danger" role="progressbar" id="scene_pb_ic">
                                    <b style={{ color: "yellow" }}>Stage - 0</b>:&nbsp;Scene JSON
                                </div>
                                <div className="progress-bar progress-bar-danger" role="progressbar" id="action_response_pb_ic">
                                    <b style={{ color: "yellow" }}>Stage - 1</b>:&nbsp;Action Response
                                </div>
                                <div className="progress-bar progress-bar-danger" role="progressbar" id="asset_pb_ic">
                                    <b style={{ color: "yellow" }}>Stage - 2</b>:&nbsp;Asset
                                </div>
                                <div className="progress-bar progress-bar-danger" role="progressbar" id="json_4_pb_ic">
                                    <b style={{ color: "yellow" }}>Stage - 3</b>:&nbsp;Custom JSON
                                </div>
                                <div className="progress-bar progress-bar-danger" role="progressbar" id="json_5_pb_ic">
                                    <b style={{ color: "yellow" }}>Stage - 4</b>:&nbsp;Scene Timeline
                                </div>
                            </div>

                            <table id="project_view">
                                <thead>
                                    <tr>
                                        <th>
                                            Sr.No.
                                        </th>
                                        <th>
                                            Project Name
                                        </th>
                                        <th>
                                            Owner ID
                                        </th>
                                        <th>
                                            Stage
                                        </th>
                                        <th>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody id="list_of_projects">
                                    <tr id="loader_row">
                                        <td colSpan={5}>
                                            <img src={LOADER} width="100px" />
                                        </td>
                                    </tr>

                                    {
                                        project_list.map((item) => {
                                            return (
                                                <tr>
                                                    <td>
                                                        {sr_no++}
                                                    </td>
                                                    <td>
                                                        {item.Projid}
                                                    </td>
                                                    <td>
                                                        {item.Ownerid}
                                                    </td>
                                                    <td>
                                                        {
                                                            Number(item.Step) < 4 ? Number(item.Step) + 1 : <span style={{ color: "blue" }}><b>&#9745;&nbsp;Completed</b></span>
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            (Number(item.Step) == 4) ?
                                                                <div>
                                                                    <button id={item._id} onClick={(e) => view_project_info(e, item.Projid, item.Step)} className='action_btn btn btn-primary btn-sm'>
                                                                        <span className='glyphicon glyphicon-eye-open'></span>&nbsp;View
                                                                    </button>&nbsp;&nbsp;
                                                                </div>
                                                                :
                                                                <div>
                                                                    <button id={item._id} onClick={(e) => edit_project(e, item.Projid, item.Step)} className='action_btn btn btn-primary btn-sm'>
                                                                        <span className='glyphicon glyphicon-pencil'></span>&nbsp;Edit
                                                                    </button>&nbsp;&nbsp;
                                                                    <button id={item._id} onClick={(e) => view_project_info(e, item.Projid, item.Step)} className='action_btn btn btn-primary btn-sm'>
                                                                        <span className='glyphicon glyphicon-eye-open'></span>&nbsp;View
                                                                    </button>
                                                                </div>
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })}
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

export default View_Project