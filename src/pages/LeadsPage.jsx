import React, { useEffect, useState } from 'react';
import LeadForm from '../components/LeadForm';
import LeadTable from '../components/LeadsTable';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import { getLeads, deleteLead } from '../services/leadService';
import './LeadsPage.css';

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  // Pagination setup
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 5;

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(leads.length / leadsPerPage);

  // Fetch all leads from API
  const fetchLeads = async () => {
    try {
      const res = await getLeads();
      setLeads(res.data);
    } catch (err) {
      console.error('Failed to fetch leads', err);
    }
  };

  // Delete a lead
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await deleteLead(id);
      setMessage('Lead deleted successfully!');
      fetchLeads();
    } catch (err) {
      console.error('Failed to delete', err);
      setMessage('Failed to delete lead.');
    }
  };

  // Start editing
  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setModalOpen(true);
  };

  // Form success from create flow
  const handleCreateSuccess = () => {
    fetchLeads();
    setMessage('Lead created successfully!');
  };

  // Form success from modal update
  const handleEditSuccess = () => {
    setModalOpen(false);
    setSelectedLead(null);
    fetchLeads();
    setMessage('Lead updated successfully!');
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Auto clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="leads-page">
      <h1>Lead Management</h1>

      <LeadForm
        selectedLead={null}
        onSuccess={handleCreateSuccess}
        setMessage={setMessage}
      />

      {message && <p className="form-message">{message}</p>}

      <LeadTable
        leads={currentLeads}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <LeadForm
          selectedLead={selectedLead}
          onSuccess={handleEditSuccess}
          setMessage={setMessage}
        />
      </Modal>
    </div>
  );
};

export default LeadsPage;
