import React from 'react';
import './LeadTable.css';

const LeadTable = ({ leads, onEdit, onDelete }) => {
  if (leads.length === 0) {
    return <p className="no-leads">No leads found.</p>;
  }

  return (
    <div className="lead-table-container">
      <table className="lead-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Type</th>
            <th>DOB</th>
            <th>PAN</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.lead_id}>
              <td>{lead.first_name} {lead.last_name}</td>
              <td>{lead.phone}</td>
              <td>{lead.email}</td>
              <td>{lead.type}</td>
              <td>{lead.dob}</td>
              <td>{lead.pan_card}</td>
              <td>
                <button className="edit-btn" onClick={() => onEdit(lead)}>Edit</button>
                <button className="delete-btn" onClick={() => onDelete(lead.lead_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
