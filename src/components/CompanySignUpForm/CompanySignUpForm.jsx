import React, { useState } from 'react';
import './CompanySignUpForm.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const CompanySignUpForm = ({ onClose, captchaToken, setCaptchaToken, captchaRef }) => {
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
  const [step, setStep] = useState(1);

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

  const handleNext = () => {
    if (step === 1 && (!formData.username || !formData.email || !formData.password)) {
      toast.error("Please fill all fields before continuing");
      return;
    }
    if (step === 2 && (!formData.category || !formData.founded)) {
      toast.error("Please complete company details");
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      toast.error("Please verify the reCAPTCHA first!");
      return;
    }

    setLoading(true);

    try {
      // 🔹 On envoie le formulaire au backend pour créer l'entreprise
      const res = await axios.post("http://localhost:7001/api/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "company",
        captchaToken,
        companyInfo: {
          category: formData.category,
          founded: formData.founded,
          size: formData.size,
          location: formData.location, // Adresse
        },
      });

      // ✅ backend doit calculer lat/lng via LocationIQ et sauvegarder dans companyInfo.coordinates
      toast.success(res.data.message || "✅ Registration successful!");
      setFormData({
        username: "",
        email: "",
        password: "",
        category: "",
        founded: "",
        size: "",
        location: "",
      });
      if (captchaRef?.current) captchaRef.current.reset();
      setCaptchaToken("");
      onClose({ success: true, role: "company" });

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="csf-form" onSubmit={handleSubmit}>
      {/* Step 1 */}
      {step === 1 && (
        <>
          <input type="text" name="username" placeholder="Company Name" value={formData.username} onChange={handleChange} required className="csf-input"/>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="csf-input"/>
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="csf-input"/>
          <div className="csf-buttons">
            <button type="button" onClick={handleNext} className="csf-btn-primary">Next</button>
          </div>
        </>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <>
          <select name="category" value={formData.category} onChange={handleChange} required className="csf-input">
            <option value="">Select category</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <input type="number" name="founded" placeholder="Founded Year" value={formData.founded} onChange={handleChange} required className="csf-input"/>
          <div className="csf-buttons">
            <button type="button" onClick={handleBack} className="csf-btn-outline">Back</button>
            <button type="button" onClick={handleNext} className="csf-btn-primary">Next</button>
          </div>
        </>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <>
          <input type="text" name="size" placeholder="Company Size" value={formData.size} onChange={handleChange} required className="csf-input"/>
          <input type="text" name="location" placeholder="Address (ex: 123 Main St, City, Country)" value={formData.location} onChange={handleChange} required className="csf-input"/>
          <div className="csf-buttons">
            <button type="button" onClick={handleBack} className="csf-btn-outline">Back</button>
            <button type="submit" disabled={loading} className="csf-btn-primary">{loading ? "Registering..." : "Sign Up"}</button>
          </div>
        </>
      )}
    </form>
  );
};

export default CompanySignUpForm;
