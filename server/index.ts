// node/express packages
import express from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'

// our utils nodule
import  from './utils'

// declare our app
const app = express();

// set up middleware
require('dotenv').config()
app.use(cors())
app.use(express.json())

// route for proxying the API req
app.post('/proxy', async (req, res) => {
    if (!req.body) {
        return res.status(400).send('No data was sent in request body.');
    }
    res.send([
        {"unassigning tag results":      await Promise.all(await utils.makeApiCallToUnassignTags(req.body["Tags"]))},
        {"assigning tag results":        await Promise.all(utils.makeApiCallsToAssignTags(req.body["Tags"]))},
        {"assigning label results":      await Promise.all(utils.makeApiCallsToSetLabels(req.body["Label"]))},
        {"assigning attribute results":  await Promise.all(utils.makeApiCallToSetAttributes(req.body, ["Tags", "Label"]))}
    ])
})

// start the server
app.listen(3001, () => {
      console.log('proxy server listening on port 3001') 
})