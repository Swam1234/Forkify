import { TIMEOUT } from "./config.js";

export const sendRequest = async function (url) {
 try {
  const response = await Promise.race([fetch(url), timeout(TIMEOUT)]);
  const data = await response.json();
  if (!response.ok) throw new Error(`${data.status}, ${data.message}`);
  return data;
 } catch (error) {
  console.log(error);
  throw error
 }
}

export const postRequest = async function (url, uploadData) {
 try {
  const option = {
   method: "POST",
   headers: {
    "Content-Type": "application/json"
   },
   body: JSON.stringify(uploadData)
  }
  const response = await Promise.race([fetch(url, option), timeout(TIMEOUT)]);
  const data = await response.json();
  if (!response.ok) throw new Error(`${data.status}, ${data.message}`);
  return data;
 } catch (error) {
  console.log(error);
  throw error;
 }
}

const timeout = function (s) {
 return new Promise((_, reject) => {
  setTimeout(_ => reject(new Error(`Request took too long! Timeout after ${s} seconds`)), s * 1000);
 })
}
