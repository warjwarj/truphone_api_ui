import { useEffect, useState } from 'react';
import './CsvDisplay.css'

export default function CsvDisplay({ tableData }) {
  // keep track of the indexes of each header for the current table
  const [headers, setHeaders] = useState([])

  // re-read the table each time it changes to set headers correctly
  useEffect(() => {
    setHeaders(Object.fromEntries(tableData[0].map((item, i) => [item, i])));
  }, [tableData])

  // render the table
  return (
    <table className="csv-table">
      <tbody>
        {tableData.map((rowData, i) => (
          <tr id={i == 0 ? "Headers" : rowData[headers.ICCID]} key={i}>
            {rowData.map((cellData, j) => (
              <td id={i == 0 ? `${tableData[0][j]}` : `${rowData[headers.ICCID]}-${tableData[0][j]}`} key={j}>{cellData}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
