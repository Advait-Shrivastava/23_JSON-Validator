import React, { useState, useEffect } from "react"
import axios from "axios"
import VR_IMG from '../../images/vr_new.png';
import LOADER from '../../images/loader.gif';
import { useNavigate, useSearchParams } from "react-router-dom";
import "./show_project_status.css"

// Show Project Status

const Show_Project_Status = ({ setLoginUser }) => {

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    let project_id = searchParams.get("proj_id");

    let project_name = searchParams.get("p_name");
    let step_no = searchParams.get("curr_step");

    const [json_data, setTemp] = useState({
        edited_one: "",
        json_name :""
    })

    const [requested_json, setJSON] = useState({
        pid: JSON.parse(localStorage.getItem("user")).pid,
        step_no: "",
        proj_id: project_name
    });

    const logout = () => {
        if (window.confirm("Are you sure you want to Logout ?")) {
            setLoginUser({})
            localStorage.clear();
            navigate("/")
        }
    }

    const fetch_json_edited = (stage_no) => {
        document.getElementById("edited_json_print").innerHTML = '<img src="' + LOADER + '" width="100px" />';
        requested_json.step_no = stage_no;

        if (stage_no == "0") {
            document.getElementById("json_heading").innerHTML = "Scene JSON";
            json_data.json_name = "Scene_JSON";
        } else if (stage_no == "1") {
            document.getElementById("json_heading").innerHTML = "Action Response JSON";
            json_data.json_name = "Action_Response_JSON";
        } else if (stage_no == "2") {
            document.getElementById("json_heading").innerHTML = "Asset JSON";
            json_data.json_name = "Asset_JSON";
        } else if (stage_no == "3") {
            document.getElementById("json_heading").innerHTML = "Custom JSON";
            json_data.json_name = "Custom_JSON";
        } else if (stage_no == "4") {
            document.getElementById("json_heading").innerHTML = "Scene Timeline JSON";
            json_data.json_name = "Scene_Timeline_JSON";
        }

        //call API to fetch
        let fetched_json;

        axios.post("http://localhost:1337/api/fetch_edited_json", requested_json)
            .then(function (response) {

                let json_array = response.data.json_content;

                json_array.map((item) => {
                    fetched_json = item.input_json_content;
                })

                if (json_array.length != 0) {
                    document.getElementById("edited_json_print").innerHTML = "<pre>" + fetched_json + "</pre>";
                    json_data.edited_one = fetched_json;
                } else {
                    document.getElementById("edited_json_print").innerHTML = "~ Not Available ~";
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });

        console.log("input", requested_json);
    }

    const download_file = () => {
        console.log(json_data.edited_one);
        let logs = json_data.edited_one;
        
        let log_text = "";

        for (let line of logs) {
            log_text += line;
        }

        let myFile = new Blob([log_text], { type: "text/plain;" });

        let dlogs = document.createElement('a');
        dlogs.setAttribute('href', window.URL.createObjectURL(myFile));
        dlogs.setAttribute('download', project_name+"_"+json_data.json_name+'.json');
        dlogs.click();
    }

    return (
        <div>
            {console.log("input", requested_json)}
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
                            <p id="home_btn">
                                <a href="../view_project" className="btn btn-lg">
                                    <span className="glyphicon glyphicon-home"></span>&nbsp;&nbsp;
                                    <span className="options"><b>Home</b></span>
                                </a>
                                <hr />
                            </p>
                            <p id="project_name">
                                <b>~ Project Name ~</b><br />
                                {project_name}
                                <hr />
                            </p>
                            <p id="curr_stage">
                                <b>~ Current Stage ~</b><br />
                                {
                                    Number(step_no) < 4 ? (Number(step_no) + 1) : <span style={{ color: "blue" }}><b>&#9745;&nbsp;Completed</b></span>
                                }
                                <hr />
                            </p>
                            <p>
                                <button onClick={() => fetch_json_edited("0")} type="button" className="json_cat btn btn-link"><span className="glyphicon glyphicon-hand-right"></span>&nbsp;<b>Scene JSON</b></button>
                                <hr />
                            </p>
                            <p>
                                <button onClick={() => fetch_json_edited("1")} type="button" className="json_cat btn btn-link"><span className="glyphicon glyphicon-hand-right"></span>&nbsp;<b>Action Response JSON</b></button>
                                <hr />
                            </p>
                            <p>
                                <button onClick={() => fetch_json_edited("2")} type="button" className="json_cat btn btn-link"><span className="glyphicon glyphicon-hand-right"></span>&nbsp;<b>Asset JSON</b></button>
                                <hr />
                            </p>
                            <p>
                                <button onClick={() => fetch_json_edited("3")} type="button" className="json_cat btn btn-link"><span className="glyphicon glyphicon-hand-right"></span>&nbsp;<b>Custom JSON</b></button>
                                <hr />
                            </p>
                            <p>
                                <button onClick={() => fetch_json_edited("4")} type="button" className="json_cat btn btn-link"><span className="glyphicon glyphicon-hand-right"></span>&nbsp;<b>Scene Timeline JSON</b></button>
                                <hr />
                            </p>

                        </td>

                        <td id="mid_panel">
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

                            <div id="json_heading"></div>
                            <hr />
                            <div id="edited_json_print">
                                <span style={{ color: "lightgrey" }}>~~ Select JSON to display ~~</span>
                            </div>
                            <br />
                            <button type="button" className="btn btn-primary" onClick={download_file}>
                                <span className="glyphicon glyphicon-download-alt"></span> Download
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Show_Project_Status