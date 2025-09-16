import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TaskDetails = () => {
  const [task, setTask] = useState(null);
  const { id } = useParams();

  const fetchTask = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/getOneTask/${id}`, {
        withCredentials: true,
      });
      setTask(res.data.data);
    } catch (err) {
      console.error("Error fetching task:", err);
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  if (!task) {
    return <div className="text-center text-white mt-10">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white px-4">
      <div className="max-w-lg w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">{task?.title}</h1>
        <p className="mb-3 text-gray-300">{task?.description}</p>

        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span className="capitalize">{task?.status}</span>
          </p>
          <p>
            <span className="font-semibold">Priority:</span>{" "}
            <span className="capitalize">{task?.priority}</span>
          </p>
           
          <p>
            <span className="font-semibold">Due Date:</span>{" "}
            {new Date(task?.dueDate).toLocaleDateString()}
          </p>

        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => window.history.back()}
            className="btn btn-sm btn-secondary"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
