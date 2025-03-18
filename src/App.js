import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "./contexts/ContextProvider";
import {
  Ecommerce,
  Orders,
  Employees,
  Customers,
  Calendar,
  Kanban,
  Editor,
  ColorPicker,
  Line,
  Pie,
  StackedChart,
  Area,
  Bar,
  ColorMapping,
  Financial,
  Pyramid,
  Profile,
  Login,
  SignUp,
  Address,
  Password
} from "./pages";
import { Footer, Navbar, Sidebar, ThemeSettings } from "./components";
import ProtectedRoute from "./ProtectedRoute";
import { loadUser } from "./redux/actions/user";
import Store from "./redux/store";
import { useSelector } from "react-redux";
import Loader from "./components/Loader/Loader.jsx"
// Create a new component for the app content
const AppContent = () => {
  const {
    currentColor,
    currentMode,
    activeMenu,
    themeSettings,
    setThemeSettings,
  } = useStateContext();

  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <div className="flex relative dark:bg-main-dark-bg">
        {!isAuthPage && (
          <div className="fixed right-4 bottom-4" style={{ zIndex: "" }}>
            <TooltipComponent content="Settings" position="Top">
              <button
                type="button"
                onClick={() => setThemeSettings(true)}
                style={{ backgroundColor: currentColor, borderRadius: "50%" }}
                className="text-3xl text-white p-3 drop-shadow-xl hover:bg-light-gray"
              >
                <FiSettings />
              </button>
            </TooltipComponent>
          </div>
        )}
        {!isAuthPage && activeMenu && (
          <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white z-10">
            <Sidebar />
          </div>
        )}
        <div
          className={
            !isAuthPage && activeMenu
              ? "dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full"
              : "bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2"
          }
        >
          {!isAuthPage && (
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
              <Navbar />
            </div>
          )}
          <div>
            {themeSettings && <ThemeSettings />}

            <Routes>
              {/* Auth Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />

              {/* Dashboard */}
              {/* <Route path="/" element={<Ecommerce />} /> */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Ecommerce />
                  </ProtectedRoute>
                }
              />
              <Route path="/ecommerce" element={<Ecommerce />} />
              <Route path="/orders" element={<Orders />} />
              {/* <Route path="/profile" element={<Profile />} /> */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
               <Route
                path="/Address"
                element={
                  <ProtectedRoute>
                    <Address />
                  </ProtectedRoute>
                }
              /> <Route
              path="/Password"
              element={
                <ProtectedRoute>
                  <Password />
                </ProtectedRoute>
              }
            />
              <Route path="/employees" element={<Employees />} />
              <Route path="/customers" element={<Customers />} />
              {/* App */}
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/kanban" element={<Kanban />} />
              <Route path="/editor" element={<Editor />} />
              <Route path="/color-picker" element={<ColorPicker />} />
              {/* Charts */}
              <Route path="/line" element={<Line />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/stacked" element={<StackedChart />} />
              <Route path="/area" element={<Area />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/color-mapping" element={<ColorMapping />} />
              <Route path="/financial" element={<Financial />} />
              <Route path="/pyramid" element={<Pyramid />} />
            </Routes>
          </div>
          {!isAuthPage && <Footer />}
        </div>
      </div>
    </div>
  );
};

// Main App component
export const App = () => {
  const { setCurrentColor, setCurrentMode } = useStateContext();
  const { loading } = useSelector((state) => state.user);

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("colorMode");
    const currentThemeMode = localStorage.getItem("themeMode");
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);
  useEffect(() => {
    console.log("useefect is running");
    Store.dispatch(loadUser());
  }, []);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      )}
    </>
  );
};
