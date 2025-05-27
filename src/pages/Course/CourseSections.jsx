import React, { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { API_BASE_URL } from "../../data/constants";

const CourseSections = () => {
  const { currentColor } = useStateContext();
  const { courseId } = useParams();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newSection, setNewSection] = useState({
    title: "",
    description: "",
    videoFile: null,
    videoUrl: "",
    timeDuration: "",
  });
  const [editingSectionId, setEditingSectionId] = useState(null);

  const videoFileInput = useRef(null);
  const videoPreviewRef = useRef(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/course/get-course-details/${courseId}`
      );
      console.log(res.data);
      if (res.data.success) {
        if (res.data.data.courseContent.length === 0) {
          toast.success("There are no sections in this Course");
        } else {
          toast.success(res.data.message);
        }
        setSections(res.data.data.courseContent);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      toast.error("Error fetching sections");
    }
  };

  const handleAddOrUpdateSection = async () => {
    setLoading(true);
    const url = editingSectionId
      ? `${API_BASE_URL}/course/update-section/${editingSectionId}`
      : `${API_BASE_URL}/course/create-section`;
    try {
      const formData = new FormData();
      const method = editingSectionId ? "patch" : "post";

      if (editingSectionId) {
        formData.append("sectionId", editingSectionId);
      } else {
        formData.append("courseId", courseId);
      }

      formData.append("title", newSection.title);
      formData.append("description", newSection.description);
      if (newSection.videoFile) {
        formData.append("files", newSection.videoFile);
      }
      formData.append("timeDuration", newSection.timeDuration);

      const res = await axios[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Section saved successfully! 🎉");
        fetchSections();
        cancelEdit();
      }
    } catch (error) {
      console.error("Error adding section:", error);
      toast.error("Error adding section");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/course/delete-section/${sectionId}`
      );
      setSections(sections.filter((section) => section._id !== sectionId));
      toast.success("Section Deleted Successfully");
    } catch (error) {
      console.error("Error deleting section:", error);
      toast.error("Error deleting section");
    }
  };

  const handleEdit = (section) => {
    setEditingSectionId(section._id);
    setNewSection({
      title: section.title,
      description: section.description,
      videoFile: null,
      videoUrl: section.videoUrl || "",
      timeDuration: section.timeDuration,
    });
    toast.success("Section ready for editing");
  };

  const cancelEdit = () => {
    setEditingSectionId(null);
    setNewSection({
      title: "",
      description: "",
      videoFile: null,
      videoUrl: "",
      timeDuration: "",
    });
    if (videoFileInput.current) {
      videoFileInput.current.value = "";
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setNewSection({
        ...newSection,
        videoFile: file,
        videoUrl: videoUrl,
        timeDuration: "",
      });

      setTimeout(() => {
        if (videoPreviewRef.current) {
          videoPreviewRef.current.load();
          videoPreviewRef.current.onloadedmetadata = () => {
            setNewSection((prev) => ({
              ...prev,
              timeDuration: videoPreviewRef.current.duration.toFixed(2),
            }));
          };
        }
      }, 500);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md md:rounded-3xl rounded-xl">
      <h2 className="text-xl font-bold mb-4">Course Sections</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={newSection.title}
          onChange={(e) =>
            setNewSection({ ...newSection, title: e.target.value })
          }
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={newSection.description}
          onChange={(e) =>
            setNewSection({ ...newSection, description: e.target.value })
          }
          className="border p-2 w-full mb-2"
        />

        {newSection.videoUrl && (
          <video
            ref={videoPreviewRef}
            src={newSection.videoUrl}
            controls
            className="w-full h-40 mb-2 rounded-lg shadow-md"
          />
        )}

        <input
          type="file"
          accept="video/*"
          ref={videoFileInput}
          onChange={handleVideoChange}
          className="border p-2 w-full mb-2"
        />

        <input
          type="text"
          placeholder="Duration (Auto-filled)"
          value={newSection.timeDuration}
          readOnly
          className="border p-2 w-full mb-2 bg-gray-100"
        />

        <div className="flex space-x-2">
          <button
            style={{ backgroundColor: currentColor }}
            onClick={handleAddOrUpdateSection}
            className="text-white px-4 py-2 rounded flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin mr-2" size={20} />
            ) : editingSectionId ? (
              "Update Section"
            ) : (
              "Add Section"
            )}
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border">Title</th>
            <th className="py-2 px-4 border">Description</th>
            <th className="py-2 px-4 border">Video</th>
            <th className="py-2 px-4 border">Time Duration</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => (
            <tr key={section._id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border">{section?.title}</td>
              <td className="py-2 px-4 border">{section?.description}</td>
              <td className="py-2 px-4 border">
                {section.videoUrl ? (
                  <video
                    src={section.videoUrl}
                    preload="metadata"
                    controls
                    className="w-32 h-20 object-cover rounded"
                  />
                ) : (
                  "No Video"
                )}
              </td>
              <td className="py-2 px-4 border">{section.timeDuration} sec</td>
              <td className="py-2 px-4 flex justify-center items-center border space-x-2">
                <button
                  onClick={() => handleEdit(section)}
                  className="text-yellow-500"
                >
                  <AiOutlineEdit size={25} />
                </button>
                <button
                  onClick={() => handleDeleteSection(section._id)}
                  className="text-red-500"
                >
                  <AiOutlineDelete size={25} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseSections;
