import React, { useEffect, useState, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { FiSettings } from "react-icons/fi";
import { useStateContext } from "./contexts/ContextProvider";

// Lazy imports
const Navbar = React.lazy(() => import("./components/Navbar"));
const Sidebar = React.lazy(() => import("./components/Sidebar"));
const ThemeSettings = React.lazy(() => import("./components/ThemeSettings"));
const Footer = React.lazy(() => import("./components/Footer"));
const Login = React.lazy(() => import("./components/Login"));
const CourseCreation = React.lazy(() => import("./pages/Course/CourseManagement"));
const CourseSections = React.lazy(() => import("./pages/Course/CourseSections"));
const QuizManagement = React.lazy(() => import("./pages/Quiz/QuizManagement"));
const QuizQuestionsManagement = React.lazy(() => import("./pages/Quiz/QuizQuestionsManagement"));
const FAQ = React.lazy(() => import("./pages/FAQ/FAQ"));
const UserManagement = React.lazy(() => import("./pages/User/UserManagement"));
const AlphabetsManagement = React.lazy(() => import("./pages/Alphabets/AlphabetsManagement"));
const NotificationManagement = React.lazy(() => import("./pages/Notification/NotificationManagement"));
const PaymentManagement = React.lazy(() => import("./pages/Payment/PaymentManagement"));
const ClaimRewardTable = React.lazy(() => import("./pages/Payment/RewardClaimtable"));
const AlphabetDesc = React.lazy(() => import("./pages/Alphabets/AlphbetDesc"));

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
        <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
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
                  <Route path="/alphabet-desc" element={<AlphabetDesc />} />
                  <Route path="/notification-management" element={<NotificationManagement />} />
                  <Route path="/payment-management" element={<PaymentManagement />} />
                  <Route path="/claims-management" element={<ClaimRewardTable />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>

                <Footer />
              </div>
            </div>
          )}
        </Suspense>
      </BrowserRouter>
      <Toaster />
    </div>
  );
};

export default App;
