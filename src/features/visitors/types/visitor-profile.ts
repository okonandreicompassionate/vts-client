export type VisitorProfileStatus = "pending" | "approved" | "rejected";

export type VisitorRegistration = {
  name: string;
  purposeOfVisit: string;
  hostName: string;
  department: string;
  phoneNo: string;
};

export const defaultRegistration: VisitorRegistration = {
  name: "Visitor Name",
  purposeOfVisit: "Meeting",
  hostName: "Host Name",
  department: "Visitor Services",
  phoneNo: "+234 000 000 0000",
};
