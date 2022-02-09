import axios from "axios";

// todo: Env Setting
const URL_BASE = process.env.REACT_APP_API_HOST;
const Request = axios.create({
    baseURL: URL_BASE
});

export default Request;