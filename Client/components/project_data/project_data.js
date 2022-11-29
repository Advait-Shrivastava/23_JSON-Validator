import React, { useState, useEffect } from "react"
import axios from "axios"
import LOADER from '../../images/loader.gif';
import { useNavigate } from "react-router-dom";

// View Project 
// Onload project details are required

const TableEntry = ({ pid }) => {
    const navigate = useNavigate()
    
    pid.forEach(project => {
        console.log(project._id)
    })

    return (
        <tr>
            <td colSpan={5}>
                <img src={LOADER} id="vr_logo" />
                <br /><br />
                <span id="loading_msg">
                    Loading...
                </span>
            </td>
        </tr>
    )
}

export default TableEntry