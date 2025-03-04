import React, { useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useStateContext } from "../contexts/ContextProvider";
import avatar from "../data/avatar.jpg";
import UserProfile from "./UserProfile"; // ✅ Fixed Import

const NavButton = ({ title, customFunc, icon, color, dotColor }) => {
  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => customFunc()}
        style={{ color }}
        className="relative text-xl rounded-full p-3 hover:bg-gray-200"
      >
        <span
          style={{ background: dotColor }}
          className="absolute inline-flex rounded-full h-2 w-2 top-2 right-2"
        ></span>
        {icon}
      </button>
      {/* Tooltip */}
      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 bg-gray-700 text-white text-xs rounded px-2 py-1 transition">
        {title}
      </span>
    </div>
  );
};

const Navbar = () => {
  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
  } = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [setScreenSize]);

  useEffect(() => {
    setActiveMenu(screenSize > 900);
  }, [screenSize, setActiveMenu]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  return (
    <div className="flex justify-between p-2 md:mr-6 md:ml-6 relative">
      <NavButton customFunc={handleActiveMenu} title="Menu" icon={<AiOutlineMenu />} color={currentColor} />

      <div className="flex">
        {/* Profile Button */}
        <div
          className="relative group cursor-pointer px-2 py-1 hover:bg-gray-200 rounded-lg"
          onClick={() => handleClick("userProfile")}
        >
          <div className="flex items-center gap-2">
            <img className="rounded-full w-8 h-8" src={avatar} alt="user-profile" />
            <p>
              <span className="text-gray-400 text-sm">Hi,</span>
              <span className="text-gray-400 text-sm ml-1 font-bold">Michael</span>
              <MdKeyboardArrowDown className="text-gray-400 text-sm" />
            </p>
          </div>
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 bg-gray-700 text-white text-xs rounded px-2 py-1 transition">
            Profile
          </span>
        </div>
        {isClicked?.userProfile && <UserProfile />} {/* ✅ Fixed Null Safety */}
      </div>
    </div>
  );
};

export default Navbar;
