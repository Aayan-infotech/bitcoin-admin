import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const QuizQuestionsManagement = () => {
  const { currentColor } = useStateContext();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const { quizId } = useParams();
  const [sections, setSections] = useState(null); // Start with null to indicate loading state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);

  // Fetch Quiz and Questions Data
  const fetchSections = useCallback(async () => {
    if (!quizId) return;
    try {
      console.log("Fetching quiz data for Quiz ID:", quizId);
      const response = await axios.get(
        `http://3.223.253.106:3210/api/quiz/get-quizById/${quizId}`
      );
      setSections(response.data.quiz); // Assuming quiz contains questions
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      toast.error("Error fetching quiz data");
    }
  }, [quizId]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  // Open the modal for editing a question
  const handleEditQuestion = (question) => {
    setEditQuestion(question);
    setIsModalOpen(true);
    reset({
      ...question,
      options: question.options.join(", "), // Convert options array into a comma-separated string
    });
  };

  // Open modal in "add" mode
  const handleAddQuestion = () => {
    setEditQuestion(null); // Clear any edit state
    reset({ text: "", options: "", correctAnswer: "" }); // Reset the form fields for new question
    setIsModalOpen(true);
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      console.log(questionId);
      const res = await axios.delete(
        "http://3.223.253.106:3210/api/quiz/delete-question",
        { data: { questionId } } 
      );
      if (res.data.message) {
        toast.success(res.data.message);
      }
      console.log(res);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete question");
    }
    fetchSections();
    fetchSections();
  };

  // Save Edited or Added Question
  const saveQuestionChanges = async (data) => {
    try {
      const updatedQuestion = {
        ...data,
        options: data.options.split(",").map((option) => option.trim()), // Convert string back into array
      };

      if (editQuestion) {
        // Editing an existing question
        await axios.patch(
          `http://3.223.253.106:3210/api/quiz/update-question/${editQuestion._id}`,
          updatedQuestion
        );
        toast.success("Question updated successfully");
      } else {
        // Adding a new question
        await axios.post(
          `http://3.223.253.106:3210/api/quiz/add-question/${quizId}`,
          {questions:[updatedQuestion]}
        );
        toast.success("Question added successfully");
      }
      fetchSections(); // Reload quiz data with updated/added question
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error("Error updating question:", error);
      toast.error("Error saving question");
    }
  };

  return (
    <div className="m-4 p-6 bg-gray-100 rounded-3xl">
      <div className="flex justify-between items-center font-semibold text-center mb-6">
        <h1>{sections?.title} - Questionnaire Management</h1>
        {/* Add Question Button */}
        <button 
          onClick={handleAddQuestion}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Add Question
        </button>
      </div>

      {/* Display Quiz Image and Description */}
      <div className="mb-6 text-center">
        <img
          src={sections?.image}
          alt={sections?.title}
          className="w-full h-48 object-cover rounded-lg shadow-lg"
        />
        <p className="mt-4 text-gray-700 text-xl">
          Description:-{" "}
          <span className="text-gray-900">{sections?.description}</span>
        </p>
      </div>

      <table className="w-full border-collapse table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-800 text-left">
            <th className="border p-3">Question</th>
            <th className="border p-3">Options</th>
            <th className="border p-3">Correct Answer</th>
            <th className="border p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sections?.questions?.map((question) => (
            <tr key={question._id} className="border-b hover:bg-gray-50">
              <td className="border p-3">
                <p className="font-semibold">{question.text}</p>
                <p className="text-sm text-gray-600">
                  {question?.description?.slice(0, 50)}
                </p>
              </td>
              <td className="border p-3">
                <ul className="space-y-2">
                  {question.options?.map((option, idx) => (
                    <li key={idx} className="text-gray-700">
                      {option}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="border p-3 text-gray-700 font-semibold">
                {question.correctAnswer}
              </td>
              <td className="border p-3">
                <button
                  onClick={() => handleEditQuestion(question)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteQuestion(question._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Editing/Adding Question */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">
              {editQuestion ? "Edit Question" : "Add Question"}
            </h2>
            <form onSubmit={handleSubmit(saveQuestionChanges)}>
              <div className="mb-4">
                <label className="block mb-2">Question Text</label>
                <input
                  type="text"
                  {...register("text", {
                    required: "Question text is required",
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.text && (
                  <p className="text-red-500 text-sm">{errors.text.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-2">Options (comma separated)</label>
                <input
                  type="text"
                  {...register("options", {
                    required: "Options are required",
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.options && (
                  <p className="text-red-500 text-sm">{errors.options.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-2">Correct Answer</label>
                <input
                  type="text"
                  {...register("correctAnswer", {
                    required: "Correct answer is required",
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.correctAnswer && (
                  <p className="text-red-500 text-sm">{errors.correctAnswer.message}</p>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white p-2 rounded mr-2 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizQuestionsManagement;
