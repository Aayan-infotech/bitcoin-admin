import React from "react";

const NotificationTable = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2 border">Sent By</th>
            <th className="text-left px-4 py-2 border">Sent To</th>
            <th className="text-left px-4 py-2 border">Message</th>
            <th className="text-left px-4 py-2 border">Type</th>
            <th className="text-left px-4 py-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((notification, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{notification.sentBy || "N/A"}</td>
              <td className="px-4 py-2">{notification.sentTo || "N/A"}</td>
              <td className="px-4 py-2">{notification.message}</td>
              <td className="px-4 py-2 capitalize">{notification.type}</td>
              <td className="px-4 py-2">
                {new Date(notification.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotificationTable;
