export interface Course {
  id: number; // <-- remove the "?" to make it required
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  students: number;
  description?: string;
  instructor?: string;
  startDate: string;
  endDate: string;
  maxStudents?: number;
  location?: string;
  meetingTime?: string;
  attachments?: { name: string; url: string }[];
  department: string;
  status: "open" | "closed";
  waitlist: number;
  startTime?: string;
  endTime?: string;
  term: string;
  year: number;
}
