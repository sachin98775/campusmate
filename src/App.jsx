import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './Pages/Login';
import StudentDashboard from './Pages/StudentDashboard';
import Subjects from './Pages/Subjects';
import Contact from './Pages/Contact';
import AdminDashboard from './Pages/AdminDashboard';
import ManageStudents from './Pages/ManageStudents';
import ManageTeachers from './Pages/ManageTeachers';
import ManageClasses from './Pages/ManageClasses';
import TeacherDashboard from './Pages/TeacherDashboard';
import TeacherSubjects from './Pages/TeacherSubjects';
import TeacherAttendance from './Pages/TeacherAttendance';
import ClassDetail from './Pages/ClassDetail';
import ClassDetails from './Pages/ClassDetails';
import ClassDetailsPage from './Pages/ClassDetailsPage';
import TeachersPage from './Pages/TeachersPage';
import DebugTeacherAssignment from './Pages/DebugTeacherAssignment';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/teachers" element={<TeachersPage />} />
        <Route path="/admin-dashboard/students" element={<ManageStudents />} />
        <Route path="/admin-dashboard/teachers" element={<ManageTeachers />} />
        <Route path="/admin-dashboard/classes" element={<ManageClasses />} />
        <Route path="/admin-dashboard/class/:classId" element={<ClassDetails />} />
        <Route path="/admin-dashboard/class/:classId/subjects" element={<ClassDetail />} />
        <Route path="/admin-dashboard/class/:classId/students" element={<ClassDetail />} />
        <Route path="/admin/class/:classId" element={<ClassDetailsPage />} />
        <Route path="/admin/debug/:classId" element={<DebugTeacherAssignment />} />
        
        {/* Teacher Routes */}
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher-dashboard/subjects" element={<TeacherSubjects />} />
        <Route path="/attendance/:subjectId" element={<TeacherAttendance />} />
        
        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;