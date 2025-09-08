// FullApplication.jsx
import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { toast } from "react-toastify";

const FullApplication = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You need to login");
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.role === "company" && !location.pathname.startsWith("/applications/company")) {
        navigate("/applications/company");
      } else if (decoded.role === "candidate" && !location.pathname.startsWith("/applications/user")) {
        navigate("/applications/user");
      } else if (!["company", "candidate"].includes(decoded.role)) {
        toast.error("Unauthorized access");
        navigate("/");
      }
    } catch (err) {
      toast.error("Invalid token, please login again");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate, location]);

  return <Outlet />;
};

export default FullApplication;
