import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyLearning from "./pages/MyLearning";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./routes/ProtectedRoute";
import LearningPath from "./pages/LearningPath";
import { FocusProvider } from "./context/FocusContext";
import FocusPage from "./pages/FocusPage";
import MobileFocus from "./pages/MobileFocus";
import MobileFocusJoin from "./pages/MobileFocusJoin";
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorRoute from "./routes/InstructorRoute";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/instructor/EditCourse";
import ViewCourse from "./pages/instructor/ViewCourse";
import ChatPage from "./pages/ChatPage";
import StudentCourses from "./pages/StudentCourses";
import CourseDetail from "./pages/CourseDetails";
import CategoryCourses from "./pages/CategoryCourses";
import CoursesOverview from "./pages/CoursesOverview";

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/learning-path/:skill" element={<LearningPath />} />
      <Route path="/mobile-focus/:sessionId" element={<MobileFocusJoin />} />
      <Route path="/chat/:chatId" element={<ChatPage />} />
      <Route path="/student/courses" element={<StudentCourses />} />


<Route
  path="/instructor"
  element={
    <InstructorRoute>
      <InstructorDashboard />
    </InstructorRoute>
  }
/>
      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mylearning"
        element={
          <ProtectedRoute>
            <MyLearning />
          </ProtectedRoute>
        }
      />
      <Route path="/focus" element={<FocusPage />} />
      <Route path="/mobile-focus/:sessionId" element={<MobileFocus />} />
      <Route path="/instructor/course/:id" element={<ViewCourse />} />
<Route path="/instructor/edit-course/:id" element={<EditCourse />} />
<Route path="/courses" element={<CoursesOverview />} />
<Route path="/courses/:category" element={<CategoryCourses />} />
<Route path="/course/:courseId" element={<CourseDetail />} />



<Route
  path="/instructor/create-course"
  element={
    <InstructorRoute>
      <CreateCourse />
    </InstructorRoute>
  }
/>



      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <FocusProvider>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
    </FocusProvider>
  );
}

export default App;
