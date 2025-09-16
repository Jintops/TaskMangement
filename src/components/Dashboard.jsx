import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      const res = await axios.patch(
        `http://localhost:3000/updateTaskStatus/${taskId}`,
        { status: newStatus },
        { withCredentials: true }
      );

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
     <div className="flex gap-4 flex-wrap">
  {tasks.map((task) => {
    // Define background color based on priority
    let bgColor = "";
    switch (task.priority) {
      case "high":
        bgColor = "bg-red-600";
        break;
      case "medium":
        bgColor = "bg-yellow-600";
        break;
      case "low":
        bgColor = "bg-green-600";
        break;
      default:
        bgColor = "bg-gray-800";
    }

    return (
      <div
        key={task._id}
        className={`card ${bgColor} p-4 shadow-md cursor-pointer w-80`}
        onClick={() => navigate(`/taskDetails/${task._id}`)}
      >
        <h2 className="font-bold text-lg">{task.title}</h2>
        <p className="text-gray-300">{task.description}</p>
        <p className="mt-2">Due: {new Date(task.dueDate).toDateString()}</p>
        <p className="mt-1">
          <span className="font-semibold">Status:</span>{" "}
          <span className="capitalize">{task.status}</span>
        </p>

        <select
          className="select select-bordered mt-3 w-full text-white border"
          value={task.status}
          onClick={(e) => e.stopPropagation()} // prevents card click
          onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
        >
          <option value="pending">pending</option>
          <option value="inprogress">inprogress</option>
          <option value="completed">completed</option>
        </select>
      </div>
    );
  })}
</div>

    </div>
  );
};

export default Dashboard;
