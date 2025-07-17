import { createContext, useContext, useState, useEffect } from "react";

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notifications: false,
};

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState("#03C9D7");
  const [currentMode, setCurrentMode] = useState("Dark");
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedColor = localStorage.getItem("colorMode");
    const storedMode = localStorage.getItem("themeMode");
    const storedLogin = localStorage.getItem("isLoggedIn");

    if (storedColor) setCurrentColor(storedColor);
    if (storedMode) setCurrentMode(storedMode);
    setIsLoggedIn(storedLogin === "true"); // Convert string to boolean
  }, []);

  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem("colorMode", color);
  };

  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem("themeMode", e.target.value);
  };

  const handleClick = (clicked) =>
    setIsClicked({ ...initialState, [clicked]: true });

  // Authentication functions
  const login = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("isLoggedIn");
  setIsLoggedIn(false);
  window.location.reload()
};


  return (
    <StateContext.Provider
      value={{
        screenSize,
        setScreenSize,
        currentColor,
        setCurrentColor,
        setColor,
        currentMode,
        setCurrentMode,
        setMode,
        themeSettings,
        setThemeSettings,
        activeMenu,
        setActiveMenu,
        isClicked,
        setIsClicked,
        handleClick,
        initialState,
        isLoggedIn,
        setIsLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
