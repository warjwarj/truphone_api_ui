// npm packages
import { useState } from 'react'
import axios from 'axios';

// our packages
import CsvDisplay from './components/CsvDisplay.jsx'
import ApiResDisplay from './components/ApiResDisplay.jsx'
import {
  csvStringToArray,
  organiseRequestDataIntoJson
} from './utils.js'

export default function App() {

  // track the uploaded file
  const [fileContent, setFileContent] = useState([]);

  // track the truiphone API response
  const [apiResponse, setApiResponse] = useState([])

  // handle the file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(csvStringToArray(event.target.result));
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const handleApiRequest = async () => {
    if (fileContent === "") {
      window.alert("you need to upload a csv before attempting to send an API request")
    }
    // parse and organise data into the format the API takes
    let organisedData = organiseRequestDataIntoJson(fileContent)
    axios.post('http://localhost:3001/proxy', organisedData, {Authorization: ""})
      .then((response) => {
        console.log(response.data)
        setApiResponse(response.data)
      })
  }

  return (
    <div className="App">
      <h1>Upload a CSV File</h1>
      <input type="file" name="csvFile" accept=".csv" onChange={handleFileChange} required />
      <button onClick={handleApiRequest}>Send Api Request</button>
      <h2>Notes:</h2>
      <ul>
        <li>Make sure that your csv column headings conform to the below:</li>
        <strong>Label,ICCID,Rate,End User,Device Id,Tags,Job Num</strong><aside>seperate multiple tags with a comma.</aside>
        <li>If the API rejects your request and you're not sure why, it's likely due to incorrect ICCIDs in the CSV. Remember this is set up for the tracker Truphone API</li>
      </ul>
      <h2>CSV File Input:</h2>
      <CsvDisplay tableData={fileContent}/>
      <h2>Api Response</h2>
      <ApiResDisplay apiRes={apiResponse}/>
    </div>
  );
}