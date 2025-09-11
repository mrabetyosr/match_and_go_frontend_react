import React, { useEffect, useState } from "react";
import axios from "axios";
import './ViewCandidateCalender.css';

const ViewCandidateCalender = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          "http://localhost:7001/api/interviews/my-upcoming",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const sorted = (data.interviews || []).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setInterviews(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  if (loading) return <p className="vcc-loading">Loading upcoming interviews...</p>;
  if (!interviews.length) return <p className="vcc-no-interviews">No upcoming interviews.</p>;

  // Group interviews by date
  const groupedByDate = interviews.reduce((acc, interview) => {
    const dateKey = new Date(interview.date).toLocaleDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(interview);
    return acc;
  }, {});

  return (
    <div className="vcc-container">
      <h2 className="vcc-title">Upcoming Interviews</h2>
      {Object.keys(groupedByDate).map((date) => (
        <div key={date} className="vcc-date-group">
          <div className="vcc-date-header">
            <span className="vcc-date-dot"></span>
            <h3>{date}</h3>
          </div>
          <div className="vcc-interview-cards">
            {groupedByDate[date].map((i) => (
              <div key={i._id} className="vcc-interview-card">
                <div className="vcc-info">
                  <p className="vcc-time">
                    🕒 {new Date(i.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="vcc-job-title">💼 {i.jobTitle}</p>
                  <p className="vcc-company-name">🏢 {i.companyName}</p>
                </div>
                <a href={i.meetLink} target="_blank" rel="noreferrer" className="vcc-join-link">
                  Join Meeting
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewCandidateCalender;
