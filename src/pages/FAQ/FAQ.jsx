import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useStateContext } from "../../contexts/ContextProvider";
import FAQaccordion from "../../components/FAQaccordion";

const FAQ = () => {
  const { currentColor } = useStateContext();
  const [FAQ, setFAQs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFAQ, setEditFAQ] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchFAQs = async () => {
    const faqData = await axios.get(
      "http://54.236.98.193:3210/api/faq/get-all-faqs"
    );
    console.log(faqData.data.faqs);
    setFAQs(faqData.data.faqs);
  };
  useEffect(() => {
    fetchFAQs();
  }, []);
  const onSubmit = async (data) => {
    try {
      if (editFAQ) {
        console.log(editFAQ);
        const res =await axios.patch(
          `http://54.236.98.193:3210/api/faq/update-faq/${editFAQ._id}`,
          data
        );
        console.log(res);

      } else {
        console.log("handle SUbmit", data);
        const res = await axios.post(
          "http://54.236.98.193:3210/api/faq/create-faq",
          data
        );
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    } 
  };

  const handleEditFAQ = (faq) => {
    setEditFAQ(faq);
    reset({ question: faq.question, answer: faq.answer });
    setIsModalOpen(true);
  };

  return (
    <div className="m-2 md:m-2 p-4 bg-gray-200 md:rounded-3xl rounded-xl">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">FAQ Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{ backgroundColor: currentColor }}
          className=" text-white px-4 py-2 rounded"
        >
          Create FAQ
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">FAQ List</h3>
        {FAQ.length === 0 ? (
          <p>No FAQs available.</p>
        ) : (
          <FAQaccordion fetchFAQs={fetchFAQs} handleEditFAQ={handleEditFAQ} faqs={FAQ} />
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
            <h2 className="text-xl font-bold mb-4">Create FAQ</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">
                  Question Title
                </label>
                <input
                  {...register("question", {
                    required: "Question title is required",
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.question && (
                  <p className="text-red-500 text-sm">
                    {errors.question.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Answer</label>
                <input
                  {...register("answer", {
                    required: "Answeris required",
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.answer && (
                  <p className="text-red-500 text-sm">
                    {errors.answer.message}
                  </p>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white p-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                style={{ backgroundColor: currentColor }}

                  className="  p-2 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQ;
