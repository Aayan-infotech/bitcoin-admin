import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import toast from "react-hot-toast";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { MdOutlineQuiz } from "react-icons/md";

const QuizManagement = () => {
  const { currentColor } = useStateContext();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editQuiz, setEditQuiz] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const fetchQuizzes = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:3210/api/quiz/get-all-quizzes"
      );
      toast.success(response.data.message);
      setQuizzes(response.data.quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.thumbnail && data.thumbnail[0]) {
        formData.append("files", data.thumbnail[0]);
      }

      let response;
      if (editQuiz) {
        response = await axios.patch(
          `http://localhost:3210/api/quiz/update-quiz/${editQuiz._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        response = await axios.post(
          "http://localhost:3210/api/quiz/create-quiz",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      if (response.data.success) {
        toast.success(
          editQuiz ? "Quiz updated successfully" : "Quiz created successfully"
        );
        reset();
        setPreviewImage(null);
        setEditQuiz(null);
        setIsModalOpen(false);
        fetchQuizzes(); 
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast.error("Failed to save quiz");
    }
  };

  const onEdit = useCallback(
    (quiz) => {
      setEditQuiz(quiz);
      setValue("title", quiz.title);
      setValue("description", quiz.description);
      setPreviewImage(quiz.image);
      setIsModalOpen(true);
    },
    [setValue]
  );

  const onDelete = async (quizId) => {
    try {
      await axios.delete(
        `http://localhost:3210/api/quiz/delete-quiz/${quizId}`
      );
      toast.success("Quiz deleted successfully");
      fetchQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Failed to delete quiz");
    }
  };

  const handleViewQuestions = useCallback(
    (quiz) => {
      navigate(`/quiz/${quiz._id}/questions`);
    },
    [navigate]
  );

  const quizList = useMemo(() => {
    return (
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Image</th>
            <th className="border border-gray-300 p-2">Title</th>
            <th className="border border-gray-300 p-2">Description</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => (
            <tr key={quiz._id} className="border border-gray-300">
              <td className="border border-gray-300 p-2">
                <img
                  src={quiz.image}
                  alt={quiz.title}
                  className="w-16 h-16 object-cover rounded-md"
                />
              </td>
              <td className="border border-gray-300 p-2">{quiz.title}</td>
              <td className="border border-gray-300 p-2">{quiz.description}</td>
              <td className="border border-gray-300 p-2 space-x-2">
                <button
                  onClick={() => onEdit(quiz)}
                  className="text-blue-500 hover:underline"
                >
                  <AiOutlineEdit size={25} />
                </button>
                <button
                  onClick={() => onDelete(quiz._id)}
                  className="text-red-500 hover:underline"
                >
                  <AiOutlineDelete size={25} />
                </button>
                <button
                  onClick={() => handleViewQuestions(quiz)}
                  className="text-green-500 hover:underline"
                >
                  <MdOutlineQuiz size={25} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }, [quizzes, onEdit, handleViewQuestions, onDelete]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="m-2 md:m-2 p-4 bg-gray-200 md:rounded-3xl rounded-xl">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Quiz Management</h2>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setEditQuiz(null);
            reset();
            setPreviewImage(null);
          }}
          style={{ backgroundColor: currentColor }}
          className="text-white px-4 py-2 rounded"
        >
          Create Quiz
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Quiz List</h3>
        {quizzes.length === 0 ? (
          <p>No quizzes available.</p>
        ) : (
          <div>{quizList}</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
            <h2 className="text-xl font-bold mb-4">
              {editQuiz ? "Edit Quiz" : "Create Quiz"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Quiz Title</label>
                <input
                  {...register("title", { required: "Quiz title is required" })}
                  className="w-full p-2 border rounded"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-semibold">Description</label>
                <textarea
                  {...register("description")}
                  className="w-full p-2 border rounded"
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-semibold">Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("thumbnail")}
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded"
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="mt-2 w-24 h-24 object-cover rounded"
                  />
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    reset();
                    setEditQuiz(null);
                    setPreviewImage(null);
                  }}
                  className="bg-gray-500 text-white p-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded"
                >
                  {editQuiz ? "Update Quiz" : "Create Quiz"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizManagement;
