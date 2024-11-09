const axios = require("axios");
const fs = require("fs");

// Define the endpoint URL
const url = "http://localhost:5000/api/provinces"; // Replace with your actual endpoint

// Load the local JSON file
fs.readFile(
  "merged_province_geo_livestock_data.json",
  "utf8",
  async (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    // Parse the JSON data
    const jsonData = JSON.parse(data);
    console.log(jsonData);
    // Loop over each element in the JSON array and send a POST request
    for (const item of jsonData) {
      console.log(item);
      // try {
      //   const response = await axios.post(url, item, {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   });
      //   console.log("Success:", response.data);
      // } catch (error) {
      //   console.error(
      //     "Error:",
      //     error.response ? error.response.data : error.message
      //   );
      // }
    }
  }
);
