import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useStateContext } from "../../contexts/ContextProvider";
import FAQaccordion from "../../components/FAQaccordion";
import toast from "react-hot-toast";

const FAQ = () => {
  const { currentColor } = useStateContext();
  const [faqs, setFAQs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFAQ, setEditFAQ] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch FAQs from API
  const fetchFAQs = useCallback(async () => {
    try {
      toast.dismiss();
      const faqData = await axios.get(
        "http://18.209.91.97:3210/api/faq/get-all-faqs"
      );
      console.log(faqData.data.faqs);
      setFAQs(faqData.data.faqs);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      toast.error("Failed to fetch FAQs.");
    }
  }, []);

  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  // Submit handler for create/update FAQ
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (editFAQ) {
        console.log("Editing FAQ:", editFAQ);
        const res = await axios.patch(
          `http://18.209.91.97:3210/api/faq/update-faq/${editFAQ._id}`,
          data
        );
        console.log(res);
        toast.success(res.data.message || "FAQ updated successfully");
      } else {
        console.log("Creating FAQ with data:", data);
        const res = await axios.post(
          "http://18.209.91.97:3210/api/faq/create-faq",
          data
        );
        console.log(res);
        toast.success(res.data.message || "FAQ created successfully");
      }
      // Reset form, clear edit state and close modal
      reset({ question: "", answer: "" });
      setEditFAQ(null);
      setIsModalOpen(false);
      fetchFAQs();
    } catch (error) {
      console.error(error);
      toast.error("Error saving FAQ");
    } finally {
      setLoading(false);
    }
  };

  // Open modal for editing FAQ
  const handleEditFAQ = (faq) => {
    setEditFAQ(faq);
    reset({ question: faq.question, answer: faq.answer });
    setIsModalOpen(true);
  };

  // Close modal and reset form
  const handleModalFalse = () => {
    reset({ question: "", answer: "" });
    setEditFAQ(null);
    setIsModalOpen(false);
  };

  return (
    <div className="m-2 md:m-2 p-4 bg-gray-200 md:rounded-3xl rounded-xl">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">FAQ Management</h2>
        <button
          onClick={() => {
            setIsModalOpen(true);
            toast.info("Creating a new FAQ.");
          }}
          style={{ backgroundColor: currentColor }}
          className="text-white px-4 py-2 rounded"
        >
          Create FAQ
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">FAQ List</h3>
        {faqs.length === 0 ? (
          <p>No FAQs available.</p>
        ) : (
          <FAQaccordion
            fetchFAQs={fetchFAQs}
            handleEditFAQ={handleEditFAQ}
            faqs={faqs}
          />
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
            <h2 className="text-xl font-bold mb-4">
              {editFAQ ? "Edit FAQ" : "Create FAQ"}
            </h2>
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
                    required: "Answer is required",
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
                  onClick={handleModalFalse}
                  className="bg-gray-500 text-white p-2 rounded mr-2 hover:bg-gray-600"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: currentColor }}
                  className="text-white p-2 rounded hover:bg-blue-600 flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loader mr-2">Loading...</span>
                  ) : editFAQ ? (
                    "Update FAQ"
                  ) : (
                    "Create FAQ"
                  )}
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
