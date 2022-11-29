import React, { useState } from "react"
import axios from "axios"
import "./user.css"
import VR_IMG from '../../images/vr_new.png';
import { useNavigate } from "react-router-dom";

const User_home = ({ setLoginUser }) => {
    const navigate = useNavigate()

    const logout = () => {
        if (window.confirm("Are you sure you want to Logout ?")) {
            setLoginUser({})
            localStorage.clear();
            navigate("/")
        }
    }

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
                                    {/* <span id="user_desc">Welcome User1</span> */}
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
                                <a href="#" className="btn btn-default btn-lg">
                                    <span className="glyphicon glyphicon-random"></span>&nbsp;&nbsp;
                                    <span className="options">Manage Project</span>
                                </a>
                            </p>
                        </td>
                        <td>
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
                                            Owner
                                        </th>
                                        <th>
                                            Stage
                                        </th>
                                        <th>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            1
                                        </td>
                                        <td>
                                            XYZ
                                        </td>
                                        <td>
                                            Ayush
                                        </td>
                                        <td>
                                            3
                                        </td>
                                        <td>
                                            <button className="action_btn btn btn-primary btn-sm">
                                                <span className="glyphicon glyphicon-pencil"></span>&nbsp;Edit</button>&nbsp;
                                            <button className="action_btn btn btn-primary btn-sm">
                                                <span className="glyphicon glyphicon-eye-open"></span>&nbsp;View
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
    )
}

export default User_home