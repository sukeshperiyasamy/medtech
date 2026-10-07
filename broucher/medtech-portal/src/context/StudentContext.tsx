"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Student } from "@/types";

interface StudentContextType {
  activeStudent: Student | null;
  activeRollNumber: string;
  setActiveStudent: (student: Student | null) => void;
  setActiveRollNumber: (roll: string) => void;
  refreshStudent: () => Promise<void>;
  isLoading: boolean;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [activeRollNumber, setActiveRollNumberState] = useState<string>("M24IM1007");
  const [activeStudent, setActiveStudentState] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load from localStorage if present
  useEffect(() => {
    const savedRoll = localStorage.getItem("medtech_active_roll");
    if (savedRoll) {
      setActiveRollNumberState(savedRoll);
    }
  }, []);

  const fetchStudentData = async (roll: string) => {
    if (!roll) {
      setActiveStudentState(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/students/${encodeURIComponent(roll)}`);
      const json = await res.json();
      if (json.success && json.data?.student) {
        setActiveStudentState(json.data.student);
      }
    } catch (err) {
      console.error("Failed to load active student:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeRollNumber) {
      fetchStudentData(activeRollNumber);
    }
  }, [activeRollNumber]);

  const setActiveRollNumber = (roll: string) => {
    const clean = roll.trim().toUpperCase();
    setActiveRollNumberState(clean);
    localStorage.setItem("medtech_active_roll", clean);
  };

  const setActiveStudent = (student: Student | null) => {
    setActiveStudentState(student);
    if (student) {
      setActiveRollNumberState(student.roll_number);
      localStorage.setItem("medtech_active_roll", student.roll_number);
    }
  };

  const refreshStudent = async () => {
    if (activeRollNumber) {
      await fetchStudentData(activeRollNumber);
    }
  };

  return (
    <StudentContext.Provider
      value={{
        activeStudent,
        activeRollNumber,
        setActiveStudent,
        setActiveRollNumber,
        refreshStudent,
        isLoading,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
}
