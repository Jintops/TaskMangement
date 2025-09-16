import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [editTask, setEditTask] = useState(null); // for editing task

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:3000/getAllTask", {
      withCredentials: true,
    });
    setTasks(res.data.data);
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
    fetchTasks();
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
              className="flex justify-between items-center bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition"
            >
              <span className="font-medium">
                {u.name} <span className="text-gray-400">({u.emailId})</span>
              </span>
              <div className="flex gap-2">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    setSelectedUser(u);
                    setShowForm(true);
                  }}
                >
                  ➕ Assign Task
                </button>
                <button
                  className="btn btn-sm btn-error"
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

      {/* Tasks List */}
      <div className="mt-10 bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">📋 Tasks</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks?.map((t) => (
            <div
              key={t._id}
              className="bg-gray-700 p-4 rounded-lg shadow hover:shadow-xl transition"
            >
              <h2 className="font-bold text-lg">{t.title}</h2>
              <p className="text-gray-300">{t.description}</p>
              <p className="mt-2">
                <span className="font-semibold">Status:</span>{" "}
                <span className="text-primary">{t.status}</span>
              </p>
              <p>
                <span className="font-semibold">Assigned To:</span>{" "}
                {t.assignedTo?.name || "Unknown"}
              </p>
              <p>
                <span className="font-semibold">Priority:</span>{" "}
                <span
                  className={
                    t.priority === "high"
                      ? "text-red-400"
                      : t.priority === "medium"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }
                >
                  {t.priority}
                </span>
              </p>

              <button
                className="btn btn-sm btn-warning mt-3"
                onClick={() => {
                  setEditTask(t);
                  setTitle(t.title);
                  setDescription(t.description);
                  setDueDate(t.dueDate?.split("T")[0] || "");
                  setPriority(t.priority);
                }}
              >
                ✏️ Edit Task
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
