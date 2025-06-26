import './CsvDisplay.css'

export default function CsvDisplay({ tableData }) {
  console.log(tableData)
  return (
    <table className="csv-table">
      <tbody>
        {tableData.map((rowData, i) => (
          <tr key={i}>
            {rowData.map((cellData, j) => (
              <td key={j}>{cellData}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
