import React from 'react';
import './CompanySignUpForm.css';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CompanySignUpForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    category: "",
    founded: "",
    size: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    "Tech",
    "Advertising&Marketing",
    "Culture&Media",
    "Consulting&Audit",
    "Education&Training",
    "Finance&Banking"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:7001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: "company",
          companyInfo: {
            category: formData.category,
            founded: formData.founded,
            size: formData.size,
            location: formData.location,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      toast.success(data.message || "✅ Registration successful!");
      onClose(true);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="signin-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Company Name"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <select name="category" value={formData.category} onChange={handleChange} required>
        <option value="">Select category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <input
        type="number"
        name="founded"
        placeholder="Founded Year"
        value={formData.founded}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="size"
        placeholder="Company Size"
        value={formData.size}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Sign Up"}
      </button>
    </form>
  );
};


export default CompanySignUpForm ;
