import axios from "axios";

// todo: Env Setting
const URL_HTTP_API = process.env.REACT_APP_API_HOST;
const URL_STREAM_API = process.env.REACT_APP_API_HOST_STREAM;
export const HttpRequest = axios.create({
    baseURL: URL_HTTP_API
});

export const getStream = () => new WebSocket(URL_STREAM_API!);