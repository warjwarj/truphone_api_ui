// node/express packages
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')

// set up middleware BEFORE WE IMPORT
require('dotenv').config()

// our utils nodule
const utils = require('./utils')

app.use(cors())
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

// define route the client uses for proxying the API req
app.post('/proxy', async (req, res) => {
    // error checks
    if (!req.body) {
        return res.status(400).send('No data was sent in request body.');
    }
    // assign attributes
    const results = [
        {"assigning attribute results":  await Promise.all(utils.makeApiCallToSetAttributes(req.body, ["Tags", "Label"]))}
    ]
    // check options
    if (req.body["options"]["removeExistingTags"] == true) {
        results.push({"unassigning tag results": await Promise.all(await utils.makeApiCallToUnassignTags(req.body["Tags"]))})
    }
    // check for tags
    if (req.body["Tags"]) {
        results.push({"assigning tag results": await Promise.all(utils.makeApiCallsToAssignTags(req.body["Tags"]))})
    }
    // check for labels
    if (req.body["Label"]) {
        results.push({"assigning label results": await Promise.all(utils.makeApiCallsToSetLabels(req.body["Label"]))})
    }
    // return results
    res.send(results);
})

// start the server
app.listen(3001, () => {
      console.log('proxy server listening on port 3001')
})