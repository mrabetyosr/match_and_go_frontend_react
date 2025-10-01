import React from "react";
import GeneralDashboardStats from "../GeneralDashboardStats/GeneralDashboardStats";
import OffersStatsChartGeneralDash from "../OffersStatsChartGeneralDash/OffersStatsChartGeneralDash";
import OffersApplicantsGeneralDash from "../OffersApplicantsGeneralDash/OffersApplicantsGeneralDash";
import PostsStatsChart from "../PostsStatsChart/PostsStatsChart";
import GeneralDashboardScheduledMeetings from "../GeneralDashboardScheduledMeetings/GeneralDashboardScheduledMeetings";

import "./GeneralDashboard.css";

const GeneralDashboard = () => {
  return (
    <div className="gd-container">
      {/* Stats en haut */}
      <GeneralDashboardStats />

      {/* Graphiques côte à côte */}
      <div className="gd-charts">
        <div className="gd-left">
          <PostsStatsChart />
        </div>
        <div className="gd-right">
          <OffersStatsChartGeneralDash />
        </div>
      </div>

      {/* OffersApplicants et Meetings côte à côte en bas */}
      <div className="gd-bottom">
        <div className="gd-bottom-left">
          <OffersApplicantsGeneralDash />
        </div>
        <div className="gd-bottom-right">
          <GeneralDashboardScheduledMeetings />
        </div>
      </div>
    </div>
  );
};

export default GeneralDashboard;
