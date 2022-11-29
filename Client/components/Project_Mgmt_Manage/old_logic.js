const check_type = (JSONObject, datatype) => {
    let keys = Object.keys(JSONObject);
    for (k of keys) {
        if (typeof JSONObject[k] == "object") {
            check_type(JSONObject[k], datatype)
        }
        else if (extract(JSONObject[k]) != datatype) {
            //console.log("Error: " + k + " has input of " + typeof JSONObject[k] + " type");
            err_str += "<span class='ERR'>[Error]: " + k + " has input of " + typeof JSONObject[k] + " type" + "</span><br/>";
            temp_err_flag = 1;
        }
    }
}

const validate = (jsonObject, validator) => {
    // get the list of keys of the sceneValidator object 
    err_str = "";
    let validator_keys = Object.keys(validator);

    //console.log(validator_keys);

    for (k of validator_keys) {
        if (jsonObject[k] == undefined) {
            // the field is not there, so we check if it is mandatory 
            if (validator[k].req == "mandatory") {
                // the field is mandatory, so we throw error 
                //console.log("Error: Input JSON doesn't have field " + k);
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
            if (typeof jsonObject[k] == "object") {
                check_type(jsonObject[k], validator[k].typeof)
            }
            else {
                if (extract(jsonObject[k]) != validator[k].typeof) {
                    // property type is invalid
                    //console.log("Error: " + k + " has input of " + typeof jsonObject[k] + " type");
                    err_str += "<span class='ERR'>[Error]: " + k + " has input of " + typeof jsonObject[k] + " type" + "</span><br/>";
                    temp_err_flag = 1;
                }
                else {
                    // property type is valid 
                    //console.log("[OK] " + k);
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
        if (validator_keys.includes(k) == false) {
            //console.log("Error: " + k + " is not part of sceneValidator");
            err_str += "<span class='ERR'>[Error]: " + k + " is not part of sceneValidator" + "</span><br/>";
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