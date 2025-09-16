import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:3000/getTask", {
        withCredentials: true,
      });
      setTasks(res.data.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
        console.log(taskId,newStatus)
      const res = await axios.patch(
        `http://localhost:3000/updateTaskStatus/${taskId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      // Update state after successful update
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: res.data.data.status } : task
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <p className="text-white">Loading tasks...</p>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      <div className="flex gap-4">
        {tasks.map((task) => (
          <div key={task._id} className="card bg-gray-800 p-4 shadow-md">
            <h2 className="font-bold text-lg">{task.title}</h2>
            <p className="text-gray-300">{task.description}</p>
            <p className="mt-2">Due: {new Date(task.dueDate).toDateString()}</p>
            <p className="mt-1">
              <span className="font-semibold">Status:</span>{" "}
              <span className="capitalize">{task.status}</span>
            </p>

            {/* Dropdown for status update */}
            <select
              className="select select-bordered mt-3 w-full text-white border"
              value={task.status}
              onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
            >
              <option value="pending">pending</option>
              <option value="inprogress">inprogress</option>
              <option value="completed">completed</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
