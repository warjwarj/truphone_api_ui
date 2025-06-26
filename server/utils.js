const https = require('https')

// this function adds/removes the given tags for all SIMs in the array parameter.
exports.makeApiCallToUnassignTags = async function(tags) {
    everyTag = JSON.parse(await getAllTagsInUse()).map(item => item.label)                // every tag on truphone
    iccids = [...new Set(Object.values(tags).flat())].filter(s => s !== "");              // every unique ICCID
    return everyTag.map((tag) => {
        tag = tag.trim().replace(/\s/g, "%20");
        const body = JSON.stringify({ simCards: iccids });
        const options = {
            hostname: 'iot.truphone.com',
            port: 443,
            path: `/api/v2.0/tags/${tag}/sims`,
            method: "DELETE",
            headers: {
                'Authorization': process.env.AUTH_TOKEN,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        };
        return sendApiRequest(options, body);
    });
}

// this function sets label of the SIM provided to the given value
exports.makeApiCallsToAssignTags = function (tags) {
    return Object.entries(tags)
        .filter(([tag]) => typeof tag === 'string' && tag.trim() !== '')
        .flatMap(([tag, iccids]) => {
            tag = tag.trim().replace(/\s/g, "%20");
            const body = JSON.stringify({ simCards: iccids });
            return iccids.map(iccid => {
                if (!iccid) return null; // skip undefined/null ICCIDs
                const options = {
                    hostname: 'iot.truphone.com',
                    port: 443,
                    path: `/api/v2.0/tags/${tag}/sims`,
                    method: "POST",
                    headers: {
                        'Authorization': process.env.AUTH_TOKEN,
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(body)
                    }
                };
                return sendApiRequest(options, body);
            }).filter(Boolean); // remove nulls
        });
};

// this function sets label of the SIM provided to the given value
exports.makeApiCallsToSetLabels = function (labels) {
    return Object.entries(labels)
        .filter(([label]) => typeof label === 'string' && label.trim() !== '')
        .flatMap(([label, iccids]) => {
            const trimmedLabel = label.trim();
            const body = JSON.stringify({ label: trimmedLabel });
            return iccids.map(iccid => {
                if (!iccid) return null; // skip undefined/null ICCIDs
                const options = {
                    hostname: 'iot.truphone.com',
                    port: 443, // fixed typo from 'post' to 'port'
                    path: `/api/v2.2/sims/${iccid}`,
                    method: 'PATCH',
                    headers: {
                        'Authorization': process.env.AUTH_TOKEN,
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(body)
                    }
                };
                return sendApiRequest(options, body);
            }).filter(Boolean); // remove nulls
        });
};

// for each attribute obj, which contiains fields where the key is the value and the value is the iccids, for each iccid we set it's atte
exports.makeApiCallToSetAttributes = function(attributes, attributes_to_ignore) {
    // clean the input
    const valid_attributes = Object.entries(attributes)
        .filter(([att]) => typeof att === 'string' && att.trim() !== '' && !attributes_to_ignore.includes(att))
        .map(([att, vals_and_iccids]) => {
            clean = Object.entries(vals_and_iccids)
                .map(([val, iccids]) => {
                    if (!val || !iccids) return null;
                    return [val, iccids]
                }).filter(Boolean) // remove nullified items
            return[att, Object.fromEntries(clean)]
        })
    // send the api requests
    return valid_attributes.flatMap(([att, vals_and_iccids]) => {
        return Object.entries(vals_and_iccids)
            .flatMap(([value, iccids]) => {
                att = att.trim().replace(/\s/g, "%20"); // replace whitespace with special char
                const body = JSON.stringify({
                    "simCards": iccids,
                    "value": value
                })
                const options = {
                    hostname: 'iot.truphone.com',
                    post: 443,
                    path: `/api/v2.0/attributes/${att}`,
                    method: 'PATCH',
                    headers: {
                        'Authorization': process.env.AUTH_TOKEN,
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(body)
                    }
                };
                return sendApiRequest(options, body);
            })
    });
}

// // this function sets the attribute to the given value 
// exports.makeApiCallToSetAttributes = function(attribute, value, iccids) {
//     // repalce whitespace in string with special char
//     attribute = attribute.trim()
//     attribute = attribute.replace(/\s/g, "%20");
//     // payload body
//     const body = JSON.stringify({
//         "simCards": iccids,
//         "value": value
//     })
//     // Set up the request options
//     const options = {
//         hostname: 'iot.truphone.com',
//         post: 443,
//         path: `/api/v2.0/attributes/${attribute}`,
//         method: 'PATCH',
//         headers: {
//             'Authorization': process.env.AUTH_TOKEN,
//             'Content-Type': 'application/json',
//             'Content-Length': Buffer.byteLength(body)
//         }
//     };
//     return sendApiRequest(options, body)
// }

// this function sets label of the SIM provided to the given value
getAllTagsInUse = function() {
    // Set up the request options
    const options = {
        hostname: 'iot.truphone.com',
        post: 443,
        path: `/api/v2.0/tags`,
        method: 'GET',
        headers: {
            'Authorization': process.env.AUTH_TOKEN,
            'Content-Type': 'application/json',
        }
    };
    return sendApiRequest(options, "")
}

// this function sets label of the SIM provided to the given value
exports.getAllSims = function() {
    // Set up the request options
    const options = {
        hostname: 'iot.truphone.com',
        post: 443,
        path: `/api/v2.2/sims`,
        method: 'GET',
        headers: {
            'Authorization': process.env.AUTH_TOKEN,
        }
    };
    return sendApiRequest(options, "")
}

// Create a persistent connection pool using an Agent
const agent = new https.Agent({
    keepAlive: true, // Keep sockets alive for reuse
    maxSockets: 10,  // Limit the number of sockets in the pool
    maxFreeSockets: 5, // Limit the number of idle sockets
    timeout: 60000, // Socket timeout in milliseconds
    scheduling: 'fifo'
});

const sendApiRequest = function (options, body) {
    return new Promise((resolve, reject) => {
        options.agent = agent
        // Make the HTTP request
        const req = https.request(options, (res) => {
            // Inspect rate-limiting headers
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data); // Successfully completed request
            });
        });
        // Declare error handling callback
        req.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
            resolve(new Error(`Problem with request: ${e.message}`));
        });
        // Send request data
        req.write(body);
        req.end();
    });
};