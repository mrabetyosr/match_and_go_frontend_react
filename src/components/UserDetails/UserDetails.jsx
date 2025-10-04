import React from 'react';
import './UserDetails.css';
import DetailsCompanyDash from "../../components/DetailsCompanyDash/DetailsCompanyDash";
import DetailsCandidateDash from "../../components/DetailsCandidateDash/DetailsCandidateDash";

const UserDetails = () => {
  return (
    <div className="user-details-container">
      {/* Companies Section - Avant les candidats */}
      <DetailsCompanyDash />
      
      {/* Candidates Section */}
      <DetailsCandidateDash />
    </div>
  );
}

export default UserDetails;