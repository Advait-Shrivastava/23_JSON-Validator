import React, { useState } from "react"
import "./register.css";
import VR_IMG from '../../images/VR.jpg';
import LOADER from '../../images/loader.gif';
import REGISTER_IMG from '../../images/register.png';
import axios from "axios";


const Register = () => {
    const [user, setUser] = useState({
        fname: "",
        organization: "",
        email: "",
        password: "",
        firstname : "",
        lastname : ""
    })

    const handle_change = e => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const register = () => {
        document.getElementById("error_msg_2").innerHTML = '<img src="' + LOADER + '" width="100px" />';
        
        const {first_name, last_name, organization, email, password} = user;
        
        axios.post("http://localhost:1337/api/register", {
            firstname : user.firstname,
            lastname : user.lastname,
            organization : user.organization,
            email : user.email,
            password : user.password
        })
        .then(resp => {
            console.log(resp.data.message);
            if(Number(resp.data.status) == -1){
                // already registered
                document.getElementById("error_msg_2").innerHTML = "";
                document.getElementById("error_msg").innerHTML = "Email ID already in use"
                return;
            } 
            
            document.getElementById("error_msg").innerHTML = "";
            document.getElementById("error_msg_2").innerHTML = "Successsfully Registered..!!";  
            document.getElementById("id_name").value ="";
            document.getElementById("id_org").value ="";
            document.getElementById("id_email").value ="";
            document.getElementById("id_password").value ="";
        });
    }

    const check_values = () => {
        // directly check in user object 

        let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        let name_org_Pattern = /^[a-zA-Z ]*$/;

        if(user.fname.length == 0 || !name_org_Pattern.test(user.fname)){
            document.getElementById("error_msg").innerHTML = "Invalid Full Name";
            
            return;
        }

        if(user.fname.length == 0 || !name_org_Pattern.test(user.organization)){
            document.getElementById("error_msg").innerHTML = "Invalid Organization Name";
            return;
        }

        if (user.email.trim().length == 0 || !emailPattern.test(user.email)) {
            document.getElementById("error_msg").innerHTML = "Invalid email";
            return;
        }
        
        if(user.password.trim().length == 0 || user.password.indexOf(' ') >= 0){
            document.getElementById("error_msg").innerHTML = "Invalid Password";
            return;
        }

        // all are correct
        const name_arr = user.fname.split(" ");
        user.firstname = name_arr[0];
        user.lastname = name_arr[1];

        register();
    }

    return (
        <div className="register_page">
            {console.log("User", user)}

            <div className="flex-container">
                <div className="flex-child">
                    <img src={VR_IMG} id="vr_logo_1" />
                    <div id="about_vreqst">
                        <h2>About VREQST Tool</h2>
                        OUR SSD Project is JSON Validator<br />
                        Our mentor is Sai Anirudh Karri
                    </div>
                </div>

                <div className="flex-child login_input">
                    <br/>
                    <div id="login_box" style={{marginTop:-10}}>
                        <img src={REGISTER_IMG} style={{width:180}}/><br/>
                        <input id="id_name" type="text" name="fname" placeholder="Full Name" value={user.fname} onChange={handle_change} />
                        <br /><br />
                        <input id="id_org" type="text" name="organization" placeholder="Organization" value={user.organization} onChange={handle_change} />
                        <br /><br />
                        <input id="id_email" type="text" name="email" placeholder="Email ID" value={user.email} onChange={handle_change} />
                        <br /><br />
                        <input id="id_password" type="password" name="password" placeholder="Password" value={user.password} onChange={handle_change} />
                        <br /><br />
                        <button type="button" onClick={check_values}>
                            <span className="glyphicon glyphicon-log-in"></span> Register
                        </button>
                    </div>
                    <br />

                    <div id="login_desk">
                        <p>
                            If registered, <a href="/" id="redirect_to_login">Click here to Login</a>
                            {/* If registered, <a onClick = {() => navigate("/")} id="redirect_to_login">Click here to Login</a> */}
                        </p>
                    </div>

                    <div id="error_msg" style={{color:"red"}}></div>
                    <div id="error_msg_2"></div>
                </div>
            </div>

        </div>
    )
}

export default Register