import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Header } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AlphabetTable from "../../components/AlphabetsTable";

const AlphabetsManagement = () => {
  const navigate = useNavigate();
  const { currentColor } = useStateContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alphabets, setAlphabets] = useState([]); // Initialized as an array
  const [editAlphabet, setEditAlphabet] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch Alphabets from the backend
  const fetchAlphabets = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://3.223.253.106:3210/api/alphabet/get-all-alphabet"
      );
      console.log(response)
      setAlphabets(response?.data?.data);
    } catch (error) {
      console.error("Error fetching alphabets:", error);
      toast.error("Failed to fetch alphabets.");
    }
  }, []);

  useEffect(() => {
    fetchAlphabets();
  }, [fetchAlphabets]);

  // Form submit handler that supports both creation and editing
  const onSubmit = async (data) => {
    console.log("Form Data Submitted:", data);
    try {
      setLoading(true);
      const formData = new FormData();
  
      formData.append("alphabet", data.alphabet);
      formData.append("description", data.description);
      formData.append("relatedTerms", JSON.stringify(data.relatedTerms)); // Convert array to string
      formData.append("examples", JSON.stringify(data.examples)); // Convert array to string
  
      if (data.image && Array.isArray(data.image) && data.image.length > 0) {
        formData.append("files", data.image[0]);
      }
  
      // Log FormData before sending
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
  
      let res;
      if (editAlphabet) {
        res = await axios.patch(
          `http://3.223.253.106:3210/api/alphabet/update-alphabet/${editAlphabet._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success(res.data.message || "Alphabet updated successfully");
      } else {
        res = await axios.post(
          "http://3.223.253.106:3210/api/alphabet/create-alphabet",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success(res.data.message || "Alphabet created successfully");
      }
  
      fetchAlphabets();
      setEditAlphabet(null);
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error("Error creating/updating alphabet:", error);
      toast.error("Failed to save alphabet.");
    } finally {
      setLoading(false);
    }
  };
  

  // Open modal for creating new alphabet
  const handleAddAlphabet = () => {
    setEditAlphabet(null);
    reset({ alphabet: "", description: "", relatedTerms: "", examples: "" });
    setIsModalOpen(true);
    toast.info("Creating a new alphabet.");
  };

  // Open modal for editing an alphabet
  const handleEditAlphabet = (alphabetData) => {
    setEditAlphabet(alphabetData);
    // Pre-fill the form with existing data.
    // You may want to convert arrays to comma-separated strings if needed.
    reset({
      alphabet: alphabetData.alphabet,
      description: alphabetData.description,
      relatedTerms: alphabetData.relatedTerms, // Adjust if necessary
      examples: alphabetData.examples, // Adjust if necessary
    });
    setIsModalOpen(true);
  };

  // Close modal and reset form
  const handleModalFalse = () => {
    reset();
    setEditAlphabet(null);
    setIsModalOpen(false);
  };

  return (
    <div className="m-2 md:m-2 p-4 relative md:p-10 bg-gray-200 md:rounded-3xl rounded-xl">
      <div className="flex my-2 justify-between">
        <Header category="Page" title="Alphabets" />
        <button
          onClick={handleAddAlphabet}
          style={{ backgroundColor: currentColor }}
          className="mb-1 text-white px-2 rounded hover:opacity-80"
        >
          Create Alphabet
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {alphabets?.length === 0 ? (
          <p>No Alphabets found</p>
        ) : (
          <AlphabetTable data={alphabets} handleEditAlphabet={handleEditAlphabet} />
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
            <h2 className="text-xl font-bold mb-4">
              {editAlphabet ? "Edit Alphabet" : "Create Alphabet"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Alphabet Input */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Alphabet</label>
                <input
                  {...register("alphabet", {
                    required: "Alphabet is required",
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.alphabet && (
                  <p className="text-red-500 text-sm">{errors.alphabet.message}</p>
                )}
              </div>
              {/* Description Input */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Description</label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className="w-full p-2 border rounded"
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description.message}</p>
                )}
              </div>
              {/* Related Terms Input */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Related Terms</label>
                <input
                  {...register("relatedTerms", {
                    required: "Related Terms are required",
                  })}
                  placeholder="Comma-separated values"
                  className="w-full p-2 border rounded"
                />
                {errors.relatedTerms && (
                  <p className="text-red-500 text-sm">{errors.relatedTerms.message}</p>
                )}
              </div>
              {/* Examples Input */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Examples</label>
                <input
                  {...register("examples", {
                    required: "Examples are required",
                  })}
                  placeholder="Comma-separated values"
                  className="w-full p-2 border rounded"
                />
                {errors.examples && (
                  <p className="text-red-500 text-sm">{errors.examples.message}</p>
                )}
              </div>
              {/* Image File Input */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Image File</label>
                <input
                  {...register("image", {
                    required: editAlphabet ? false : "Image file is required",
                  })}
                  type="file"
                  accept="image/*"
                  className="w-full p-2 border rounded"
                />
                {errors.image && (
                  <p className="text-red-500 text-sm">{errors.image.message}</p>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleModalFalse}
                  className="bg-gray-500 text-white p-2 rounded mr-2 hover:bg-gray-600"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  style={{ backgroundColor: currentColor }}
                  type="submit"
                  className="text-white p-2 rounded hover:bg-blue-600 flex items-center"
                  disabled={loading}
                >
                 
                  {loading?"Loading...":editAlphabet ? "Update Alphabet" :"Create Alphabet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlphabetsManagement;
