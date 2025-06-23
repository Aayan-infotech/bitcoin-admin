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
  const [showSettled, setShowSettled] = useState(false); // new

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
    setAmountToSend(claim.score);
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
        `${API_BASE_URL}/payment/approve-request/${selectedClaim?._id}`,
        {
          userId: selectedClaim.user,
          amount: amountToSend,
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

  const pendingClaims = claims.filter((c) => c.status === "Pending");
  const settledClaims = claims.filter((c) => c.status === "Approved");

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Reward Claim</h2>

      {loading ? (
        <div className="text-center py-4 text-gray-500">Loading...</div>
      ) : (
        <>
          {/* PENDING CLAIMS TABLE */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Claims</h3>
            {pendingClaims.length === 0 ? (
              <p className="text-gray-500 text-sm">No pending reward claims</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Points</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingClaims.map((claim) => (
                      <tr key={claim._id}>
                        <td className="px-6 py-4 text-gray-700">{claim.user?.name || claim.user}</td>
                        <td className="px-6 py-4 text-gray-700">{claim.score}</td>
                        <td className="px-6 py-4 text-gray-700">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openModal(claim)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm rounded-md"
                          >
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* SETTLED CLAIMS ACCORDION */}
          <div>
            <button
              onClick={() => setShowSettled((prev) => !prev)}
              className="text-sm text-blue-600 hover:underline mb-2"
            >
              {showSettled ? "Hide Settled Claims ▲" : "Show Settled Claims ▼"}
            </button>

            {showSettled && (
              <div className="overflow-x-auto border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Settled Claims</h3>
                {settledClaims.length === 0 ? (
                  <p className="text-gray-500 text-sm">No settled reward claims</p>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Points</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {settledClaims.map((claim) => (
                        <tr key={claim._id}>
                          <td className="px-6 py-4 text-gray-700">{claim.user?.name || claim.user}</td>
                          <td className="px-6 py-4 text-gray-700">{claim.score}</td>
                          <td className="px-6 py-4 text-gray-700">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                              Approved
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* APPROVAL MODAL */}
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
