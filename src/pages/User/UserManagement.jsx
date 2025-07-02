import React from "react";
import { Header } from "../../components";
import UsersTable from "../../components/UsersTable";

const UserManagement = () => {
  return (
    <div className="m-2 md:m-2 p-4 relative md:p-10 bg-gray-200 md:rounded-3xl rounded-xl">
      <div className="flex my-2 justify-between">
        <Header category="Page" title="Users" />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <UsersTable />
      </div>
    </div>
  );
};

export default UserManagement;
