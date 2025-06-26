// this function parses a csv file read as a string into an array of arrays where the first child array is the headers.
export function csvStringToArray (strData) {
    const objPattern = new RegExp(("(\\,|\\r?\\n|\\r|^)(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\\,\\r\\n]*))"),"gi");
    let arrMatches = null, arrData = [[]];
    while (arrMatches = objPattern.exec(strData)){
        if (arrMatches[1].length && arrMatches[1] !== ",")arrData.push([]);
        arrData[arrData.length - 1].push(arrMatches[2] ? 
            arrMatches[2].replace(new RegExp( "\"\"", "g" ), "\"") :
            arrMatches[3]);
    }
    // excel adds an element onto the end of the file for some reason
    if (JSON.stringify(arrData[arrData.length - 1]) === JSON.stringify([""])) {
        arrData.pop()
    }
    return arrData;
}

// returns an array of keyed JSON objects, where the key is the attribute label
// ...and the object is a list of ICCIDS and a value field
// the label will be set to (value) for each ICCID.
export function organiseRequestDataIntoJson (parsedCsv) {
    // our object we'll return
    let organisedRequestData = {}

    // loop over labels and insantiate label object for each
    for (let i=0; i < parsedCsv[0].length; i++) {
        parsedCsv[0][i] = parsedCsv[0][i].trim()
        if (parsedCsv[0][i] == "ICCID") {
            continue
        }
        organisedRequestData[parsedCsv[0][i]] = {}
    }

    // LOOP OVER ROWS IN THE CSV
    for (let i=1; i < parsedCsv.length; i++){
        // error checking
        if (parsedCsv[i].length > parsedCsv[0].length) {
            continue
        }

        // first we find the ICCID of the SIM this entry in the CSV represents
        let iccid;
        for (let j=0; j < parsedCsv[i].length; j++) {
            if (parsedCsv[0][j] == "ICCID") {
                iccid = parsedCsv[i][j]
                break
            }
        }

        // LOOP OVER VALUES IN THE ROW
        for (let j=0; j < parsedCsv[i].length; j++) {
            // ignore iccid
            if (parsedCsv[0][j] == "ICCID") {
                continue
            }
            // handle Tags field slightly differently
            if (parsedCsv[0][j] == "Tags") {
                const tags = parsedCsv[i][j].split(",")
                for (let t=0; t < tags.length; t++){
                    tags[t] = tags[t].trim()
                    if (!organisedRequestData[parsedCsv[0][j]][tags[t]]){
                        organisedRequestData[parsedCsv[0][j]][tags[t]] = []
                    }
                    organisedRequestData[parsedCsv[0][j]][tags[t]].push(iccid)
                }
                continue
            }
            // for all normal attributes just add iccid to list
            if (!organisedRequestData[parsedCsv[0][j]][parsedCsv[i][j]]){
                organisedRequestData[parsedCsv[0][j]][parsedCsv[i][j]] = []
            }
            organisedRequestData[parsedCsv[0][j]][parsedCsv[i][j]].push(iccid)
        }
    }
    return organisedRequestData
}