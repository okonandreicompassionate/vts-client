import type { CsvColumn } from "@/utils/export-csv";
import type { VisitorRow } from "./visits";

export const visitorReportColumns: CsvColumn<VisitorRow>[] = [
  { header: "Visit ID", value: (row) => row.id },
  { header: "Name", value: (row) => row.name },
  { header: "Phone", value: (row) => row.phone },
  { header: "Email", value: (row) => row.email },
  { header: "Host", value: (row) => row.host },
  { header: "Purpose", value: (row) => row.purpose },
  { header: "Status", value: (row) => row.status },
  { header: "Registered", value: (row) => row.registeredAt },
  { header: "Check-in", value: (row) => row.checkIn },
  { header: "Check-out", value: (row) => row.checkOut },
];
