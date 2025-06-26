// node/express packages
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv')

// our utils nodule
const utils = require('./utils')

// set up middleware
require('dotenv').config()
app.use(cors())
app.use(express.json())

// route for proxying the API req
app.post('/proxy', async (req, res) => {
    if (!req.body) {
        return res.status(400).send('No data was sent in request body.');
    }
    const result = await makeTruphoneApiCalls(req.body);
    console.log(result)
    res.send(result);
})

// start the server
app.listen(3001, () => {
      console.log('proxy server listening on port 3001')
})

// helper to mkae and collate API requests and responses
const makeTruphoneApiCalls = async function(organisedData) {
    return [
        {"unassigning tag results":      await Promise.all(await utils.makeApiCallToUnassignTags(organisedData["Tags"]))},
        {"assigning tag results":        await Promise.all(utils.makeApiCallsToAssignTags(organisedData["Tags"]))},
        {"assigning label results":      await Promise.all(utils.makeApiCallsToSetLabels(organisedData["Label"]))},
        {"assigning attribute results":  await Promise.all(utils.makeApiCallToSetAttributes(organisedData, ["Tags", "Label"]))}
    ]
}

// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const app = express();
// const https = require('https')
// require('dotenv').config()

// // Set up multer for file uploads
// const upload = multer({ dest: 'uploads/' });

// // our own packages
// const utils = require('./utils')
// // const api = require('./api')

// // Serve static files
// app.use(express.static(path.join(__dirname, 'public')));

// // Route to handle file upload
// app.post('/upload', upload.single('csvFile'), (req, res) => {
//     if (!req.file) {
//         return res.status(400).send('No file uploaded.');
//     }
//     const filePath = path.join(__dirname, req.file.path);
//     fs.readFile(filePath, 'utf8', async (err, data) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).send('Error reading file.');
//         }
//         const result = await makeTruphoneApiCalls(data);
//         res.send(result);
//         // clean up file after processing
//         fs.unlink(filePath, (unlinkErr) => {
//             if (unlinkErr) console.error('Error deleting file:', unlinkErr);
//         });
//     });
// });

// // Start the server
// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

// const makeTruphoneApiCalls = async function(csv) {
//     // parse and organise data into the format the API takes
//     const organisedData = utils.organiseRequestDataIntoJson(utils.csvStringToArray(csv))
//     return {
//         "unassigning tag results":      await Promise.all(await utils.makeApiCallToUnassignTags(organisedData["Tags"])),
//         "assigning tag results":        await Promise.all(utils.makeApiCallsToAssignTags(organisedData["Tags"])),
//         "assigning label results":      await Promise.all(utils.makeApiCallsToSetLabels(organisedData["Label"])),
//         "assigning attribute results":  await Promise.all(utils.makeApiCallToSetAttributes(organisedData, ["Tags", "Label"]))
//     }
// }

