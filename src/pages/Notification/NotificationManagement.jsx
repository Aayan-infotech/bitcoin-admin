import React, { useState, useEffect, useCallback } from "react";
import { Header } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";
import axios from "axios";
import toast from "react-hot-toast";
import NotificationTable from "../../components/NotificationTable";
import { API_BASE_URL } from "../../data/constants";

const NotificationModal = ({
  isOpen,
  onClose,
  onSend,
  message,
  setMessage,
  targetUserId,
  setTargetUserId,
  users,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Send Push Notification</h2>

        <textarea
          rows={4}
          className="w-full border p-2 rounded mb-4"
          placeholder="Enter your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <select
          className="w-full border p-2 rounded mb-4"
          value={targetUserId}
          onChange={(e) => setTargetUserId(e.target.value)}
        >
          <option value="">Send to All Users</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {`${user.name.padEnd(25, " ")} | ${user.email}`}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-white rounded"
            style={{ backgroundColor: "#4CAF50" }}
            onClick={onSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const NotificationManagement = () => {
  const token = localStorage.getItem("token");
  const { currentColor } = useStateContext();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const [users, setUsers] = useState([]);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/notification/all-notification`
      );
      setNotifications(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to fetch notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/user/get-all-notification-user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(res.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, [fetchNotifications, fetchUsers]);

  const handleSendNotification = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/notification/create-notification`,
        { message, targetUserId: targetUserId || undefined },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Notification sent successfully");
      setIsModalOpen(false);
      setMessage("");
      setTargetUserId("");
      fetchNotifications();
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification.");
    }
  };

  return (
    <div className="m-2 md:m-2 p-4 relative md:p-10 bg-gray-200 md:rounded-3xl rounded-xl">
      <div className="flex my-2 justify-between">
        <Header category="Page" title="Notification Management" />
        <button
          onClick={() => setIsModalOpen(true)}
          style={{ backgroundColor: currentColor }}
          className="mb-1 text-white px-2 rounded hover:opacity-80"
        >
          Push Notification
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <p>Loading notifications...</p>
        ) : notifications?.length === 0 ? (
          <p>No notifications found</p>
        ) : (
          <div className="max-h-[500px] overflow-y-auto">
            <NotificationTable data={notifications} />
          </div>
        )}
      </div>

      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSend={handleSendNotification}
        message={message}
        setMessage={setMessage}
        targetUserId={targetUserId}
        setTargetUserId={setTargetUserId}
        users={users}
      />
    </div>
  );
};

export default NotificationManagement;
