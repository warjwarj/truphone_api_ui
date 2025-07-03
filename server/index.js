// node/express packages
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv')
const bodyParser = require('body-parser')

// our utils nodule
const utils = require('./utils')

// set up middleware
require('dotenv').config()
app.use(cors())
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

// route for proxying the API req
app.post('/proxy', async (req, res) => {
    if (!req.body) {
        return res.status(400).send('No data was sent in request body.');
    }
    const result = async () => {
        return [
            // {"unassigning tag results":      await Promise.all(await utils.makeApiCallToUnassignTags(req.body["Tags"]))},
            // {"assigning tag results":        await Promise.all(utils.makeApiCallsToAssignTags(req.body["Tags"]))},
            // {"assigning label results":      await Promise.all(utils.makeApiCallsToSetLabels(req.body["Label"]))},
            {"assigning attribute results":  await Promise.all(utils.makeApiCallToSetAttributes(req.body, ["Tags", "Label"]))}
        ]
    }
    res.send(await result());
})

// start the server
app.listen(3001, () => {
      console.log('proxy server listening on port 3001')
})