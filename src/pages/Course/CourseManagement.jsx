import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Header } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";
import axios from "axios";
import CourseDisplay from "../../components/CourseDisplay";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CourseManagement = () => {
  const navigate = useNavigate();
  const { currentColor } = useStateContext();
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("Draft");
  const [editCourse, setEditCourse] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch courses with optimization
  const fetchCourses = useCallback(async () => {
    try {
      toast.dismiss();
      const response = await axios.get(
        "http://3.223.253.106:3210/api/course/get-all-courses"
      );
      const fetchedCourses = response.data.data;
      // Update state only if the fetched courses are different
      if (JSON.stringify(fetchedCourses) !== JSON.stringify(courses)) {
        setCourses(fetchedCourses);
      }
      toast.success(response.data.message||"Courses fetched Successfully")
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses.");
    }
  }, [courses]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // OnSubmit handler
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let response;
      if (editCourse) {
        response = await axios.patch(
          `http://3.223.253.106:3210/api/course/update-course/${editCourse._id}`,
          {
            ...data,
            status,
          },
          config
        );
        toast.success("Course updated successfully");
      } else {
        response = await axios.post(
          "http://3.223.253.106:3210/api/course/create-course",
          {
            ...data,
            status,
          },
          config
        );
        toast.success("Course created successfully");
      }

      if (response.data.success) {
        reset();
        setIsModalOpen(false);
        fetchCourses();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("Failed to save course.");
    }
  };

  // Handle course status update
  const handleStatusUpdate = useCallback(
    async (id, courseStatus) => {
      try {
        const res = await axios.patch(
          `http://3.223.253.106:3210/api/course/update-course-status/${id}`,
          { courseStatus }
        );
        toast.success(`Course ${id} status updated to ${courseStatus}`);
        fetchCourses();
      } catch (error) {
        console.error("Error updating course status:", error);
        toast.error("Failed to update course status.");
      }
    },
    [fetchCourses]
  );
  const handleDeletCourse = async (courseId) => {
    console.log(courseId)
    try {
      await axios.delete(
        `http://3.223.253.106:3210/api/course/delete-course/${courseId}`
      );
      setCourses(courses.filter((course) => course._id !== courseId));
      toast.success("Section Deleted Successfully");
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  // Handle editing a course
  const onEdit = useCallback(
    (course) => {
      setEditCourse(course);
      setIsModalOpen(true);
      reset(course);
      toast.success("Course is in edit mode.");
    },
    [reset]
  );

  // Handle view sections
  const handleViewSections = (course) => {
    navigate(`/courses/${course._id}/sections`);
  };

  // Delete a course
  const onDelete = useCallback(
    async (courseId) => {
      try {
        await axios.delete(`http://3.223.253.106:3210/api/course/${courseId}`);
        toast.success("Course deleted successfully");
        fetchCourses();
      } catch (error) {
        console.error("Error deleting course:", error);
        toast.error("Failed to delete course.");
      }
    },
    [fetchCourses]
  );

  // Handle modal close
  const handleModalFalse = () => {
    reset({ courseName: "", courseDescription: "" });
    setIsModalOpen(false);
    setEditCourse(null);
    toast.success("Modal closed successfully.");
  };

  return (
    <div className="m-2 md:m-2 p-4 relative md:p-10 bg-gray-200 md:rounded-3xl rounded-xl">
      <div className="flex my-2 justify-between">
        <Header category="Page" title="Courses" />
        <button
          onClick={() => {
            setIsModalOpen(true);
            toast.info("Creating a new course.");
          }}
          style={{ backgroundColor: currentColor }}
          className="mb-1 text-white px-2 rounded hover:opacity-80"
        >
          Create Course
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Course List</h2>
        {courses.length === 0 ? (
          <p>No courses available.</p>
        ) : (
          <CourseDisplay
            courses={courses}
            onEdit={onEdit}
            onUpdateStatus={handleStatusUpdate}
            onDelete={handleDeletCourse}
            onViewSections={handleViewSections}
          />
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
            <h2 className="text-xl font-bold mb-4">
              {editCourse ? "Edit Course" : "Create Course"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Course Name</label>
                <input
                  {...register("courseName", {
                    required: "Course name is required",
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.courseName && (
                  <p className="text-red-500 text-sm">
                    {errors.courseName.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-semibold">
                  Course Description
                </label>
                <textarea
                  {...register("courseDescription", {
                    required: "Course description is required",
                  })}
                  className="w-full p-2 border rounded"
                ></textarea>
                {errors.courseDescription && (
                  <p className="text-red-500 text-sm">
                    {errors.courseDescription.message}
                  </p>
                )}
              </div>

              <div className="mb-4 flex items-center justify-between">
                <label className="block mb-1 font-semibold">Status</label>
                <div className="flex items-center">
                  <span className="mr-4">{status}</span>
                  <label
                    htmlFor="toggle-status"
                    className="flex items-center cursor-pointer"
                  >
                    <div className="relative">
                      <input
                        id="toggle-status"
                        type="checkbox"
                        checked={status === "Published"}
                        onChange={() =>
                          setStatus(status === "Draft" ? "Published" : "Draft")
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-16 h-8 rounded-full transition-colors duration-300 ${
                          status === "Published"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                        style={{
                          backgroundColor:
                            status === "Published" ? currentColor : "gray",
                        }}
                      >
                        <div
                          className={`w-8 h-8 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                            status === "Published"
                              ? "translate-x-8"
                              : "translate-x-0"
                          }`}
                          style={{
                            transform:
                              status === "Published"
                                ? "translateX(100%)"
                                : "translateX(0)",
                          }}
                        />
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleModalFalse}
                  className="bg-gray-500 text-white p-2 rounded mr-2 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  style={{ backgroundColor: currentColor }}
                  type="submit"
                  className="text-white p-2 rounded hover:bg-blue-600"
                >
                  {editCourse ? "Update Course" : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
