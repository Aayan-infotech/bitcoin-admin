import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../data/constants";

const QuizQuestionsManagement = () => {
  const { currentColor } = useStateContext();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const { quizId } = useParams();

  const [sections, setSections] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);
  const [optionFields, setOptionFields] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSections = useCallback(async () => {
    if (!quizId) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/quiz/get-quizById/${quizId}`);
      setSections(response.data.quiz);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      toast.error("Error fetching quiz data");
    }
  }, [quizId]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleEditQuestion = (question) => {
    setEditQuestion(question);
    setIsModalOpen(true);
    reset({ text: question.text });
    setOptionFields(question.options || ["", "", "", ""]);
    setCorrectAnswer(question.correctAnswer || "");
  };

  const handleAddQuestion = () => {
    setEditQuestion(null);
    reset({ text: "" });
    setOptionFields(["", "", "", ""]);
    setCorrectAnswer("");
    setIsModalOpen(true);
  };

  const updateOption = (index, value) => {
    const updatedOptions = [...optionFields];
    updatedOptions[index] = value;
    setOptionFields(updatedOptions);
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/quiz/delete-question`, {
        data: { questionId },
      });
      if (res.data.message) toast.success(res.data.message);
      fetchSections();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete question");
    }
  };

  const saveQuestionChanges = async (data) => {
    if (loading) return; // avoid multiple clicks

    try {
      setLoading(true);
      const updatedQuestion = {
        text: data.text,
        options: optionFields.map((opt) => opt.trim()).filter(Boolean),
        correctAnswer: correctAnswer,
      };

      if (editQuestion) {
        await axios.patch(
          `${API_BASE_URL}/quiz/update-question/${editQuestion._id}`,
          updatedQuestion
        );
        toast.success("Question updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/quiz/add-question/${quizId}`, {
          questions: [updatedQuestion],
        });
        toast.success("Question added successfully");
      }

      fetchSections();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error("Error saving question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-4 p-6 bg-gray-100 rounded-3xl">
      <div className="flex justify-between items-center font-semibold text-center mb-6">
        <h1>{sections?.title} - Questionnaire Management</h1>
        <button
          onClick={handleAddQuestion}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Add Question
        </button>
      </div>

      <div className="mb-6 text-center">
        <img
          src={sections?.image}
          alt={sections?.title}
          className="w-full h-48 object-cover rounded-lg shadow-lg"
        />
        <p className="mt-4 text-gray-700 text-xl">
          Description:- <span className="text-gray-900">{sections?.description}</span>
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
              </td>
              <td className="border p-3">
                <ul className="space-y-1">
                  {question.options?.map((option, idx) => (
                    <li key={idx} className="text-gray-700">{option}</li>
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
                  {...register("text", { required: "Question text is required" })}
                  className="w-full p-2 border rounded"
                />
                {errors.text && (
                  <p className="text-red-500 text-sm">{errors.text.message}</p>
                )}
              </div>

              <label className="block mb-2">Options</label>
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="mb-2 flex items-center">
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={optionFields[index] || ""}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="w-full p-2 border rounded mr-2"
                    required
                  />
                  <input
                    type="radio"
                    name="correctOption"
                    value={optionFields[index]}
                    checked={correctAnswer === optionFields[index]}
                    onChange={() => setCorrectAnswer(optionFields[index])}
                  />
                  <label className="ml-1 text-sm">Correct</label>
                </div>
              ))}

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
                  disabled={loading}
                  className={`p-2 rounded text-white ${
                    loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600"
                  }`}
                >
                  {loading ? "Saving..." : "Save Changes"}
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
