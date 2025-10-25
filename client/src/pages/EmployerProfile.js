// client/src/pages/EmployerProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './EmployerProfile.css'; // Ensure CSS is imported

const EmployerProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Define mandatory fields for the profile form - ADJUST AS NEEDED
  // ADDED the new fields here
  const mandatoryProfileFields = [
      'companyName',
      'hiringManagerFirstName',
      'hiringManagerLastName',
      'hiringManagerPhone', // Added
      'companyWebsite',     // Added
      'companyPhone',       // Added
      'companyAddress',
      'companyLocation',
      'organization',
      'department'
    ];

  const [formData, setFormData] = useState({
    // Initial registration fields (potentially read-only)
    companyName: '',
    hiringManagerFirstName: '',
    hiringManagerLastName: '',
    hiringManagerPhone: '',
    // Other profile fields
    address: '',
    companyWebsite: '',
    companyPhone: '',
    companyAddress: '',
    companyLocation: '',
    organization: '',
    costCenter: '',
    department: '',
    projectSponsors: [],
    preferredCommunicationMode: 'Email'
  });

  const [projects, setProjects] = useState([]);
  const [sponsorInput, setSponsorInput] = useState('');

  // Effect to load data when user object is available/changes
  useEffect(() => {
    // Check if the user object (which is the employer data) exists and is the correct type
    if (user && user.userType === 'employer') {
      console.log("Loading employer data into form:", user);
        setFormData({
            // Populate ALL fields from the user (employer) object
            companyName: user.companyName || '',
            hiringManagerFirstName: user.hiringManagerFirstName || '',
            hiringManagerLastName: user.hiringManagerLastName || '',
            hiringManagerPhone: user.hiringManagerPhone || '',
            address: user.address || '',
            companyWebsite: user.companyWebsite || '',
            companyPhone: user.companyPhone || '',
            companyAddress: user.companyAddress || '',
            companyLocation: user.companyLocation || '',
            organization: user.organization || '',
            costCenter: user.costCenter || '',
            department: user.department || '',
            projectSponsors: user.projectSponsors || [],
            preferredCommunicationMode: user.preferredCommunicationMode || 'Email'
        });
        setProjects(user.projects || []);
    } else {
        console.log("useEffect: No user or user is not an employer.", user);
    }
  }, [user]); // Re-run when the user object changes

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear message on change
    if (message.text) setMessage({ type: '', text: '' });
  };

  // Sponsor Add/Remove handlers
  const handleAddSponsor = () => {
    if (sponsorInput.trim() && !formData.projectSponsors.includes(sponsorInput.trim())) {
      setFormData({
        ...formData,
        projectSponsors: [...formData.projectSponsors, sponsorInput.trim()]
      });
      setSponsorInput('');
    }
  };

  const handleRemoveSponsor = (sponsorToRemove) => {
    setFormData({
      ...formData,
      projectSponsors: formData.projectSponsors.filter(s => s !== sponsorToRemove)
    });
  };

  // Project Add/Remove/Change handlers
  const handleAddProject = () => {
    setProjects([...projects, { projectName: '', teamSize: 0, teamMembers: [] }]);
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = projects.map((p, i) => i === index ? { ...p, [field]: value } : p);
    setProjects(updatedProjects);
  };

  const handleRemoveProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  // Team Member Add/Remove/Change handlers
  const handleAddTeamMember = (projectIndex) => {
    const updatedProjects = [...projects];
    // Ensure teamMembers array exists
    if (!updatedProjects[projectIndex].teamMembers) {
        updatedProjects[projectIndex].teamMembers = [];
    }
    updatedProjects[projectIndex].teamMembers.push({
      firstName: '', lastName: '', email: '', phone: '', role: ''
    });
    setProjects(updatedProjects);
  };

   const handleTeamMemberChange = (projectIndex, memberIndex, field, value) => {
    const updatedProjects = [...projects];
    // Defensive check
    if (updatedProjects[projectIndex] && updatedProjects[projectIndex].teamMembers && updatedProjects[projectIndex].teamMembers[memberIndex]) {
        updatedProjects[projectIndex].teamMembers[memberIndex][field] = value;
        setProjects(updatedProjects);
    }
  };

  const handleRemoveTeamMember = (projectIndex, memberIndex) => {
     const updatedProjects = [...projects];
     // Defensive check
     if (updatedProjects[projectIndex] && updatedProjects[projectIndex].teamMembers) {
        updatedProjects[projectIndex].teamMembers = updatedProjects[projectIndex].teamMembers.filter((_, i) => i !== memberIndex);
        setProjects(updatedProjects);
    }
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // --- Frontend Validation for Mandatory Profile Fields ---
    const emptyFields = mandatoryProfileFields.filter(field => !formData[field]?.trim());
    if (emptyFields.length > 0) {
        // Map field names to more readable labels
        const fieldLabels = {
            companyName: 'Company Name',
            hiringManagerFirstName: 'Hiring Manager First Name',
            hiringManagerLastName: 'Hiring Manager Last Name',
            hiringManagerPhone: 'Hiring Manager Phone', // Added
            companyWebsite: 'Company Website',         // Added
            companyPhone: 'Company Phone',             // Added
            companyAddress: 'Company Address',
            companyLocation: 'Company Location',
            organization: 'Organization',
            department: 'Department'
        };
        const readableEmptyFields = emptyFields.map(f => fieldLabels[f] || f);
        setMessage({ type: 'error', text: `Please fill in all required fields: ${readableEmptyFields.join(', ')}` });
        setLoading(false);
        const firstEmptyInput = document.querySelector(`[name="${emptyFields[0]}"]`);
        if (firstEmptyInput) firstEmptyInput.focus();
        return;
    }
    // --- End Validation ---

    const dataToSend = { ...formData, projects };

    try {
      console.log("Sending data to /api/profile/employer:", dataToSend);
      const response = await axios.put('/api/profile/employer', dataToSend);
      console.log("Response from server:", response.data);

      if (response.data && response.data.user) {
         updateUser(response.data.user); // Update context with the latest employer data
         setMessage({ type: 'success', text: response.data.message || 'Employer profile updated successfully!' });
      } else {
         setMessage({ type: 'success', text: 'Employer profile updated successfully! (Response format unexpected)' });
      }
    } catch (error) {
      console.error("Error updating employer profile:", error.response || error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile'
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Render Logic ---
  if (loading && !user) { // Show initial loading if needed
    return <div className="loading">Loading...</div>;
  }

  if (!user || user.userType !== 'employer') {
    // Should be handled by PrivateRoute, but as a fallback:
    return <div className="container"><p className="error">Access Denied. Please log in as an employer.</p></div>;
  }

  return (
    <div className="container">
      <div className="employer-profile-container">
        <h1>Employer Profile</h1>
        <p className="subtitle">Manage your company information and projects</p>

        <form onSubmit={handleSubmit}>

          {/* Account Info */}
          <div className="card">
              <h2>Account Information</h2>
              <div className="form-group">
                 <label>Company Name<span className="mandatory-star">*</span></label>
                 <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" required />
               </div>
              <div className="form-row">
                 <div className="form-group">
                   <label>Hiring Manager First Name<span className="mandatory-star">*</span></label>
                   <input type="text" name="hiringManagerFirstName" value={formData.hiringManagerFirstName} onChange={handleChange} placeholder="First Name" required />
                 </div>
                 <div className="form-group">
                   <label>Hiring Manager Last Name<span className="mandatory-star">*</span></label>
                   <input type="text" name="hiringManagerLastName" value={formData.hiringManagerLastName} onChange={handleChange} placeholder="Last Name" required />
                 </div>
              </div>
               <div className="form-group">
                  {/* --- ADDED STAR and required --- */}
                  <label>Hiring Manager Phone<span className="mandatory-star">*</span></label>
                  <input type="tel" name="hiringManagerPhone" value={formData.hiringManagerPhone} onChange={handleChange} placeholder="Phone" required />
               </div>
                <div className="form-group">
                   <label>Login Email</label>
                   <input type="email" value={user.email} placeholder="Login Email" readOnly disabled />
                </div>
          </div>

          {/* Company Information */}
          <div className="card">
            <h2>Company Information</h2>

            <div className="form-group">
              <label>Address</label> {/* General address - Assuming optional */}
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter primary address" />
            </div>

            <div className="form-row">
              <div className="form-group">
                {/* --- ADDED STAR and required --- */}
                <label>Company Website<span className="mandatory-star">*</span></label>
                <input type="url" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} placeholder="https://www.company.com" required />
              </div>
              <div className="form-group">
                {/* --- ADDED STAR and required --- */}
                <label>Company Phone<span className="mandatory-star">*</span></label>
                <input type="tel" name="companyPhone" value={formData.companyPhone} onChange={handleChange} placeholder="(123) 456-7890" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Company Address<span className="mandatory-star">*</span></label>
                <input type="text" name="companyAddress" value={formData.companyAddress} onChange={handleChange} placeholder="Street address" required />
              </div>
              <div className="form-group">
                <label>Company Location<span className="mandatory-star">*</span></label>
                <input type="text" name="companyLocation" value={formData.companyLocation} onChange={handleChange} placeholder="City, State, Country" required />
              </div>
            </div>
          </div>

          {/* Organization Details */}
          <div className="card">
            <h2>Organization Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Organization<span className="mandatory-star">*</span></label>
                <input type="text" name="organization" value={formData.organization} onChange={handleChange} placeholder="Organization name" required />
              </div>
              <div className="form-group">
                <label>Cost Center</label>
                <input type="text" name="costCenter" value={formData.costCenter} onChange={handleChange} placeholder="Cost center code" />
              </div>
            </div>
            <div className="form-group">
              <label>Department<span className="mandatory-star">*</span></label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Department name" required />
            </div>
            <div className="form-group">
              <label>Preferred Communication Mode</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" name="preferredCommunicationMode" value="Email" checked={formData.preferredCommunicationMode === 'Email'} onChange={handleChange} />
                  <span>Email</span>
                </label>
                <label className="radio-label">
                  <input type="radio" name="preferredCommunicationMode" value="Phone" checked={formData.preferredCommunicationMode === 'Phone'} onChange={handleChange} />
                  <span>Phone</span>
                </label>
              </div>
            </div>
          </div>

          {/* Project Sponsors */}
          <div className="card">
            <h2>Project Sponsors</h2>
            <p className="field-hint">Add key stakeholders and sponsors</p>
            <div className="tag-input-section">
              <div className="tag-input-wrapper">
                 <input type="text" value={sponsorInput} onChange={(e) => setSponsorInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSponsor())} placeholder="Add sponsor name" />
                 <button type="button" onClick={handleAddSponsor} className="btn btn-secondary">Add</button>
               </div>
               <div className="tags-list">
                 {formData.projectSponsors.map((sponsor, index) => (
                   <span key={index} className="sponsor-tag">
                     {sponsor}
                     <button type="button" onClick={() => handleRemoveSponsor(sponsor)}>×</button>
                   </span>
                 ))}
               </div>
             </div>
          </div>

          {/* Projects */}
          <div className="card">
            <h2>Projects</h2>
            <p className="field-hint">Manage your projects and team members</p>
            <div className="projects-list">
              {projects.map((project, projectIndex) => (
                <div key={projectIndex} className="project-card">
                  <div className="project-header">
                    <h3>Project {projectIndex + 1}</h3>
                    <button type="button" onClick={() => handleRemoveProject(projectIndex)} className="btn btn-danger btn-sm">Remove Project</button>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Project Name</label>
                      <input type="text" value={project.projectName} onChange={(e) => handleProjectChange(projectIndex, 'projectName', e.target.value)} placeholder="Enter project name" />
                    </div>
                    <div className="form-group">
                      <label>Team Size</label>
                      <input type="number" value={project.teamSize} onChange={(e) => handleProjectChange(projectIndex, 'teamSize', e.target.value)} placeholder="0" min="0" />
                    </div>
                  </div>
                  <div className="team-members-section">
                    <h4>Team Members</h4>
                    {(project.teamMembers || []).map((member, memberIndex) => (
                      <div key={memberIndex} className="team-member-card">
                        <div className="team-member-header">
                          <span>Member {memberIndex + 1}</span>
                          <button type="button" onClick={() => handleRemoveTeamMember(projectIndex, memberIndex)} className="btn btn-danger btn-xs">Remove</button>
                        </div>
                        <div className="form-row">
                           <div className="form-group">
                             <label>First Name</label>
                             <input type="text" value={member.firstName} onChange={(e) => handleTeamMemberChange(projectIndex, memberIndex, 'firstName', e.target.value)} placeholder="First name" />
                           </div>
                           <div className="form-group">
                             <label>Last Name</label>
                             <input type="text" value={member.lastName} onChange={(e) => handleTeamMemberChange(projectIndex, memberIndex, 'lastName', e.target.value)} placeholder="Last name" />
                           </div>
                         </div>
                         <div className="form-row">
                           <div className="form-group">
                             <label>Email</label>
                             <input type="email" value={member.email} onChange={(e) => handleTeamMemberChange(projectIndex, memberIndex, 'email', e.target.value)} placeholder="email@company.com" />
                           </div>
                           <div className="form-group">
                             <label>Phone</label>
                             <input type="tel" value={member.phone} onChange={(e) => handleTeamMemberChange(projectIndex, memberIndex, 'phone', e.target.value)} placeholder="(123) 456-7890" />
                           </div>
                         </div>
                         <div className="form-group">
                            <label>Role</label>
                           <input type="text" value={member.role} onChange={(e) => handleTeamMemberChange(projectIndex, memberIndex, 'role', e.target.value)} placeholder="e.g., Project Manager, Developer" />
                         </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => handleAddTeamMember(projectIndex)} className="btn btn-outline btn-sm">+ Add Team Member</button>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={handleAddProject} className="btn btn-secondary">+ Add Project</button>
          </div>

          {/* Messages */}
          {message.text && (
            <div className={message.type === 'success' ? 'success' : 'error'}>
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary btn-submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Employer Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployerProfile;