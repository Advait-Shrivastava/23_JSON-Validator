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
    err_str = "";
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