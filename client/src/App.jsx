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
  const [fileContent, setFileContent] = useState(null);

  // track the truphone API response
  const [apiResponse, setApiResponse] = useState(null)

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
    // parse and organise data. Config options.
    let organisedData = organiseRequestDataIntoJson(fileContent)
    console.log(organisedData)
    organisedData["options"]["removeExistingTags"] = document.getElementById("removeExistingTagsCheckbox").checked

    // send to api
    axios.post('http://localhost:3001/proxy', organisedData, {Authorization: ""})
      .then((response) => {
        if (response.status < 400){
          setApiResponse(response.data)
        } else {
          window.alert(response.data)
        }
      })
  }

  return (
    <div className="App">
      <h1>Upload a CSV File</h1>
      <input type="file" name="csvFile" accept=".csv" onChange={handleFileChange} required /><br/><br/>
      <input type="checkbox" id="removeExistingTagsCheckbox" name="removeExistingTags"/><span>Remove existing tags?</span><br/><br/>
      <button onClick={handleApiRequest}>Send Api Request</button>
      <h2>Notes:</h2>
      <ul>
        <li>Example CSV Column Headings: <strong>Label,ICCID,Rate,End User,Device Id,Tags,Job Num</strong> - seperate multiple tag values with a comma.</li>
        <li>Each row in the table represents one SIM card, identified by it's ICCID. This program will attempt to set the given attribute value for each SIM, where the column header is the name of the attribute. For example, if I logged into the Truphone website and added an attribute to all DVR SIMs called "Vehicle Reg", I could upload a CSV file with the columns "ICCID", and "Vehicle Reg", and then for each ICCID specify the "Vehicle Reg" value that I want to set - "MT09XOZ" for example. As long as the attribute is on Truphone, just add a column for it and it will attempt to set it. The label field and the tag field are hardcoded, and are handled differently behind the scenes. This should make no difference in practice but may be useful to know.</li>
        <li>This API can be used for both the tracker and DVR SIM APIs. You will need to change the attributes you attempt to set for each SIM. In practice this means changing the column headers in the CSV file that you upload to the website. You will also need to change the API key the server uses to connect to Truphone.</li>
        <li>If you get an error like "This field must not be blank" check that every row has an ICCID value.</li>
        <li>The only thing that you need to change if you're switching between using this for the tracker or DVR APIs is the API key in the root directory of the project. As stated before the program attempts to dynamically assign the attributes specified in the CSV file, so you just have to change the column headers and it should work to change those values.</li>
      </ul>
      <h2>Api Response</h2>
      {apiResponse? <ApiResDisplay apiRes={apiResponse}/> : <div>API Response will be displayed here.</div>}
      <h2>CSV File Input:</h2>
      {fileContent ? <CsvDisplay tableData={fileContent}/> : <div>Uploaded file will be displayed here.</div>}
    </div>
  );
}