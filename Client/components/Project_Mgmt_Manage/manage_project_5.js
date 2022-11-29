import React, { useState, useEffect } from "react"
import axios from "axios"
import VR_IMG from '../../images/vr_new.png';
import LOADER from '../../images/loader.gif';
import { useNavigate, useSearchParams } from "react-router-dom";
import "./manage_project_1.css"

// Manage Project 
const Manage_Project_5 = ({ setLoginUser }) => {

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    let project_id = searchParams.get("proj_id");
    let project_name = searchParams.get("p_name");
    // let step_no = Number(searchParams.get("step_no"));
    let step_no = 3;

    let err_flag = 1; // error

    const [temp, setTemp] = useState({
        standard_json: ""
    })

    const [input_json_validation, setJSON] = useState({
        input_json_content: "",
        pid: JSON.parse(localStorage.getItem("user")).pid,
        step_no: step_no + 1,
        proj_id: project_name
    });

    const handle_change = e => {
        err_flag = 1;
        const { name, value } = e.target
        setJSON({
            ...input_json_validation,
            [name]: value
        })
    }

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

    let scene_json1;

    // to read the standard JSON file
    useEffect(() => {
        axios.post("http://localhost:1337/api/get_standard_json", { type: String(1 + step_no) })
            .then(function (response) {
                let json_array = response.data.json_content;
                //console.log(json_array);
                // alert("Called");
                json_array.map((item) => {
                    scene_json1 = item.file_contents;
                })

                temp.standard_json = scene_json1;
                alert(temp.standard_json);

                documentation(JSON.parse(temp.standard_json));
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                alert("Error");
            })
            .then(function () {
                // always executed
            });
    }, []);

    let k;

    const documentation = (JSONValidatorObject) => {
        let validator_keys = Object.keys(JSONValidatorObject);
        //let validator_keys2 = Object.keys(sceneValidator);

        console.log(validator_keys);

        let property_to_display = "";
        document.getElementById("json_props").innerHTML = "";

        for (k of validator_keys) {
            property_to_display = "<a data-toggle='tooltip' data-placement='right' title='" + "(" + JSONValidatorObject[k]["req"].toUpperCase() + ", " + JSONValidatorObject[k]["typeof"].toUpperCase() + ") - " + JSONValidatorObject[k]["\%comment\%"] + "'><span class='prop_name'>&#x25B6;&nbsp;" + k + "</span></a>";
            document.getElementById("json_props").innerHTML += property_to_display + "<br/>";
        }
    }

    // extract datatype from input string 
    const extract = (data) => {
        if (data.trimStart().trimEnd() == "true" || data.trimStart().trimEnd() == "false") {
            return "boolean"

        }
        else if (isNaN(data.trimStart().trimEnd()) == false) {
            return "number"
        }
        return "string"
    }

    let err_str = "";
    let temp_err_flag = -1;

    const check_type_array = (ArrayObject, datatype) => {
        // console.log("Checking array")
        let flag = true // assuming array has valid entries  
        for (let element of ArrayObject) {
            // console.log(element)
            if(typeof element == "object") {
                if(Array.isArray(element) == true) {
                    // it is an Array Object 
                    // console.log("Checking array function")
                    flag = check_type_array(element, datatype)
                }
                else {
                    // console.log("Checking object function")
                    flag = check_type(element, datatype)
                }
            }
            else if(extract(element) != datatype) {
                flag = false;
                console.log("Error: " + element + " input is of " + typeof element + " type");
                err_str += "<span class='ERR'>[Error]: "+element+" input is of " + typeof element + " type </span><br/>";
                temp_err_flag = 1;
            }
        }
        return flag;
    }
    
    // check if the fields in the JSON are of the given typconst check_type = (JSONObject, datatype) = {
    const check_type = (JSONObject, datatype) => {
        // console.log("Checking object")
        // console.log(datatype);
        let flag = true // assuming JSONObject has valid entries  
        let keys = Object.keys(JSONObject);
        for (let k of keys) {
            // console.log(k);
            // console.log(JSONObject[k]);
            if(typeof JSONObject[k] == "object") {
                if(Array.isArray(JSONObject[k]) == true) {
                    // it is an Array Object 
                    // console.log("Checking array function")
                    flag = check_type_array(JSONObject[k], datatype)
                }
                else {
                    // console.log("Checking object function")
                    flag = check_type(JSONObject[k], datatype)
                }
            }
            else if(extract(JSONObject[k]) != datatype) {
                flag = false;
                console.log("Error: " + k + " input is of " + typeof JSONObject[k] + " type");
                err_str += "<span class='ERR'>[Error]: " + k + " input is of " + typeof JSONObject[k] + " type" + "</span><br/>";
                temp_err_flag = 1;
            }
        }
        return flag;
    } 
    
    const validate = (jsonObject, validator) => {
        
        // get the list of keys of the sceneValidator object 
        let validator_keys = Object.keys(validator);
        console.log(validator_keys)
        let flag = true; // assume valid entries in jsonObject 
        for (let k of validator_keys) {
            if(jsonObject[k] == undefined) {
                // the field is not there, so we check if it is mandatory 
                if(validator[k].req == "mandatory") {
                    // the field is mandatory, so we throw error 
                    console.log("Error: Input JSON doesn't have field " + k);
                    err_str += "<span class='ERR'>[Error]: Input JSON doesn't have field " + k + "</span><br/>";
                    temp_err_flag = 1;
                }
                // else the field is optional, so we continue
            }
            else {
                // we check if the properties are valid 
                // console.log("Input type: "  + typeof inputObj[k]);
                // console.log("Actual type: " + extract(inputObj[k]));
                // console.log("Type Needed: " + sceneValidator[k].typeof);
                if(typeof jsonObject[k] == "object") {
                    // console.log("Object : " + jsonObject[k])
                    if(Array.isArray(jsonObject[k] == true)) {
                        // it is an Array Object 
                        // console.log("Checking array")
                        flag = check_type_array(jsonObject[k], validator[k].typeof)
                    }
                    else {
                        // it is a JSON Object
                        // console.log("Checking JSON")
                        flag = check_type(jsonObject[k], validator[k].typeof)
                    }
    
                    if(flag == true) {
                        // console.log("[OK] " + k);
                        err_str += "<span class='OK'>[OK] " + k + "</span><br/>";
                    }
                }
                else {
                    if(extract(jsonObject[k]) != validator[k].typeof) {
                        // property type is invalid
                        console.log("Error: " + k + " input is of " + typeof jsonObject[k] + " type")
                        err_str += "<span class='ERR'>[Error]: " + k + " input is of " + typeof jsonObject[k] + " type" + "</span><br/>";
                        temp_err_flag = 1;
                    }
                    else {
                        // property type is valid 
                        // console.log("[OK] " + k);
                        err_str += "<span class='OK'>[OK] " + k + "</span><br/>";
                    }
                }
            }
    
        }
    
        // Check if the inputObj has some extra fields that are not 
        // part of the sceneValidator fields
        let jsonObject_keys = Object.keys(jsonObject);
        // console.log(sceneValidator._sid.req)
    
        for (k of jsonObject_keys) {
            if(validator_keys.includes(k) == false) {
                console.log("Error: " + k + " is not part of validator JSON")
                err_str += "<span class='ERR'>[Error]: Input JSON doesn't have field " + k + "</span><br/>";
                temp_err_flag = 1;
            }
        }
    
        document.getElementById("json_validation_msg").innerHTML = err_str;
    
        if (temp_err_flag == -1) {
            // no error
            err_flag = -1;
        } else {
            // error
            err_flag = 1;
        }
    }

    const validate_json_against_standard_json = () => {
        // validate JSON against standard JSON files
        validate(JSON.parse(input_json_validation.input_json_content), JSON.parse(temp.standard_json));
    }

    const upload = () => {
        document.getElementById("error_msg").innerHTML = '<img src="' + LOADER + '" width="100px" /> &nbsp;Uploading..';
        
        if (window.confirm("Are you sure you want to upload ?")) {
            axios.post("http://localhost:1337/api/upload_json", input_json_validation)
                .then((response) => {
                    console.log(response.data.message);
                    console.log(response.data.status);

                    document.getElementById("error_msg").innerHTML = "&#9889;&#9889;&nbsp;<span id='project_completion_msg'>Project Completed Successfully..!!</span>&nbsp;&#9889;&#9889;";

                    document.getElementById("validate_btn").disabled = true;
                    document.getElementById("upload_btn").disabled = true;
                    document.getElementById("json_validation_msg").innerHTML = "";
                    document.getElementById("json_copy_paste_textarea").value = "";

                    err_flag = 2; // enable next
                    return;
                });
        } else {
            document.getElementById("error_msg").innerHTML = "";
        }
    }

    const move_to_home = () => {
        navigate("../view_project");
    }

    return (
        <div>
            {/* {console.log("Project_Data", project_info)} */}
            {console.log("input", input_json_validation)}
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

                            <p id="json_type_prop_display">
                                <span className="glyphicon glyphicon-hand-right"></span>&nbsp;<b>Scene Timeline JSON</b><hr />
                                <div id="json_props">
                                    <img src={LOADER} width="100px" />
                                </div>
                            </p>
                        </td>
                        <td id="mid_panel">
                            <div className="progress">
                                <div className="progress-bar progress-bar-success" role="progressbar" id="scene_pb_ic">
                                    <span className="done">&#10003;&nbsp;</span>Scene JSON
                                </div>
                                <div className="progress-bar progress-bar-success" role="progressbar" id="action_response_pb_ic">
                                    <span className="done">&#10003;&nbsp;</span>Action Response
                                </div>
                                <div className="progress-bar progress-bar-success" role="progressbar" id="asset_pb_ic">
                                    <span className="done">&#10003;&nbsp;</span>Asset
                                </div>
                                <div className="progress-bar progress-bar-success" role="progressbar" id="json_4_pb_ic">
                                    <span className="done">&#10003;&nbsp;</span>Custom JSON
                                </div>
                                <div className="progress-bar progress-bar-danger" role="progressbar" id="json_5_pb_ic">
                                    <span>&#10095;&nbsp;&#10095;&nbsp;&#10095;&nbsp;</span>Scene Timeline
                                </div>
                            </div>

                            <table id="t1">
                                <tbody>
                                    <tr>
                                        <td style={{ borderRight:"1px solid lightgray",paddingTop: 2, paddingBottom: 0, paddingRight: 1, paddingLeft: 1 }}>
                                            <textarea rows="28" cols="65" id="json_copy_paste_textarea" name="input_json_content" onChange={handle_change} value={input_json_validation.input_json_content} placeholder="Copy and Paste JSON here"></textarea>
                                        </td>
                                        <td id="json_validation_msg_td">
                                            <div id="json_validation_msg">
                                                <span style={{ color: "gray" }}>~ No Error ~</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr style={{backgroundColor:"white",borderTop:"1px solid lightgray"}}>
                                        <td colSpan={2}>
                                            {/* <button disabled={err_flag == 1 ? false : true} id="validate_btn" className='action_btn btn btn-primary btn-sm' onClick={validate_json_against_standard_json}>
                                                <span className='glyphicon glyphicon-check'></span>&nbsp;Validate
                                            </button>&nbsp;&nbsp;
                                            <button disabled={err_flag == -1 ? false : true} id="upload_btn" className='action_btn btn btn-primary btn-sm' onClick={upload}>
                                                <span className='glyphicon glyphicon-save'></span>&nbsp;Upload
                                            </button>&nbsp;&nbsp;
                                            */}
                                            <button id="validate_btn" className='action_btn btn btn-primary btn-sm' onClick={validate_json_against_standard_json}>
                                                <span className='glyphicon glyphicon-check'></span>&nbsp;Validate
                                            </button>&nbsp;&nbsp;
                                            <button id="upload_btn" className='action_btn btn btn-primary btn-sm' onClick={upload}>
                                                <span className='glyphicon glyphicon-save'></span>&nbsp;Upload
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div id="error_msg" style={{ color: "purple", fontWeight: "bold" }}></div>
        </div>
    )
}

export default Manage_Project_5