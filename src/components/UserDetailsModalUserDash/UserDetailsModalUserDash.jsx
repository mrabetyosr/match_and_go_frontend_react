import React from 'react';
import './UserDetailsModalUserDash.css';

const UserDetailsModalUserDash = ({
  selectedUser,
  setSelectedUser,
  formatDate,
  getRoleColor,
  getStatusColor,
  updateUserStatus
}) => {
  if (!selectedUser) return null;

  return (
    <div className="modal-overlay-userdash" onClick={() => setSelectedUser(null)}>
      <div className="modal-content-userdash" onClick={e => e.stopPropagation()}>
        <div className="modal-header-userdash">
          <h2>User Details</h2>
          <button onClick={() => setSelectedUser(null)}>❌</button>
        </div>
        <div className="modal-body-userdash">
          <UserProfileUserDash selectedUser={selectedUser} getRoleColor={getRoleColor} />
          <UserDetailsGridUserDash selectedUser={selectedUser} formatDate={formatDate} getStatusColor={getStatusColor} />
          <ModalActionsUserDash selectedUser={selectedUser} updateUserStatus={updateUserStatus} />
        </div>
      </div>
    </div>
  );
};

const UserProfileUserDash = ({ selectedUser, getRoleColor }) => {
  return (
    <div className="user-profile-userdash">
      <img 
        src={`http://localhost:7001/images/${selectedUser.image_User}`} 
        alt={selectedUser.username}
        className="profile-image-userdash"
      />
      <div className="profile-info-userdash">
        <h3>{selectedUser.username}</h3>
        <p>{selectedUser.email}</p>
        <span className="role-badge-userdash" style={{ backgroundColor: getRoleColor(selectedUser.role) }}>
          {selectedUser.role}
        </span>
      </div>
    </div>
  );
};

const UserDetailsGridUserDash = ({ selectedUser, formatDate, getStatusColor }) => {
  return (
    <div className="user-details-grid-userdash">
      <div className="detail-item-userdash">
        <label>Status:</label>
        <span style={{ color: getStatusColor(selectedUser.isActive) }}>
          {selectedUser.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      <div className="detail-item-userdash">
        <label>Registration:</label>
        <span>{formatDate(selectedUser.createdAt)}</span>
      </div>
      <div className="detail-item-userdash">
        <label>Logins:</label>
        <span>{selectedUser.loginCount || 0}</span>
      </div>
      <div className="detail-item-userdash">
        <label>Rated App:</label>
        <span>{selectedUser.hasRatedApp ? 'Yes' : 'No'}</span>
      </div>

      {selectedUser.role === 'candidate' && selectedUser.candidateInfo && (
        <CandidateDetailsUserDash candidateInfo={selectedUser.candidateInfo} />
      )}

      {selectedUser.role === 'company' && selectedUser.companyInfo && (
        <CompanyDetailsUserDash companyInfo={selectedUser.companyInfo} />
      )}

      {selectedUser.planInfo && (
        <div className="detail-item-userdash">
          <label>Plan:</label>
          <span>{selectedUser.planInfo.planName || 'None'}</span>
        </div>
      )}
    </div>
  );
};

const CandidateDetailsUserDash = ({ candidateInfo }) => (
  <>
    <div className="detail-item-userdash">
      <label>Phone:</label>
      <span>{candidateInfo.phoneNumber || 'Not provided'}</span>
    </div>
    <div className="detail-item-userdash">
      <label>Location:</label>
      <span>{candidateInfo.location || 'Not provided'}</span>
    </div>
    <div className="detail-item-userdash">
      <label>Saved Jobs:</label>
      <span>{candidateInfo.savedJobs?.length || 0}</span>
    </div>
  </>
);

const CompanyDetailsUserDash = ({ companyInfo }) => (
  <>
    <div className="detail-item-userdash">
      <label>Category:</label>
      <span>{companyInfo.category || 'Not provided'}</span>
    </div>
    <div className="detail-item-userdash">
      <label>Size:</label>
      <span>{companyInfo.size || 'Not provided'}</span>
    </div>
    <div className="detail-item-userdash">
      <label>Website:</label>
      <span>{companyInfo.website || 'Not provided'}</span>
    </div>
    <div className="detail-item-userdash">
      <label>Founded:</label>
      <span>{companyInfo.founded || 'Not provided'}</span>
    </div>
  </>
);

const ModalActionsUserDash = ({ selectedUser, updateUserStatus }) => {
  return (
    <div className="modal-actions-userdash">
      <button 
        onClick={() => updateUserStatus(selectedUser._id, !selectedUser.isActive)}
        className={selectedUser.isActive ? 'btn-deactivate-userdash' : 'btn-activate-userdash'}
      >
        {selectedUser.isActive ? 'Deactivate' : 'Activate'}
      </button>
    </div>
  );
};

export default UserDetailsModalUserDash;