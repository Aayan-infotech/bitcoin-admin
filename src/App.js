import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { FiSettings } from "react-icons/fi";
import { useStateContext } from "./contexts/ContextProvider";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ThemeSettings from "./components/ThemeSettings";
import Footer from "./components/Footer";
import Login from "./components/Login";
import CourseCreation from "./pages/Course/CourseManagement";
import CourseSections from "./pages/Course/CourseSections";
import QuizManagement from "./pages/Quiz/QuizManagement";
import QuizQuestionsManagement from "./pages/Quiz/QuizQuestionsManagement";
import FAQ from "./pages/FAQ/FAQ";
import UserManagement from "./pages/User/UserManagement";
import AlphabetsManagement from "./pages/Alphabets/AlphabetsManagement";

const App = () => {
  const {
    currentColor,
    setCurrentColor,
    currentMode,
    setCurrentMode,
    activeMenu,
    themeSettings,
    setThemeSettings,
    setIsLoggedIn,
  } = useStateContext();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("colorMode");
    const currentThemeMode = localStorage.getItem("themeMode");
    const token = localStorage.getItem("token");

    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }

    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }

    setIsCheckingAuth(false);
  }, [setCurrentColor, setCurrentMode]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <BrowserRouter>
        {!isLoggedIn ? (
          <Routes>
            <Route path="/*" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          </Routes>
        ) : (
          <div className="flex relative dark:bg-gray-900">
            <div className="fixed right-4 bottom-4 z-50">
              <button
                onClick={() => setThemeSettings(true)}
                style={{ backgroundColor: currentColor }}
                className="p-3 text-white rounded-full shadow-lg"
              >
                <FiSettings size={24} />
              </button>
            </div>

            {activeMenu ? (
              <div className="w-72 fixed bg-white dark:bg-gray-800 z-10">
                <Sidebar />
              </div>
            ) : (
              <div className="w-0">
                <Sidebar />
              </div>
            )}

            <div
              className={
                activeMenu
                  ? "bg-gray-100 dark:bg-gray-900 min-h-screen md:ml-72 w-full"
                  : "w-full min-h-screen"
              }
            >
              <Navbar />
              {themeSettings && <ThemeSettings />}

              <Routes>
                <Route path="/" element={<UserManagement />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/course-management" element={<CourseCreation />} />
                <Route path="/courses/:courseId/sections" element={<CourseSections />} />
                <Route path="/quiz-management" element={<QuizManagement />} />
                <Route path="/quiz/:quizId/questions" element={<QuizQuestionsManagement />} />
                <Route path="/faq-management" element={<FAQ />} />
                <Route path="/alphabet-management" element={<AlphabetsManagement />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>

              <Footer />
            </div>
          </div>
        )}
      </BrowserRouter>
      <Toaster />
    </div>
  );
};

export default App;
