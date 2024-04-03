import axios from "axios";

export const _API = async (url, method, data, token='4|Z4bR6Gyy1V8vbIs6FT7dh29uFL8arV4IwLQhVKxZ1ca5464f') => { 
  debugger 
  try {
    let headers = {};
    // Check if the data is FormData or a regular object
    if (data instanceof FormData) {
      headers = {
        'Content-Type': 'multipart/form-data',
      };
    } else {
      headers = {
        'Content-Type': 'application/json',
      };
    }

    // If a token is provided, include it in the headers
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios({
      url: url,
      method: method,
      data: data,
      headers: headers,
    });
    // Check the response status and handle accordingly
    if (response.status === 200) {
      // Handle successful response
    } else {
      console.error(response.data);
    }
    return response;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
