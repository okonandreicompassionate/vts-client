import type { VisitorStatus } from "./features/admins/components/StatusPill.tsx";

export interface VisitorRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  host: string;
  purpose: string;
  status: VisitorStatus;
  time: string;
  checkIn: string;
  department: string;
}

export const dummyVisitors: VisitorRecord[] = [
  {
    id: "vis-1001",
    name: "Ava Thompson",
    email: "ava.thompson@northstar.com",
    phone: "+234 802 345 6789",
    avatar: "https://i.pravatar.cc/40?img=12",
    host: "Sarah Smith",
    purpose: "Executive Briefing",
    status: "Signed In",
    time: "09:45 AM",
    checkIn: "09:45 AM",
    department: "Operations",
  },
  {
    id: "vis-1002",
    name: "Daniel Brooks",
    email: "daniel.b@northstar.com",
    phone: "+234 803 112 2233",
    avatar: "https://i.pravatar.cc/40?img=47",
    host: "Robert Brown",
    purpose: "Vendor Review",
    status: "Pending",
    time: "10:15 AM",
    checkIn: "Pending",
    department: "Procurement",
  },
  {
    id: "vis-1003",
    name: "Mina Patel",
    email: "mina.patel@northstar.com",
    phone: "+234 804 555 6677",
    avatar: "https://i.pravatar.cc/40?img=33",
    host: "Emma Davis",
    purpose: "Facilities Inspection",
    status: "Signed Off",
    time: "08:30 AM",
    checkIn: "08:30 AM",
    department: "Facilities",
  },
  {
    id: "vis-1004",
    name: "Noah Kim",
    email: "noah.kim@northstar.com",
    phone: "+234 805 445 9900",
    avatar: "https://i.pravatar.cc/40?img=25",
    host: "Chris Lee",
    purpose: "Delivery Coordination",
    status: "Rejected",
    time: "11:00 AM",
    checkIn: "Rejected",
    department: "Logistics",
  },
  {
    id: "vis-1005",
    name: "Sofia Martinez",
    email: "sofia.m@northstar.com",
    phone: "+234 806 234 1122",
    avatar: "https://i.pravatar.cc/40?img=51",
    host: "Sarah Smith",
    purpose: "Client Visit",
    status: "Signed In",
    time: "11:20 AM",
    checkIn: "11:20 AM",
    department: "Sales",
  },
  {
    id: "vis-1006",
    name: "Liam Chen",
    email: "liam.chen@northstar.com",
    phone: "+234 807 765 8833",
    avatar: "https://i.pravatar.cc/40?img=29",
    host: "Emma Davis",
    purpose: "Board Meeting",
    status: "Signed In",
    time: "11:30 AM",
    checkIn: "11:30 AM",
    department: "Executive Office",
  },
  {
    id: "vis-1007",
    name: "Priya Nair",
    email: "priya.nair@northstar.com",
    phone: "+234 808 223 7744",
    avatar: "https://i.pravatar.cc/40?img=14",
    host: "Robert Brown",
    purpose: "Consultation",
    status: "Pending",
    time: "11:45 AM",
    checkIn: "Pending",
    department: "HR",
  },
  {
    id: "vis-1008",
    name: "Owen Scott",
    email: "owen.scott@northstar.com",
    phone: "+234 809 444 9001",
    avatar: "https://i.pravatar.cc/40?img=44",
    host: "Chris Lee",
    purpose: "Audit Support",
    status: "Signed Off",
    time: "07:15 AM",
    checkIn: "07:15 AM",
    department: "Compliance",
  },
  {
    id: "vis-1009",
    name: "Grace Turner",
    email: "grace.turner@northstar.com",
    phone: "+234 810 121 3344",
    avatar: "https://i.pravatar.cc/40?img=36",
    host: "Sarah Smith",
    purpose: "Training Session",
    status: "Signed In",
    time: "01:05 PM",
    checkIn: "01:05 PM",
    department: "Learning & Development",
  },
  {
    id: "vis-1010",
    name: "Jay Patel",
    email: "jay.patel@northstar.com",
    phone: "+234 811 678 4412",
    avatar: "https://i.pravatar.cc/40?img=18",
    host: "Emma Davis",
    purpose: "Project Sync",
    status: "Pending",
    time: "02:10 PM",
    checkIn: "Pending",
    department: "Engineering",
  },
];

export function getVisitorSummary(records: VisitorRecord[]) {
  return {
    total: records.length,
    signedIn: records.filter((visitor) => visitor.status === "Signed In").length,
    signedOff: records.filter((visitor) => visitor.status === "Signed Off").length,
    pending: records.filter((visitor) => visitor.status === "Pending").length,
    rejected: records.filter((visitor) => visitor.status === "Rejected").length,
  };
}
