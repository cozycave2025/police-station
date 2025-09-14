"use client";
import { useState } from "react";
import Header from "../../components/header";

export default function AdminRegister() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    adminId: "",
    designation: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: "Passwords do not match!", type: "error" });
      return;
    }

    const existingAdmins = JSON.parse(localStorage.getItem("admins") || "[]");
    const adminExists = existingAdmins.find(
      (a) => a.email === formData.email || a.adminId === formData.adminId
    );

    if (adminExists) {
      setMessage({
        text: "Admin with this info already exists!",
        type: "error",
      });
      return;
    }

    let newAdmin = {
      id: Date.now().toString(),
      role: "admin",
      ...formData,
      createdAt: new Date().toISOString(),
    };

    existingAdmins.push(newAdmin);
    localStorage.setItem("admins", JSON.stringify(existingAdmins));

    setMessage({
      text: "Admin registration successful! Redirecting...",
      type: "success",
    });

    setFormData({
      fullName: "",
      email: "",
      phone: "",
      adminId: "",
      designation: "",
      city: "",
      password: "",
      confirmPassword: "",
    });

    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  };

  return (
    <>
      <Header />
      <br />
      <br />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-blue-600 drop-shadow-sm mb-6">
            Admin Registration
          </h2>

          {message.text && (
            <div
              className={`mb-4 p-3 rounded-lg text-center ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {[
              { label: "Full Name", name: "fullName", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Phone", name: "phone", type: "tel" },
              { label: "Admin ID", name: "adminId", type: "text" },
              { label: "Designation", name: "designation", type: "text", placeholder: "Super Admin / Manager" },
              { label: "City", name: "city", type: "text" },
            ].map((field, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder || ""}
                  required={["fullName", "email", "adminId"].includes(field.name)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Register Admin
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
