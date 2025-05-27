import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaMoneyBill } from "react-icons/fa";
import { API_BASE_URL } from "../data/constants";

const PaymentTable = ({ users = [] }) => {
  const [userData, setUserData] = useState(users || []);
  const [selectedUser, setSelectedUser] = useState(null);
  const [coinAmount, setCoinAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userToken = localStorage.getItem("token");

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/user/get-all-user`);
      setUserData(res.data.users);
      console.log(res.data);
    } catch (err) {
      toast.error("Failed to fetch user!");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const openModal = (user) => {
    setSelectedUser(user);
    setCoinAmount("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleSendCoins = async () => {
    if (!coinAmount || isNaN(coinAmount)) {
      toast.error("Enter a valid coin amount");
      return;
    }

    try {
      console.log(selectedUser, "selected user");
      const res = await axios.post(
        `${API_BASE_URL}/payment/transfer`,
        { userId: selectedUser._id, amount: coinAmount },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },a
        }
      );
      toast.success("Coins sent successfully!");
      closeModal();
    } catch (error) {
      toast.error("Failed to send coins");
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User's Payment Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Wallet</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {userData.length > 0 ? (
              userData.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="px-4 py-2">{user.name || "N/A"}</td>
                  <td className="px-4 py-2">{user.wallet_address || "N/A"}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => openModal(user)}
                      className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <FaMoneyBill />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No users available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Send Coins</h2>
            <p>
              <strong>Name:</strong> {selectedUser.name}
            </p>
            <p>
              <strong>Wallet:</strong> {selectedUser.wallet_address}
            </p>
            <input
              type="number"
              value={coinAmount}
              onChange={(e) => setCoinAmount(e.target.value)}
              onWheel={(e) => e.target.blur()} // 👈 Prevent scroll increment
              placeholder="Enter coin amount"
              className="mt-4 w-full p-2 border rounded"
            />

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSendCoins}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTable;
