// src/components/LeadsTable.jsx
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import './LeadTable.css';

const LeadsTable = ({ leads, onEdit, onDelete }) => {
  const navigate = useNavigate();

  if (!leads.length) return <p className="no-leads">No leads found.</p>;

  return (
    <div className="lead-table-container">
      <table className="lead-table">
        <thead>
          <tr>
            <th>Name</th><th>Phone</th><th>Email</th><th>Type</th><th>DOB</th><th>PAN</th><th>Actions</th>
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
              <td className="icon-actions">
                <FaEye className="action-icon view" onClick={() => navigate(`/leads/${lead.lead_id}`)} />
                <FaEdit className="action-icon edit" onClick={() => onEdit(lead)} />
                <FaTrash className="action-icon delete" onClick={() => onDelete(lead.lead_id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTable;
