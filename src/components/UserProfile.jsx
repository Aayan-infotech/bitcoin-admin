import { useEffect, useRef, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import Button from "./Button";
import { userProfileData } from "../data/dummy";
import { MdOutlineCancel } from "react-icons/md";
import avatar from "../data/avatar4.jpg";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { logout, currentColor, setIsClicked } = useStateContext();
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const handleLogout = async () => {
    console.log("log out called");
    await logout();
    navigate("/", { replace: true });
  };      

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsClicked((prev) => ({ ...prev, userProfile: false }));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsClicked]);

  return (
    <div
      ref={modalRef}
      className="nav-item z-10 right-1 top-16 absolute bg-white dark:bg-[#42464D] p-8 rounded-lg md:w-96"
    >
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>

      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full h-24 w-24"
          src={avatar}
          alt="user-profile"
        />
        <div>
          <p className="font-semibold text-xl text-gray-200">
            Bitcoin ABC Admin
          </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            Administrator
          </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
            bitcoinadmin@yopmail.com
          </p>
        </div>
      </div>

      <div className="mt-5">
        <button
          style={{ backgroundColor: currentColor }}
          className={` text-white px-4 py-2 rounded`}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
