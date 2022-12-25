import cron from "node-cron";

import url from "url";
import path from "path";
import axios from "axios";

const parseURLs = (data) => {
  // Get the type of the data
  const dataType = typeof data;

  // If the data is a string, return the same.
  if (dataType === "string") {
    return data;
  } else if (dataType === "object" && data !== null && !Array.isArray(data)) {
    // If data is an object,
    // not a null value (which also will have a type object),
    // and not an array,
    // recursively invoke the parseURLs function with the nested value
    const keys = Object.keys(data);
    return parseURLs(data[keys[0]]);
  }
};
const getFileURLs = (data) => {
  return data.reduce((fileURLs, data) => {
    const fileURL = parseURLs(data);
    fileURLs.push(fileURL);
    return fileURLs;
  }, []);
};

const saveFileDetails = async ({ url: fileURL, content }) => {
  const parsedURL = url.parse(fileURL);
  const name = path.basename(parsedURL.pathname);
  console.log(name);
  try {
    const { data } = await axios.post("http://localhost:3000/files/create", {
      url: fileURL,
      content,
      name,
    });
    console.log(data.msg);
  } catch (error) {
    console.log(error);
  }
};

const getFileDetails = async (fileURL) => {
  let response;
  try {
    const { data } = await axios.get(fileURL, {
      responseType: "arraybuffer",
    });
    console.log(data);
    response = data;
  } catch (error) {
    console.error(error);
    response = error;
  }
  return response;
};
// Service to fetch the API
const fetchFiles = async () => {
  try {
    const { data } = await axios.get(
      "https://cfrkftig71.execute-api.us-east-1.amazonaws.com/prod?expert=true"
    );
    console.log(data);
    const fileURLs = getFileURLs(data);
    console.log(fileURLs);
    // Get each file and store it.
    for await (let url of fileURLs) {
      const fileDetails = await getFileDetails(url);
      const content = fileDetails.toString("base64");
      await saveFileDetails({ url, content });
    }
  } catch (error) {
    console.error(error);
  }
};

// Schedule the task to run every 5 minutes
cron.schedule("*/5 * * * *", () => {
  console.log("running a task every five minutes");
  fetchFiles();
});
