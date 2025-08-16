export function downloadFile ({ 
    headers, 
    rows, 
    fileName = 'ExportedData',
    type = 'excel'
}) {
    if (type === 'csv') {
    const csvContent = [
      headers.join(','), // CSV header
      ...rows.map(row => row.map(value => `"${value}"`).join(',')) // Escape commas
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, `${fileName}.csv`);
  } else if (type === 'excel') {
    let xmlContent = `<?xml version="1.0"?>
    <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
              xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:x="urn:schemas-microsoft-com:office:excel"
              xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
      <Worksheet ss:Name="Sheet1">
        <Table>
          <Row>${headers.map(h => `<Cell><Data ss:Type="String">${h}</Data></Cell>`).join('')}</Row>
    `;
    rows.forEach(row => {
      xmlContent += `<Row>${row.map(cell => `<Cell><Data ss:Type="String">${cell}</Data></Cell>`).join('')}</Row>`;
    });
    xmlContent += `
        </Table>
      </Worksheet>
    </Workbook>`;
    const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel' });
    triggerDownload(blob, `${fileName}.xls`);
  } else {
    console.warn('Unsupported file type:', type);
  }
}
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}