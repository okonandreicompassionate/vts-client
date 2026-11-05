const UTF8_BOM = String.fromCharCode(0xfeff);

type CsvValue = string | number | boolean | null | undefined;

export interface CsvColumn<T> {
  header: string;
  value: (row: T) => CsvValue;
}

const escape = (value: CsvValue): string => {
  const text = value === null || value === undefined ? "" : String(value);
  // Guard against spreadsheet formula injection, then quote when needed.
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;

  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

/** Downloads rows as a CSV file (opens in Excel). */
export function downloadCsv<T>(fileName: string, columns: CsvColumn<T>[], rows: T[]): void {
  const lines = [
    columns.map((column) => escape(column.header)).join(","),
    ...rows.map((row) => columns.map((column) => escape(column.value(row))).join(",")),
  ];
  // BOM so Excel reads UTF-8 names correctly.
  const blob = new Blob([UTF8_BOM + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName.endsWith(".csv") ? fileName : `${fileName}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
