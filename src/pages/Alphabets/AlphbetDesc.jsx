import React, { useEffect, useState } from "react";
import { FaEye, FaEdit } from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "../../data/constants";

const AlphabetDesc = () => {
  const [oracleData, setOracleData] = useState([]);
  const [satoshiData, setSatoshiData] = useState(null);
  const [halvingData, setHalvingData] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const cardData = [
    { label: "O", title: "Oracles", section: "oracle" },
    { label: "S", title: "Satoshi Videos", section: "satoshi" },
    { label: "H", title: "Halving Countdown", section: "halving" },
  ];

  useEffect(() => {
    const fetchAllCardDetails = async () => {
      try {
        const requests = [
          axios.get(`${API_BASE_URL}/abc-details/o/get-oracle`),
          axios.get(`${API_BASE_URL}/abc-details/s/get-satoshi`),
          axios.get(`${API_BASE_URL}/abc-details/h/halving`),
        ];

        const [oracleRes, satoshiRes, halvingRes] = await Promise.all(requests);
        setOracleData(oracleRes.data.data || []);
        setSatoshiData(satoshiRes.data.data || {});
        setHalvingData(halvingRes.data.data || {});
      } catch (error) {
        console.error("Error fetching alphabet details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCardDetails();
  }, []);

  const openModal = (section, edit = false) => {
    setSelectedSection(section);
    setShowModal(true);
    setIsEditing(edit);
  };

  const handleEditChange = (field, value, index = null) => {
    if (selectedSection === "oracle") {
      const updated = [...oracleData];
      updated[index][field] = value;
      setOracleData(updated);
    } else if (selectedSection === "satoshi") {
      setSatoshiData({ ...satoshiData, [field]: value });
    }
  };

  const handleFileChange = (e, index = null) => {
    const file = e.target.files[0];
    if (!file) return;
    const videoUrl = URL.createObjectURL(file);
    if (selectedSection === "oracle") {
      const updated = [...oracleData];
      updated[index].video = [videoUrl];
      setOracleData(updated);
    } else if (selectedSection === "satoshi") {
      setSatoshiData({ ...satoshiData, video: [videoUrl] });
    }
  };

  const handleSave = async () => {
    try {
      if (selectedSection === "oracle") {
        await Promise.all(
          oracleData.map(async (item) => {
            const formData = new FormData();
            formData.append("headline", item.headline);
            formData.append("subHeadLine", item.subHeadLine);

            if (item.video && item.video[0] instanceof File) {
              formData.append("files", item.video[0]);
            }

            await axios.put(
              `${API_BASE_URL}/abc-details/o/${item._id}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
          })
        );
      } else if (selectedSection === "satoshi") {
        await axios.put(
          `${API_BASE_URL}/abc-details/s/${satoshiData._id}`,
          satoshiData
        );
      }
      setShowModal(false);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl text-white font-bold mb-6">Alphabets Overview</h1>

      {loading ? (
        <p className="text-white text-center">Loading alphabet data...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-md shadow-md">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase font-medium text-gray-600">
              <tr>
                <th className="px-6 py-4">Label</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cardData.map((card) => (
                <tr
                  key={card.section}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-lg">{card.label}</td>
                  <td className="px-6 py-4">{card.title}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <button
                        onClick={() => openModal(card.section)}
                        className="text-blue-500 hover:text-blue-700 text-xl p-1"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      {card.section !== "halving" && (
                        <button
                          onClick={() => openModal(card.section, true)}
                          className="text-green-500 hover:text-green-700 text-xl p-1"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-3xl relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 capitalize">
              {selectedSection} Details
            </h2>

            {isEditing && (
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-1 rounded mb-4"
              >
                Save
              </button>
            )}

            {selectedSection === "oracle" && Array.isArray(oracleData) && (
              <div className="space-y-4">
                {oracleData.map((item, index) => (
                  <div
                    key={item._id}
                    className="border p-4 rounded bg-gray-50 shadow-sm"
                  >
                    {isEditing ? (
                      <>
                        <input
                          value={item.headline}
                          onChange={(e) =>
                            handleEditChange("headline", e.target.value, index)
                          }
                          className="w-full mb-2 p-2 border rounded"
                        />
                        <input
                          value={item.subHeadLine}
                          onChange={(e) =>
                            handleEditChange(
                              "subHeadLine",
                              e.target.value,
                              index
                            )
                          }
                          className="w-full mb-2 p-2 border rounded"
                        />
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleFileChange(e, index)}
                          className="w-full mb-2"
                        />
                      </>
                    ) : (
                      <>
                        <h3 className="font-bold">{item.headline}</h3>
                        <p className="text-gray-600">{item.subHeadLine}</p>
                      </>
                    )}
                    {item.video?.[0] && (
                      <video controls className="w-full mt-2 rounded shadow-md">
                        <source src={item.video[0]} type="video/mp4" />
                      </video>
                    )}
                  </div>
                ))}
              </div>
            )}

            {selectedSection === "satoshi" && satoshiData && (
              <div>
                <h3 className="font-semibold mb-2">Satoshi Video</h3>
                {isEditing ? (
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileChange(e)}
                    className="w-full mb-2"
                  />
                ) : (
                  satoshiData.video?.[0] && (
                    <video controls className="w-full rounded">
                      <source src={satoshiData.video[0]} type="video/mp4" />
                    </video>
                  )
                )}
              </div>
            )}

            {selectedSection === "halving" && halvingData && (
              <div className="space-y-2 text-sm text-gray-800">
                <p>
                  <strong>Price:</strong> ${halvingData.price}
                </p>
                <p>
                  <strong>Current Block:</strong> {halvingData.currentBlock}
                </p>
                <p>
                  <strong>Blocks Remaining:</strong>{" "}
                  {halvingData.blocksRemaining}
                </p>
                {halvingData.estimatedTime && (
                  <div>
                    <strong>Estimated Time:</strong>
                    <ul className="ml-4 list-disc">
                      {Object.entries(halvingData.estimatedTime).map(
                        ([key, value]) => (
                          <li key={key}>
                            {key}: {value}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlphabetDesc;
