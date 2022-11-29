import React, { useState } from "react"
import axios from "axios"
import "./admin.css"
import VR_IMG from '../../images/vr_new.png';
import LOADER from '../../images/loader.gif';
import { useNavigate } from "react-router-dom";

// should have option to upload standard JSON files as a string (in textarea) to MongoDB Collection
// Option to upload 5 JSON files {1. Scene Validator, Action Response, 3. Scene, 4. Custom JSON, 5. Scene Timeline}

const Admin_home = ({ setLoginUser }) => {

    // console.log(localStorage.getItem("session_table_entry"));

    const navigate = useNavigate()

    const [json_type, setJSON] = useState({
        type: "",
        file_contents: ""
    })

    const handle_change = e => {
        document.getElementById("msg_box").innerHTML = "";

        const { name, value } = e.target
        if (e.target.value == "0") {
            json_type.type = "0";
        }
        else {
            if (e.target.value == "1") {
                json_type.type = "1";
            } else if (e.target.value == "2") {
                json_type.type = "2";
            } else if (e.target.value == "3") {
                json_type.type = "3";
            } else if (e.target.value == "4") {
                json_type.type = "4";
            }
        }

        setJSON({
            ...json_type,
            [name]: value
        })
    }

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

    const upload_file = () => {
        // check values 
        if (json_type.type.trim().length == 0 || json_type.type === "-1") {
            document.getElementById("msg_box").innerHTML = "Invalid JSON Type";
            return;
        }
        if (json_type.file_contents.trim().length == 0) {
            document.getElementById("msg_box").innerHTML = "Invalid / Empty JSON Content";
            return;
        }


        // all are correct -> ask for upload
        if (window.confirm("Are you sure you want to upload ?")) {
            document.getElementById("msg_box").innerHTML = '<img src="' + LOADER + '" width="100px" /> &nbsp;Uploading..';
            
            axios.post("http://localhost:1337/api/json_upload_admin", json_type)
                .then((response) => {
                    console.log(response.data.message);
                    console.log(response.data.status);

                    if (response.data.status == -1) {
                        document.getElementById("msg_box").innerHTML = "!! JSON Type already uploaded / Error while uploaded JSON File !!";
                        return;
                    }

                    document.getElementById("msg_box").innerHTML = "JSON Type successfully uploaded..!!";
                    document.getElementById("textbox").value = "";
                    return;
                });
        } else{
            document.getElementById("msg_box").innerHTML = "";
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
                                    <span id="user_desc">Welcome Admin</span>
                                    {/* <span id="user_desc">Welcome {JSON.parse(localStorage.getItem("user")).name}</span> */}
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

            <div id="upload_box">
                {console.log("JSON Meta Data", json_type)}

                <span id="select_header">Select JSON Type to upload :</span> &nbsp;
                <select id="drop_down" defaultValue={'-1'} name="json_type" onChange={handle_change}>
                    <option value="-1" disabled>Choose JSON File Type</option>
                    <option value="0">Scene Validator</option>
                    <option value="1">Action Response</option>
                    <option value="2">Asset</option>
                    <option value="3">Custom JSON</option>
                    <option value="4">Scene Timeline</option>
                </select>

                <br /><br />
                <textarea rows="25" cols="80" id="textbox" name="file_contents" placeholder="Copy and paste JSON File contents here" value={json_type.file_contents} onChange={handle_change}></textarea>
                <br /><br />

                <button type="button" className="btn btn-primary btn-lg" id="upload_btn" onClick={upload_file}>
                    <span className="glyphicon glyphicon-cloud-upload"></span> Upload
                </button>
                <br /><br />

                <div id="msg_box"></div>
            </div>

        </div>
    )
}

export default Admin_home