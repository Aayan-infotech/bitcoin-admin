import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa"; // Importing CRUD icons
import { MdOutlineMessage } from "react-icons/md";

const UsersTable = ({ users = [] }) => {
  const [userData, setUserData] = useState(users || []);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDelete = (userId) => {
    setUserData(userData.filter((user) => user._id !== userId));
  };

  const handleEdit = (userId) => {
    console.log("Edit user", userId);
  };

  const sendReminderMessage = async (userId) => {
    try {
      const res = await axios.post(
        `http://18.209.91.97:3210/api/user/verification-reminder/${userId}`
      );
      console.log(res);
      toast.success("Reminder Sent successfully!");
    } catch (error) {
      toast.error(
        error?.respnse?.data?.message || "Error While Sending reminder email"
      );
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Mobile</th>
              <th className="px-4 py-2">Gender</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userData.length > 0 ? (
              userData.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="px-4 py-2">{user.name || "N/A"}</td>
                  <td className="px-4 py-2">{user.email || "N/A"}</td>
                  <td className="px-4 py-2">{user.mobileNumber || "N/A"}</td>
                  <td className="px-4 py-2">{user.gender || "N/A"}</td>
                  <td className="px-4 border py-2">
                    <button
                      className={`px-3 py-1 rounded-md ${
                        user.isEmailVerified ? "bg-green-500" : "bg-red-500"
                      } text-white`}
                    >
                      {user.isEmailVerified ? "Verified" : "Not Verified"}
                    </button>
                  </td>
                  <td className="px-4 relative py-2 flex space-x-2">
                    <button
                      onClick={() => handleEdit(user._id)}
                      className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleViewDetails(user)}
                      className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No users available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Array Data */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">User Data</h2>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-100 border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Values</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 font-semibold">Courses</td>
                    <td className="px-4 py-2">
                      {selectedUser.courses?.length > 0 ? (
                        <ul className="list-disc ml-4">
                          {selectedUser.courses.map((course, index) => (
                            <li key={index}>{course}</li>
                          ))}
                        </ul>
                      ) : (
                        "No courses"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">Quizzes</td>
                    <td className="px-4 py-2">
                      {selectedUser.quizzes?.length > 0 ? (
                        <ul className="list-disc ml-4">
                          {selectedUser.quizzes.map((quiz, index) => (
                            <li key={index}>{quiz}</li>
                          ))}
                        </ul>
                      ) : (
                        "No quizzes"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">Linked Cards</td>
                    <td className="px-4 py-2">
                      {selectedUser.linkedCards?.length > 0 ? (
                        <ul className="list-disc ml-4">
                          {selectedUser.linkedCards.map((card, index) => (
                            <li key={index}>{card}</li>
                          ))}
                        </ul>
                      ) : (
                        "No linked cards"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
