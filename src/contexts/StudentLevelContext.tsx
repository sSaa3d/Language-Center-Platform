import { createContext, useContext, useState, ReactNode } from "react";

type StudentLevelContextType = {
  studentLevel: string;
  setStudentLevel: (level: string) => void;
};

const StudentLevelContext = createContext<StudentLevelContextType | undefined>(
  undefined
);

export const StudentLevelProvider = ({ children }: { children: ReactNode }) => {
  const [studentLevel, setStudentLevel] = useState<string>("Unknown");
  return (
    <StudentLevelContext.Provider value={{ studentLevel, setStudentLevel }}>
      {children}
    </StudentLevelContext.Provider>
  );
};

export const useStudentLevel = () => {
  const context = useContext(StudentLevelContext);
  if (!context) {
    throw new Error(
      "useStudentLevel must be used within a StudentLevelProvider"
    );
  }
  return context;
};
