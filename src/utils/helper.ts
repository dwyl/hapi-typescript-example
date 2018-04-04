import * as Jwt from "jsonwebtoken";
import * as Mongoose from "mongoose";
import { getDatabaseConfig, getServerConfigs, IServerConfigurations } from "../configurations";
import { LogModel } from "../api/logs/logs";
import * as Boom from "boom";

let config: any = getServerConfigs();

//Blacklisted domains lists
//Which is not allowed at our platform
let blackListDomains: any = [
    "gmail.com",
    "rediffmail.com",
    "outlook.com",
    "live.com",
    "hotmail.com",
    "yahoomail.com",
    "ymail.com",
    "yahoo.co.in",
    "yahoo.co.uk"];

//Database logging async call for storing users logs
export const dbLogger = async (userId: string, payload: string, response: string) => {

    // create a new log
    var newLog = new LogModel({ userId, payload, response });

    try {
        newLog.save();
    } catch (error) {
        console.log("error" + error);
    }
};

//To generate new JWT token using predefined signatire
export const generateToken = (user: any) => {
    console.log(config["jwtSecret"]);
    const jwtSecret = config.jwtSecret;
    const jwtExpiration = config.jwtExpiration;
    const payload = { id: user["_id"] };
    return Jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiration });
};

//To generate 5 digit numeric OTP
export const generateNumericOTP = () => {
    return Math.floor(Math.random() * 90000) + 10000;
};

//To generate 5 digit alpha numeric OTP (exluding letters like 'i, I' since it creates issue for users in terms of reading)
export const generateAlphaNumericOTP = () => {
    let verificationCode = "";
    let charset = "abcdefghjkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ234567890";
    for (let i = 0; i < 5; i++) {
        verificationCode += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return verificationCode;
};


//Validate member email format via comparing it from available blacklist
export const validateEmailDomain = async (email: string) => {

    let domainResponse = await this.getEmailDomain(email);
    let responseSet: any = {};

    //Checking returing isCurrentDomain reponse statusCode to validate isCurrentDomain status
    //Handling if only since else will always be true, hence capturing false flag only

    if (!domainResponse["statusCode"]) {
        return domainResponse;
    }

    //To check email domain in blacklisted domains
    for (let i = 0; i < blackListDomains.length; i++) {

        //Preparing fallback response and returning it to its parent call
        if (blackListDomains[i] === domainResponse["emailDomain"]) {
            responseSet["statusCode"] = false;
            responseSet["statusMessage"] = `@${blackListDomains[i]} is not allowed, please provide a valid corporate email address`;
            responseSet["emailDomain"] = domainResponse["emailDomain"];
            return responseSet;
        }
    }

    //Preparing success response and returning it to its parent call
    responseSet["statusCode"] = true;
    responseSet["statusMessage"] = `@${domainResponse["emailDomain"]} is allowed`;
    responseSet["emailDomain"] = domainResponse["emailDomain"];
    return responseSet;
};

//To obtain email domain for evaluating office domain
export const getEmailDomain = async (email: string) => {

    //To check whether the provided data in in valid email format or not
    let isEmail = await this.checkEmailFormat(email);
    let responseSet: any = {};

    //Checking returing isEmail reponse statusCode to validate email status
    //Handling if only since else will always be true, hence capturing false flag only

    if (!isEmail["statusCode"]) {
        return isEmail;
    }

    //To obtain email domain
    try {
        let currentDomain: string = email.substring(email.lastIndexOf("@") + 1);
        responseSet["statusCode"] = true;
        responseSet["statusMessage"] = "Email format is valid";
        responseSet["emailDomain"] = currentDomain;
        return responseSet;
    } catch (error) {
        responseSet["statusCode"] = false;
        responseSet["statusMessage"] = "Unable to get email domain";
        return responseSet;
    }
};

//To obtain email domain for evaluating office domain
export const checkEmailFormat = (email: string) => {

    // custom regular expression to validate email
    let emailRegex: any = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    let responseSet: any = {};

    //Preparing response set to customize this method to be more generic.
    //Where "statusCode" defines its validity and,
    //"StatusMessage" defines the message associated with it.

    try {
        let isEmail: boolean = emailRegex.test(email);
        if (isEmail) {
            responseSet["statusCode"] = isEmail;
            responseSet["statusMessage"] = "Email format is valid";
        } else {
            responseSet["statusCode"] = isEmail;
            responseSet["statusMessage"] = "Email format is not valid";
        }
        return responseSet;
    } catch (error) {
        responseSet["statusCode"] = false;
        responseSet["statusMessage"] = "Email format is not valid";
        return responseSet;
    }
};

//Sort array with key element
export const sortArray = (key: string) => {
    return function (a, b) {
        if (a[key] > b[key]) {
            return 1;
        } else if (a[key] < b[key]) {
            return -1;
        }
        return 0;
    };
};


//Sort array with key element
export const removeDuplicatesFromArray = (arr: any, key: string) => {
    if (!(arr instanceof Array) || key && typeof key !== 'string') {
        return false;
    }

    if (key && typeof key === 'string') {
        return arr.filter((obj, index, arr) => {
            return arr.map(mapObj => mapObj[key]).indexOf(obj[key]) === index;
        });

    } else {
        return arr.filter(function (item, index, arr) {
            return arr.indexOf(item) === index;
        });
    }
};