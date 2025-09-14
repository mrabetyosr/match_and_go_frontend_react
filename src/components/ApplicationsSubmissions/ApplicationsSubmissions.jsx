import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, MapPin, Phone, Mail, Calendar, FileText, Github, Linkedin, 
  Clock, CheckCircle, XCircle, ArrowLeft, UserCheck, 
  BarChart3, Eye, Filter, Download, Search, Users,
  Calendar as CalendarIcon, Star, Target
} from 'lucide-react';
import { toast } from 'react-toastify';
import './ApplicationsSubmissions.css';
import ScheduleInterviewModal from '../ScheduleInterviewModal/ScheduleInterviewModal';
import ApplicationStats from '../ApplicationStats/ApplicationStats.jsx';

// Sub-components
const LoadingSpinner = () => (
  <div className="loading-container-one">
    <div className="loading-spinner-one"></div>
    <div className="loading-text-one">
      <h3>Loading Applications</h3>
      <p>Fetching candidate data...</p>
    </div>
  </div>
);

const ErrorMessage = ({ error, onGoBack }) => (
  <div className="error-container-one">
    <div className="error-icon-one">⚠️</div>
    <h3>Something went wrong</h3>
    <p>Error: {error}</p>
    <button onClick={onGoBack} className="btn-primary-one">Go Back</button>
  </div>
);

const PageHeader = ({ offerTitle, onGoBack, onExport }) => (
  <div className="page-header-one">
    <div className="header-left-one">
      <button onClick={onGoBack} className="back-btn-one">
        <ArrowLeft size={20} />
        Back
      </button>
      <div className="header-info-one">
        <h1 className="page-title-one">
          <Target size={24} />
          {offerTitle}
        </h1>
        <p className="page-subtitle-one">Manage applications and track hiring progress</p>
      </div>
    </div>
    <button onClick={onExport} className="export-btn-one">
      <Download size={18} />
      Export Data
    </button>
  </div>
);

const SearchAndFilters = ({ 
  searchTerm, 
  onSearchChange, 
  filterStatus, 
  onStatusChange, 
  dateRange, 
  onDateChange,
  viewMode,
  onViewModeChange,
  stats,
  resultCount,
  totalCount,
  onClearFilters,
  hasActiveFilters
}) => (
  <div className="controls-section-one">
    <div className="search-filter-row-one">
      <div className="search-box-one">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search candidates..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-controls-one">
        <select value={filterStatus} onChange={(e) => onStatusChange(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending ({stats.pending})</option>
          <option value="interview_scheduled">Interview ({stats.interviewed})</option>
          <option value="accepted">Accepted ({stats.accepted})</option>
          <option value="rejected">Rejected ({stats.rejected})</option>
        </select>

        <select value={dateRange} onChange={(e) => onDateChange(e.target.value)}>
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        <div className="view-toggle-one">
          <button 
            className={viewMode === 'cards' ? 'active-one' : ''}
            onClick={() => onViewModeChange('cards')}
          >
            <div className="grid-icon-one"></div>
          </button>
          <button 
            className={viewMode === 'list' ? 'active-one' : ''}
            onClick={() => onViewModeChange('list')}
          >
            <BarChart3 size={16} />
          </button>
        </div>
      </div>
    </div>

    <div className="results-info-one">
      <span>{resultCount} of {totalCount} applications</span>
      {hasActiveFilters && (
        <button onClick={onClearFilters} className="clear-filters-one">
          Clear filters
        </button>
      )}
    </div>
  </div>
);

const ApplicationCard = ({ application, onStatusUpdate, updatingStatus, getTimeAgo }) => {
  const getStatusConfig = (status) => {
    const configs = {
      accepted: { color: 'accepted-one', icon: CheckCircle, text: 'Accepted' },
      rejected: { color: 'rejected-one', icon: XCircle, text: 'Rejected' },
      interview_scheduled: { color: 'interview-one', icon: UserCheck, text: 'Interview Scheduled' },
      pending: { color: 'pending-one', icon: Clock, text: 'Pending' }
    };
    return configs[status] || configs.pending;
  };

  const getAvailableActions = (status) => {
    const actions = {
      pending: [
        { action: 'interview_scheduled', label: 'Schedule Interview', icon: UserCheck, className: 'interview-btn-one' },
        { action: 'rejected', label: 'Reject', icon: XCircle, className: 'reject-btn-one' }
      ],
      interview_scheduled: [
        { action: 'accepted', label: 'Accept', icon: CheckCircle, className: 'accept-btn-one' },
        { action: 'rejected', label: 'Reject', icon: XCircle, className: 'reject-btn-one' }
      ]
    };
    return actions[status] || [];
  };

  const statusConfig = getStatusConfig(application.status);
  const StatusIcon = statusConfig.icon;
  const availableActions = getAvailableActions(application.status);
  const isUpdating = updatingStatus.has(application._id);

  return (
    <div className="application-card-one">
      <div className="card-header-one">
        <div className="candidate-info-one">
          <div className="candidate-avatar-one">
            <User size={20} />
          </div>
          <div className="candidate-details-one">
            <h3>{application.candidateId?.username || 'Unknown Candidate'}</h3>
            <div className="candidate-email-one">
              <Mail size={14} />
              <span>{application.email}</span>
            </div>
            <div className="application-time-one">
              Applied {getTimeAgo(application.createdAt)}
            </div>
          </div>
        </div>
        
        <div className={`status-badge-one ${statusConfig.color}`}>
          <StatusIcon size={16} />
          <span>{statusConfig.text}</span>
        </div>
      </div>

      <div className="card-body-one">
        <div className="contact-grid-one">
          {application.phoneNumber && (
            <div className="contact-item-one">
              <Phone size={14} />
              <span>{application.phoneNumber}</span>
            </div>
          )}
          {application.location && (
            <div className="contact-item-one">
              <MapPin size={14} />
              <span>{application.location}</span>
            </div>
          )}
        </div>

        <div className="documents-section-one">
          <div className="documents-grid-one">
            {application.cv && (
              <a href={`http://localhost:7001/images/${application.cv}`} target="_blank" rel="noopener noreferrer" className="doc-link-one">
                <FileText size={16} />
                <span>CV</span>
              </a>
            )}
            {application.motivationLetter && (
              <a href={`http://localhost:7001/images/${application.motivationLetter}`} target="_blank" rel="noopener noreferrer" className="doc-link-one">
                <FileText size={16} />
                <span>Cover Letter</span>
              </a>
            )}
            {application.linkedin && (
              <a href={application.linkedin} target="_blank" rel="noopener noreferrer" className="social-link-one">
                <Linkedin size={16} />
                <span>LinkedIn</span>
              </a>
            )}
            {application.github && (
              <a href={application.github} target="_blank" rel="noopener noreferrer" className="social-link-one">
                <Github size={16} />
                <span>GitHub</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {availableActions.length > 0 && (
        <div className="card-footer-one">
          <div className="action-buttons-one">
            {availableActions.map(({ action, label, icon: Icon, className }) => (
              <button
                key={action}
                onClick={() => onStatusUpdate(application._id, action)}
                className={`action-btn-one ${className} ${isUpdating ? 'loading-one' : ''}`}
                disabled={isUpdating}
              >
                <Icon size={16} />
                <span>{isUpdating ? `${label.split(' ')[0]}ing...` : label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {availableActions.length === 0 && (
        <div className="card-footer-one">
          <div className={`final-status-one ${application.status}-one`}>
            <StatusIcon size={16} />
            <span>
              {application.status === 'accepted' ? 'Candidate Accepted ✨' : 'Application Rejected'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const EmptyState = ({ hasApplications, hasFilters }) => (
  <div className="empty-state-one">
    <div className="empty-icon-one">
      {hasApplications ? <Search size={48} /> : <Users size={48} />}
    </div>
    <h3>
      {hasApplications ? 'No results found' : 'No applications yet'}
    </h3>
    <p>
      {hasApplications 
        ? 'Try adjusting your filters to find what you\'re looking for.'
        : 'No candidates have applied to this offer yet.'
      }
    </p>
  </div>
);

// Main Component
const ApplicationsSubmissions = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(new Set());
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [offerTitle, setOfferTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [dateRange, setDateRange] = useState('all');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (offerId) {
      fetchApplications();
      fetchOfferDetails();
    }
  }, [offerId]);

  const fetchOfferDetails = async () => {
    try {
      const response = await fetch(`http://localhost:7001/api/offers/${offerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOfferTitle(data.jobTitle || 'Job Offer');
      }
    } catch (err) {
      console.error('Error fetching offer details:', err);
      setOfferTitle('Job Offer');
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch(`http://localhost:7001/api/applications/${offerId}/submissions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      const data = await response.json();
      setApplications(data.applications);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      toast.error('Failed to load applications');
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    if (updatingStatus.has(applicationId)) return;

    if (newStatus === 'interview_scheduled') {
      const application = applications.find(app => app._id === applicationId);
      setSelectedApplication(application);
      setScheduleModalOpen(true);
      return;
    }

    setUpdatingStatus(prev => new Set(prev).add(applicationId));

    try {
      const response = await fetch(`http://localhost:7001/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setApplications(prev => prev.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        ));
        toast.success(`Application ${newStatus.replace('_', ' ')} successfully!`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update application status');
      console.error('Error updating status:', err);
    } finally {
      setUpdatingStatus(prev => {
        const newSet = new Set(prev);
        newSet.delete(applicationId);
        return newSet;
      });
    }
  };

  const handleInterviewScheduled = (applicationId) => {
    setApplications(prev => prev.map(app => 
      app._id === applicationId ? { ...app, status: 'interview_scheduled' } : app
    ));
    setScheduleModalOpen(false);
    setSelectedApplication(null);
  };

  const exportToCSV = () => {
    const csvData = applications.map(app => ({
      Name: app.candidateId?.username || 'Unknown',
      Email: app.email,
      Phone: app.phoneNumber || 'N/A',
      Location: app.location || 'N/A',
      Status: app.status,
      'Applied Date': new Date(app.createdAt).toLocaleDateString()
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications_${offerTitle.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor((now - past) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  // Statistics and filtering
  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    interviewed: applications.filter(app => app.status === 'interview_scheduled').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = app.candidateId?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesDate = true;
    if (dateRange !== 'all') {
      const appDate = new Date(app.createdAt);
      const now = new Date();
      
      switch (dateRange) {
        case 'today':
          matchesDate = appDate.toDateString() === now.toDateString();
          break;
        case 'week':
          matchesDate = appDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          matchesDate = appDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }
    }
    return matchesStatus && matchesSearch && matchesDate;
  });

  const hasActiveFilters = filterStatus !== 'all' || searchTerm || dateRange !== 'all';

  if (loading) {
    return (
      <div className="applications-page-one">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="applications-page-one">
        <ErrorMessage error={error} onGoBack={() => navigate(-1)} />
      </div>
    );
  }

  return (
    <div className="applications-page-one">
      <div className="applications-container-one">
        <PageHeader 
          offerTitle={offerTitle}
          onGoBack={() => navigate(-1)}
          onExport={exportToCSV}
        />

        <ApplicationStats applications={applications} />

        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onStatusChange={setFilterStatus}
          dateRange={dateRange}
          onDateChange={setDateRange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          stats={stats}
          resultCount={filteredApplications.length}
          totalCount={stats.total}
          onClearFilters={() => {
            setFilterStatus('all');
            setSearchTerm('');
            setDateRange('all');
          }}
          hasActiveFilters={hasActiveFilters}
        />

        <div className={`applications-list-one ${viewMode}-view-one`}>
          {filteredApplications.length === 0 ? (
            <EmptyState 
              hasApplications={applications.length > 0}
              hasFilters={hasActiveFilters}
            />
          ) : (
            filteredApplications.map((application) => (
              <ApplicationCard
                key={application._id}
                application={application}
                onStatusUpdate={updateApplicationStatus}
                updatingStatus={updatingStatus}
                getTimeAgo={getTimeAgo}
              />
            ))
          )}
        </div>

        {scheduleModalOpen && selectedApplication && (
          <ScheduleInterviewModal
            isOpen={scheduleModalOpen}
            onClose={() => {
              setScheduleModalOpen(false);
              setSelectedApplication(null);
            }}
            applicationId={selectedApplication._id}
            candidateName={selectedApplication.candidateId?.username || 'Unknown Candidate'}
            jobTitle={offerTitle}
            onInterviewScheduled={handleInterviewScheduled}
          />
        )}
      </div>
    </div>
  );
};

export default ApplicationsSubmissions;