import React, { useState } from "react";
import "./ApplicationUser.css";
import ViewCandidateApplication from "../ViewCandidateApplication/ViewCandidateApplication";
import ViewCandidatePosts from "../ViewCandidatePosts/ViewCandidatePosts";
import ViewCandidateNotification from "../ViewCandidateNotification/ViewCandidateNotification";

const tabs = {
  applications: <ViewCandidateApplication />,
  posts: <ViewCandidatePosts />,
  notifications: <ViewCandidateNotification />,
};

const ApplicationUser = () => {
  const [activeTab, setActiveTab] = useState("applications");

  return (
    <div className="application-user">
      {/* Tab Buttons */}
      <div className="button-container">
        {Object.keys(tabs).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? "active" : ""}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="tab-content">{tabs[activeTab]}</div>
    </div>
  );
};

export default ApplicationUser;
