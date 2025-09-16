import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const tasksPerPage = 6; 
  const [editTask, setEditTask] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");

 const fetchTasks = async (page = 1) => {
  try {
    const res = await axios.get(`http://localhost:3000/getAllTask?page=${page}&limit=${tasksPerPage}`, {
      withCredentials: true,
    });

    setTasks(res.data.data);
    setCurrentPage(res.data.currentPage);
    setTotalPages(res.data.totalPages);
  } catch (err) {
    console.error(err);
  }
};


  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:3000/getAllUser", {
      withCredentials: true,
    });
    setUsers(res.data.data);
  };

  const handleAssignTask = async () => {
    if (!selectedUser) return;

    try {
      await axios.post(
        "http://localhost:3000/taskCreate",
        { title, description, dueDate, priority, assignedTo: selectedUser._id },
        { withCredentials: true }
      );

      resetForm();
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };
 const navigate=useNavigate()
  const handleEditTask = async () => {
    if (!editTask) return;

    try {
      await axios.put(
        `http://localhost:3000/editTask/${editTask._id}`,
        { title, description, dueDate, priority },
        { withCredentials: true }
      );

      resetForm();
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:3000/removeUser/${id}`, {
        withCredentials: true,
      });
      fetchUsers();
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask=async(id)=>{
       if (!window.confirm("⚠️ Are you sure you want to delete this task?"))
                return;
              try {
                await axios.delete(`http://localhost:3000/deleteTask/${id}`, {
                  withCredentials: true,
                });
                fetchTasks(); 
              } catch (err) {
                console.error("Error deleting task:", err);
              }
  }

  const resetForm = () => {
    setShowForm(false);
    setEditTask(null);
    setSelectedUser(null);
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
  };

  useEffect(() => {
    fetchTasks(1);
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-extrabold text-center mb-10">
        🛠️ Admin Dashboard
      </h1>

      {/* Users List */}
     <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
  <h2 className="text-2xl font-semibold mb-4">👥 Users</h2>
  <ul className="space-y-3">
    {users?.map((u) => (
      <li
        key={u._id}
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition gap-2"
      >
        <span className="font-medium">
          {u.name} <span className="text-gray-400">({u.emailId})</span>
        </span>

        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          <button
            className="btn btn-sm btn-primary flex-1 sm:flex-auto"
            onClick={() => {
              setSelectedUser(u);
              setShowForm(true);
            }}
          >
            ➕ Assign Task
          </button>
          <button
            className="btn btn-sm btn-error flex-1 sm:flex-auto"
            onClick={() => handleDeleteUser(u._id)}
          >
            🗑 Delete
          </button>
        </div>
      </li>
    ))}
  </ul>
</div>


      {/* Task Form (Assign or Edit) */}
      {(showForm || editTask) && (
        <div className="mt-8 bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">
            {editTask
              ? `✏️ Edit Task: ${editTask.title}`
              : `📌 Assign Task to ${selectedUser?.name}`}
          </h2>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Task Title"
              className="input input-bordered w-full bg-gray-700 text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              className="textarea textarea-bordered w-full bg-gray-700 text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="date"
              className="input input-bordered w-full bg-gray-700 text-white"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <select
              className="select select-bordered w-full bg-gray-700 text-white"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>high</option>
              <option>medium</option>
              <option>low</option>
            </select>

            <div className="flex justify-end gap-3 mt-4">
              <button className="btn btn-error" onClick={resetForm}>
                ❌ Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={editTask ? handleEditTask : handleAssignTask}
              >
                {editTask ? "💾 Update Task" : "✅ Save Task"}
              </button>
            </div>
          </div>
        </div>
      )}

 
<div className="mt-10 bg-gray-800 p-6 rounded-xl shadow-lg">
  <h2 className="text-2xl font-semibold mb-4">📋 Tasks</h2>
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {tasks?.map((t) => {
      // Determine background color based on priority
      let bgColor = "";
      switch (t.priority) {
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
          key={t._id}
          className={`${bgColor} p-4 rounded-lg shadow hover:shadow-xl transition cursor-pointer`}
          onClick={() => navigate(`/taskDetails/${t._id}`)}
        >
          <h2 className="font-bold text-lg">{t.title}</h2>
          <p className="mt-2">
            <span className="font-semibold">Status:</span>{" "}
            <span className="text-primary">{t.status}</span>
          </p>
          <p>
            <span className="font-semibold">Assigned To:</span>{" "}
            {t.assignedTo?.name || "Unknown"} ({t?.assignedTo?.emailId})
          </p>

          <p>
            <span className="font-semibold">Due Date:</span>{" "}
            {new Date(t.dueDate).toLocaleDateString()}
          </p>
          <div className="flex gap-2 mt-3">
            <button
              className="btn btn-sm btn-warning flex-1"
              onClick={(e) => {
                e.stopPropagation();
                setEditTask(t);
                setTitle(t.title);
                setDescription(t.description);
                setDueDate(t.dueDate?.split("T")[0] || "");
                setPriority(t.priority);
              }}
            >
              ✏️ Edit Task
            </button>

            <button
              className="btn btn-sm btn-error flex-1"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTask(t._id);
              }}
            >
              🗑 Delete Task
            </button>
          </div>
        </div>
      );
    })}
  </div>
</div>



<div className="flex justify-center gap-3 mt-6">
  <button
    className="btn btn-sm btn-primary"
    disabled={currentPage === 1}
    onClick={() => fetchTasks(currentPage - 1)}
  >
    ◀ Previous
  </button>

  <span className="flex items-center gap-2">
    Page {currentPage} of {totalPages}
  </span>

  <button
    className="btn btn-sm btn-primary"
    disabled={currentPage === totalPages}
    onClick={() => fetchTasks(currentPage + 1)}
  >
    Next ▶
  </button>
</div>

    </div>
  );
};

export default AdminDashboard;
