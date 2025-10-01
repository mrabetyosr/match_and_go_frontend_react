import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GeneralDashboardScheduledMeetings.css";

const GeneralDashboardScheduledMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 2;

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:7001/api/dashboard/meetings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Sort meetings: newest first
        const sortedMeetings = res.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setMeetings(sortedMeetings);
      } catch (err) {
        console.error("Error fetching meetings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:7001/api/dashboard/meetings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeetings(meetings.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Error deleting meeting:", err);
    }
  };

  if (loading) return null;
  if (meetings.length === 0) return null;

  const totalPages = Math.ceil(meetings.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMeetings = meetings.slice(startIndex, endIndex);

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const now = new Date();

  return (
    <div className="gd-card">
      <h2 className="gd-card-title">Scheduled Meetings</h2>

      <div className="gd-timeline">
        {currentMeetings.map((meeting) => {
          const meetingDate = new Date(meeting.date);
          const isUpcoming = meetingDate > now;

          return (
            <div key={meeting._id} className="gd-timeline-item">

              {/* Date */}
              <div className="gd-meeting-date">
                {meetingDate.toLocaleString()} {isUpcoming && <span className="gd-badge-new">New</span>}
                {!isUpcoming && <span style={{ color: "red", fontWeight: "bold" }}>Meeting passed</span>}
              </div>

              {/* Users */}
              <div className="gd-meeting-body">
                {/* Candidate */}
                <div className="gd-profile">
                  <img
                    src={meeting.applicationId?.candidateId?.image_User
                      ? `http://localhost:7001/images/${meeting.applicationId.candidateId.image_User}`
                      : "https://via.placeholder.com/80"}
                    alt={meeting.applicationId?.candidateId?.username}
                    className="gd-profile-logo"
                  />
                  <div className="gd-profile-name">{meeting.applicationId?.candidateId?.username}</div>
                  <div className="gd-profile-email">{meeting.applicationId?.candidateId?.email}</div>
                </div>

                {/* Company */}
                <div className="gd-profile">
                  <img
                    src={meeting.applicationId?.offerId?.companyId?.image_User
                      ? `http://localhost:7001/images/${meeting.applicationId.offerId.companyId.image_User}`
                      : "https://via.placeholder.com/80"}
                    alt={meeting.applicationId?.offerId?.companyId?.username}
                    className="gd-profile-logo"
                  />
                  <div className="gd-profile-name">{meeting.applicationId?.offerId?.companyId?.username}</div>
                  <div className="gd-profile-email">{meeting.applicationId?.offerId?.companyId?.email}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="gd-meeting-actions">
                {isUpcoming && (
                  <a
                    href={meeting.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gd-btn gd-join-btn"
                  >
                    Join
                  </a>
                )}
                <button
                  onClick={() => handleDelete(meeting._id)}
                  className="gd-btn gd-delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="gd-pagination">
          <button onClick={handlePrev} disabled={currentPage === 0} className="gd-pagination-btn">
            ← Previous
          </button>
          <div className="gd-pagination-info">
            Page {currentPage + 1} / {totalPages}
          </div>
          <button onClick={handleNext} disabled={currentPage === totalPages - 1} className="gd-pagination-btn">
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default GeneralDashboardScheduledMeetings;
