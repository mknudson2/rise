// frontend/src/components/auth/UserManagement.jsx - FIXED VERSION
import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Mail,
  Shield,
} from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "admin",
    password: "",
  });

  const API_BASE = import.meta.env.PROD
    ? "https://your-production-api.com/api"
    : "http://localhost:3001/api";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("cms-token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/auth/users`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const url = editingUser
        ? `${API_BASE}/auth/users/${editingUser.id}`
        : `${API_BASE}/auth/users`;

      const method = editingUser ? "PUT" : "POST";

      const body = editingUser
        ? { ...formData, password: formData.password || undefined }
        : formData;

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Operation failed");
      }

      setSuccess(
        editingUser ? "User updated successfully" : "User created successfully"
      );
      resetForm();
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (
      !confirm(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/auth/users/${userId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete user");
      }

      setSuccess("User deleted successfully");
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    });
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", role: "admin", password: "" });
    setEditingUser(null);
    setShowCreateForm(false);
    setShowPassword(false);
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let result = "";
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password: result });
  };

  return (
    // FIXED: Explicit styling to override inherited styles
    <div className="space-y-6" style={{ color: "#1f2937" }}>
      <div
        className="bg-white rounded-lg shadow-md p-6"
        style={{ color: "#1f2937" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center text-gray-900">
            <Users className="mr-2 h-5 w-5" />
            User Management
          </h3>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-red-500 to-yellow-400 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-yellow-500 transition-all flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create User</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        {/* Create/Edit User Form */}
        {showCreateForm && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="font-medium mb-4 text-gray-900">
              {editingUser ? "Edit User" : "Create New User"}
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                    disabled={loading}
                    style={{ color: "#1f2937" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                    disabled={loading || editingUser}
                    style={{ color: "#1f2937" }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                  disabled={loading}
                  style={{ color: "#1f2937" }}
                >
                  <option value="admin">Admin</option>
                  <option value="super">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Password {editingUser && "(leave blank to keep current)"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md pr-20 text-gray-900 bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required={!editingUser}
                    disabled={loading}
                    placeholder={
                      editingUser
                        ? "Enter new password (optional)"
                        : "Enter password"
                    }
                    style={{ color: "#1f2937" }}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="text-blue-500 hover:text-blue-700 p-1 text-xs"
                      title="Generate password"
                    >
                      Gen
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-red-500 to-yellow-400 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-yellow-500 transition-all disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : editingUser
                    ? "Update User"
                    : "Create User"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users List */}
        {loading && !showCreateForm ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-gray-900">Name</th>
                  <th className="text-left py-2 px-3 text-gray-900">Email</th>
                  <th className="text-left py-2 px-3 text-gray-900">Role</th>
                  <th className="text-left py-2 px-3 text-gray-900">Status</th>
                  <th className="text-left py-2 px-3 text-gray-900">
                    Last Login
                  </th>
                  <th className="text-left py-2 px-3 text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-3 font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="py-3 px-3 text-gray-600">{user.email}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "super"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role === "super" ? "Super Admin" : "Admin"}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-600 text-sm">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit user"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
