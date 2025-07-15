// src/pages/LeadDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLead, deleteLead } from '../services/leadService';
import Modal from '../components/Modal';
import LeadForm from '../components/LeadForm';
import './LeadDetailsPage.css';

const LeadDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getLead(id);
        setLead(res.data);
      } catch {
        setMessage('Failed to fetch lead.');
      }
    };
    fetch();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Confirm delete?')) return;
    try {
      await deleteLead(id);
      navigate('/');
    } catch {
      setMessage('Delete failed.');
    }
  };

  const handleEditSuccess = async () => {
    const res = await getLead(id);
    setLead(res.data);
    setModalOpen(false);
    setMessage('Lead updated!');
  };

  if (!lead) return <p>Loading...</p>;
  

  return (
    <div className="lead-details-page">
      <h2>Lead Details</h2>
      <p><strong>Name:</strong> {lead.first_name} {lead.last_name}</p>
      <p><strong>Phone:</strong> {lead.phone}</p>
      <p><strong>Email:</strong> {lead.email}</p>
      <p><strong>Type:</strong> {lead.type}</p>
      <p><strong>DOB:</strong> {lead.dob}</p>
      <p><strong>PAN:</strong> {lead.pan_card}</p>

      <div className="details-actions">
        <button onClick={() => navigate('/')}>Back</button>
        <button onClick={() => setModalOpen(true)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>

      {message && <p className="form-message">{message}</p>}

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <LeadForm selectedLead={lead} onSuccess={handleEditSuccess} setMessage={setMessage} />
      </Modal>
    </div>
  );
};

export default LeadDetailsPage;
