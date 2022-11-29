import React, { useState } from "react"
import "./login.css"
import VR_IMG from '../../images/VR.jpg';
import LOADER from '../../images/loader.gif';
import LOGIN_IMG from '../../images/login.png';
import axios from "axios"
import { useNavigate } from  "react-router-dom";

const Login = ({setLoginUser}) => {

    const navigate   = useNavigate()

    const [user, setUser] = useState({
        email: "",
        password: "",
        role : ""
    })

    const handle_change = e => {
        const { name, value } = e.target
        if(e.target.value == "1"){
            user.role="1";
        }
        else{
            user.role="0";
        }

        setUser({
            ...user,
            [name]: value
        })
    }

    const go_to_login = () => {
        document.getElementById("error_msg_2").innerHTML = '<img src="' + LOADER + '" width="100px" />';
        axios.post("http://localhost:1337/api/login", user)
        .then((response) => {
            console.log(response.data.status);
            // condition check for incorrect credentials
            
            if(Number(response.data.status) == -1){
                // user not registered
                document.getElementById("error_msg_2").innerHTML = 'Invalid Credentials';
                return;
            }

            // console.log(response.data.user2);
            console.log(response.data.user);

            // all set
            setLoginUser(response.data.user)
            localStorage.setItem('user', JSON.stringify(response.data.user)) // to retrieve do JSON.parse
            localStorage.setItem('session_table_entry', JSON.stringify(response.data.session_table_entry))

            navigate("/")
        });
    }

    const check_values = () => {
        // directly check in user object 
        let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        
        if (user.email.trim().length == 0 || !emailPattern.test(user.email)) {
            document.getElementById("error_msg_2").innerHTML = "Invalid email address";
            return;
        }
        
        if(user.password.trim().length == 0 || user.password.indexOf(' ') >= 0){
            document.getElementById("error_msg_2").innerHTML = "Invalid Password";
            return;
        }

        // all are correct -> call login api
        go_to_login();
    }

    return (
        <div className="login_page">
            
            {console.log("User", user)}
            <br/>
            {/* <h1 style={{textAlign:"center"}}>~ Login ~</h1> */}

            <div className="flex-container">

                <div className="flex-child">
                    <img src={VR_IMG} id="vr_logo_1"/>
                    <div id="about_vreqst">
                        <h2>About VREQST Tool</h2>
                        OUR SSD Project is JSON Validator<br/>
                        Our mentor is Sai Anirudh Karri
                    </div>
                </div>

                <div className="flex-child login_input">
                    <div id="login_box">
                    <img src={LOGIN_IMG} id="login_logo"/><br/><br/>
                        <input type="text" name = "email" placeholder = "Email ID" value ={user.email} onChange = {handle_change}/>
                        <br/><br/>
                        <input type="password" name="password" placeholder="Password" value={user.password} onChange = {handle_change}/>
                        <br/><br/>
                        <select name="u_type" onChange={handle_change}>
                            <option value="0">User</option>
                            <option value="1">Admin</option>
                        </select>
                        <br/><br/>
                        <button type="button" onClick={check_values}>
                            <span className="glyphicon glyphicon-log-in"></span> Login
                        </button>
                    </div>

                    <br/><br/>

                    <div id="registration_desk">
                        <p>
                            {/* For new users - <a onClick = {() => navigate("./register")} id="redirect_to_registration">Register here</a> */}
                            For new users - <a href = "./register" id="redirect_to_registration">Register here</a>
                        </p>
                    </div>
                    <br/>
                    <div id="error_msg_2" style={{color:"red"}}></div>
                </div>
            </div>
        </div>
    )
}

export default Login