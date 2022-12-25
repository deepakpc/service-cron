import fs from "fs";

import fsPromises from "fs/promises";

const filePath = "./fileDetails.json";
const writeFileDetails = async (fileDetails) => {
  console.log("In writeFileDetails");
  try {
    await fsPromises.writeFile(filePath, fileDetails);
  } catch (err) {
    console.log(err);
  }
};
const getFileDetails = async () => {
  let data;
  try {
    data = await fsPromises.readFile(filePath);
    console.log(data);
  } catch (err) {
    console.log(err);
  }
  return data;
};

const createFileDetails = async (req, res) => {
  let payload;
  let duplicateFileCount;
  try {
    let { body } = req;
    if (fs.existsSync(filePath)) {
      console.log("In fs.existsSync(filePath)");
      // File exists. Get the data.
      const fileDetails = await getFileDetails();
      const fileDetailsData = JSON.parse(fileDetails);
      duplicateFileCount = fileDetailsData.files.reduce((count, file) => {
        if (file?.name === body?.name) count++;
        return count;
      }, 0);
      // Check whether there are duplicate files.
      // If so, save the file with a suffix
      if (duplicateFileCount > 0) {
        body.name = `${body.name}_${duplicateFileCount + 1}`;
      }
      fileDetailsData.files.push(body);
      payload = fileDetailsData;
    } else payload = { files: [body] };
    console.log("Before writeFileDetails");
    await writeFileDetails(JSON.stringify(payload));
    res.json({
      status: true,
      msg: duplicateFileCount
        ? `Warning: File already exists. File was saved with the name ${body.name}`
        : `File Saved.`,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: true, msg: error });
  }
};
export default { createFileDetails };
