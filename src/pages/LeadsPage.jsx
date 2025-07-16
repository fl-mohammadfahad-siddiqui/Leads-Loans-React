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
  const [filters, setFilters] = useState({
    type: '',
    search: '',
  })

  // Pagination setup
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 5;

  const fetchLeads = async () => {
    try {
      const res = await getLeads();
      setLeads(res.data);
    } catch (err) {
      console.error('Failed to fetch leads', err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

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

  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setModalOpen(true);
  };

  const handleCreateSuccess = () => {
    setModalOpen(false);
    setSelectedLead(null);
    fetchLeads();
    setMessage('Lead created successfully!');
  };

  const handleEditSuccess = () => {
    setModalOpen(false);
    setSelectedLead(null);
    fetchLeads();
    setMessage('Lead updated successfully!');
  };

  const handleFilterChange = (e) => {
    const { name,value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const filteredLeads = leads.filter((lead) => {
    const matchType = filters.type ? lead.type === filters.type : true;
    const matchSearch = filters.search ? 
                        (lead.first_name + ' ' + lead.last_name + lead.email + lead.phone)
                        .toLowerCase().
                        includes(filters.search.toLowerCase()) 
                        : true

    return matchType && matchSearch
  })
  
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  return (
    <div className="leads-page">
      <div className='lead-header'>
        <h1>Lead Management</h1>
        <button className='create-lead-btn' onClick={() => setModalOpen(true)}>+ Create Lead</button>
      </div>
      
      {message && <p className="form-message">{message}</p>}

      <div className="filter-bar">
        <select name="type" value={filters.type} onChange={handleFilterChange}>
          <option value="">All types</option>
          <option value="applicant">Applicant</option>
          <option value="guarantor">Guarantor</option>
        </select>

        <input 
          type="text" 
          name='search'
          value={filters.search}
          onChange={handleFilterChange}
          placeholder='Search by name, phone, or email'
        />
      </div>

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
          onSuccess={selectedLead ? handleEditSuccess : handleCreateSuccess}
          setMessage={setMessage}
        />
      </Modal>
    </div>
  );
};

export default LeadsPage;
