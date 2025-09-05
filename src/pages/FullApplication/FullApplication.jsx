import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const FullApplication = () => {
const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You need to login");
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.role === "company") {
        navigate("/applications/company");
      } else if (decoded.role === "candidate") {
        navigate("/applications/user");
      } else {
        toast.error("Unauthorized access");
        navigate("/");
      }
    } catch (err) {
      toast.error("Invalid token, please login again");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default FullApplication;

