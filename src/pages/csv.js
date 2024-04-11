import React, { useEffect, useState } from "react";
import axios from "axios";

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  // const [dataArray, setDataArray] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file.");
      return;
    }
    if (!file.name.endsWith(".csv")) {
      setMessage("Please select a CSV file.");
      return;
    }
    const formData = new FormData();
    formData.append("dataSheet", file);

    try {
      const response = await axios.post(
        "http://localhost:8001/upload",
        formData
      );
      if (response?.data?.data) {
        console.log(response.data.data, "hello there");
        // setDataArray(response.data.data);
      }
      setMessage(response?.data?.message); // Extract the message property
    } catch (error) {
      setMessage("Error uploading file");
      console.error("Error uploading file:", error);
    }
  };
  useEffect(() => {
    // Function to fetch last record time
    const fetchLastRecordTime = async () => {
      try {
        const response = await axios.get("http://localhost:8001/lastRecordTime");
        if (response?.data?.lastRecordTime) {
          console.log(response.data.lastRecordTime);
          // Update state with the last record's created time
          // setDataArray([response.data.lastRecordTime]);
        }
      } catch (error) {
        console.error("Error fetching last record time:", error);
      }
    };

    // Function to start long polling for continuous updates
    const startLongPolling = async () => {
      try {
        const response = await axios.get("http://localhost:8001/longPolling");
        if (response?.data?.lastRecordTime) {
          console.log(response.data.lastRecordTime);
          // Update state with the last record's created time
          // setDataArray([response.data.lastRecordTime]);
        }
      } catch (error) {
        console.error("Error with long polling:", error);
      }
    };

    // Fetch last record time once when component mounts
    fetchLastRecordTime();

    // Start long polling for continuous updates
    startLongPolling();

    // Clean up function to clear intervals when component unmounts
    return () => {
      // No need to clear intervals as long polling handles cleanup internally
    };
  }, []); 

  return (
    <div>
      <h2>Upload CSV File</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="file" name="dataSheet" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

      {message && <p>{message}</p>}
      </div>
     );

};

export default UploadCSV;
