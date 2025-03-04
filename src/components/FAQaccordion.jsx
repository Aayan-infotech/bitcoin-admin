import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useStateContext } from "../contexts/ContextProvider";
import axios from "axios";
import toast from "react-hot-toast";

const FAQAccordion = ({ faqs, handleEditFAQ ,fetchFAQs}) => {
  const [openIndex, setOpenIndex] = useState(null);
  const { currentColor } = useStateContext();

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleFaqDelete=(async(faq)=>{
   try {
    const res=await axios.delete(`http://54.236.98.193:3210/api/faq/delete-faq/${faq._id}`)
    toast.success(res?.data?.message)
    fetchFAQs()
   } catch (error) {
    console.log(error)
   }
  })

  return (
    <div className="w-full mt-10">
      {faqs.map((item, index) => (
        <div
          key={index}
          className="mb-4 border border-gray-200 rounded-lg overflow-hidden shadow-sm"
        >
          {/* Header Section */}
          <div className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors">
            {/* Buttons group arranged side by side on the left */}

            {/* Question text, aligned to the left with a left margin */}
            <span className="ml-4 text-lg font-semibold text-gray-800">
              {item.question}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => toggleAccordion(index)}
                className="flex items-center focus:outline-none"
              >
                <FiChevronDown
                  style={{ color: currentColor }}
                  className={`text-2xl  transform transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              <button
                onClick={() => handleEditFAQ(item)}
                style={{ color: currentColor }}
                className="  px-3 py-1 rounded hover:bg-pink-400 transition"
              >
                <AiOutlineEdit size={25} />
              </button>
              <button
                onClick={() => handleFaqDelete(item)}
                style={{ color: currentColor }}
                className="  px-3 py-1 rounded hover:bg-pink-400 transition"
              >
                <AiOutlineDelete size={25} />
              </button>
            </div>
          </div>
          {/* Answer Panel */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? "max-h-screen p-6 bg-gray-50" : "max-h-0"
            }`}
          >
            <p className="text-gray-700 leading-relaxed">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;
