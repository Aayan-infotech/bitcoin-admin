import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Header } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import UsersTable from "../../components/UsersTable";
import { API_BASE_URL } from "../../data/constants";
import PaymentTable from "../../components/PaymentTable";

const PaymentManagement = () => {
  const navigate = useNavigate();
  const { currentColor } = useStateContext();
  const [Users, setUsers] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch Users with optimization
  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/get-all-user`);
      toast.success(response.data.message);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching Users:", error);
      toast.error("Failed to fetch Users.");
    }
  }, [Users]);

  useEffect(() => {
    fetchUsers();
  }, []);


  return (
    <div className="m-2 md:m-2 p-4 relative md:p-10 bg-gray-200 md:rounded-3xl rounded-xl">
      <div className="flex my-2 justify-between">
        <Header category="Page" title="Payment Management" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {Users.length === 0 ? (
          <p>No Users found</p>
        ) : (
          <PaymentTable users={Users} />
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;
