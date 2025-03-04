import React from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FiCreditCard } from "react-icons/fi";
import { BsCurrencyDollar, BsShield, } from "react-icons/bs";
import { TiSortAlphabeticallyOutline } from "react-icons/ti";
import { IoMdContacts } from "react-icons/io";
import { SiCoursera } from "react-icons/si";
import { RiContactsLine,RiQuestionAnswerFill } from "react-icons/ri";



export const links = [
  {
    title: "Pages",
    links: [
      {
        name: "User Management",
        icon: <RiContactsLine />,
        path:""
      },
      {
        name: "Course Management",
        icon: <SiCoursera />,
        path:"course-management"
      },
      {
        name: "Quiz Management",
        icon: <RiQuestionAnswerFill />,
        path:"quiz-management"

      },
      {
        name: "Alphabet Management",
        icon: <TiSortAlphabeticallyOutline />,
        path:"alphabet-management"

      },
      {
        name: "FAQs",
        icon: <IoMdContacts />,
        path:"faq-management"

      },
     
    ],
  },
];

export const themeColors = [
  {
    name: "blue-theme",
    color: "#1A97F5",
  },
  {
    name: "green-theme",
    color: "#03C9D7",
  },
  {
    name: "purple-theme",
    color: "#7352FF",
  },
  {
    name: "red-theme",
    color: "#FF5C8E",
  },
  {
    name: "indigo-theme",
    color: "#1E4DB7",
  },
  {
    color: "#FB9678",
    name: "orange-theme",
  },
];

export const userProfileData = [
  {
    icon: <BsCurrencyDollar />,
    title: "My Profile",
    desc: "Account Settings",
    iconColor: "#03C9D7",
    iconBg: "#E5FAFB",
  },
  {
    icon: <BsShield />,
    title: "My Inbox",
    desc: "Messages & Emails",
    iconColor: "rgb(0, 194, 146)",
    iconBg: "rgb(235, 250, 242)",
  },
  {
    icon: <FiCreditCard />,
    title: "My Tasks",
    desc: "To-do and Daily Tasks",
    iconColor: "rgb(255, 244, 229)",
    iconBg: "rgb(254, 201, 15)",
  },
];
