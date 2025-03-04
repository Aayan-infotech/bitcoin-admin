import React from "react";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineEye } from "react-icons/ai";

const CourseDisplay = ({ courses, onEdit, onDelete, onViewSections, onUpdateStatus }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border">Course Name</th>
            <th className="py-2 px-4 border">Description</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border">{course.courseName}</td>
              <td className="py-2 px-4 border">{course.courseDescription}</td>
              <td className="py-2 px-4 border text-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={course.status === "Published"}
                    onChange={() => onUpdateStatus(course._id, course.status === "Draft" ? "Published" : "Draft")}
                    className="sr-only"
                  />
                  <div
                    className={`relative w-12 h-6 rounded-full transition duration-300 ${
                      course.status === "Published" ? "bg-green-500" : "bg-gray-400"
                    }`}
                  >
                    <div
                      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        course.status === "Published" ? "translate-x-6" : ""
                      }`}
                    />
                  </div>
                </label>
              </td>
              <td className="py-2 px-4 border text-center flex justify-center space-x-2">
                <button onClick={() => onViewSections(course)} className="text-green-500 hover:text-green-700">
                  <AiOutlineEye size={20} />
                </button>
                <button onClick={() => onEdit(course)} className="text-blue-500 hover:text-blue-700">
                  <AiOutlineEdit size={20} />
                </button>
                <button onClick={() => onDelete(course._id)} className="text-red-500 hover:text-red-700">
                  <AiOutlineDelete size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseDisplay;
