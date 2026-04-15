

const { parse } = require("csv-parse/sync");


function parseCSV(csvText) {
  const records = parse(csvText, {
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true, 
  });

  if (!records || records.length === 0) {
    throw new Error("CSV file is empty");
  }

  const headers = records[0].map((h) => String(h).trim());
  const rows = records.slice(1);

  if (rows.length === 0) {
    throw new Error("CSV file has no data rows (header only)");
  }

  return { headers, rows };
}

function buildCSV(headers, rows) {
  const escape = (val) => {
    const str = val == null ? "" : String(val);
    
    if (str.includes(",") || str.includes("\n") || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [headers.map(escape).join(",")];
  for (const row of rows) {
    lines.push(row.map(escape).join(","));
  }
  return lines.join("\n");
}

module.exports = { parseCSV, buildCSV };