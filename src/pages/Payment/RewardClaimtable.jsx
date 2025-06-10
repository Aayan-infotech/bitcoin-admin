import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../data/constants";

const RewardClaimTable = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [amountToSend, setAmountToSend] = useState(0.000001);
  const [processing, setProcessing] = useState(false);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/payment/pending-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setClaims(response.data.claims);
    } catch (err) {
      toast.error("Failed to load reward claims");
    }
    setLoading(false);
  };

  const openModal = (claim) => {
    setSelectedClaim(claim);
    setAmountToSend(claim.score); // Default to claimed score
  };

  const closeModal = () => {
    setSelectedClaim(null);
    setAmountToSend("");
  };

  const handleApprove = async () => {
    if (!amountToSend || isNaN(amountToSend)) {
      return toast.error("Enter a valid amount");
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/payment/transfer`,
        {
          userId: selectedClaim.user,
          amount: "0.00001",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Reward approved and amount sent");
      fetchClaims();
      closeModal();
    } catch (err) {
      toast.error("Approval failed");
    }
    setProcessing(false);
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Pending Reward Claims</h2>

      {loading ? (
        <div className="text-center py-4 text-gray-500">Loading...</div>
      ) : claims.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No pending reward claims</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total Points</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {claims.map((claim) => (
                <tr key={claim._id}>
                  <td className="px-6 py-4 text-gray-700">{claim.user?.name || claim.user}</td>
                  <td className="px-6 py-4 text-gray-700">{claim.score}</td>
                  <td className="px-6 py-4 text-gray-700">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        claim.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {claim.status === "Pending" && (
                      <button
                        onClick={() => openModal(claim)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm rounded-md"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Approve & Send Reward</h3>
            <p className="mb-2">
              User: <span className="font-medium">{selectedClaim.user?.name || selectedClaim.user}</span>
            </p>
            <p className="mb-2">Claimed Points: {selectedClaim.score}</p>
            <label className="block mb-2 text-sm font-medium text-gray-700">Amount to Send</label>
            <input
              type="number"
              className="w-full border border-gray-300 p-2 rounded-md mb-4"
              value={amountToSend}
              onChange={(e) => setAmountToSend(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center justify-center"
                disabled={processing}
              >
                {processing ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardClaimTable;
