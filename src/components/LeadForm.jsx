import React, { useState, useEffect } from 'react';
import { createLead, updateLead } from '../services/leadService';
import './LeadForm.css';

const initialFormState = {
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  type: 'applicant',
  dob: '',
  pan_card: '',
};

function LeadForm({ selectedLead, onSuccess, setMessage }) {
  const [lead, setLead] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (selectedLead) {
      setLead({
        ...selectedLead,
        dob: selectedLead.dob?.split('T')[0],
      });
    }
  }, [selectedLead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLead({ ...lead, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!lead.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!lead.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!/^\d{10}$/.test(lead.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!/^\S+@\S+\.\S+$/.test(lead.email)) newErrors.email = 'Email is invalid';
    if (!lead.dob) newErrors.dob = 'Date of Birth is required';
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(lead.pan_card)) {
      newErrors.pan_card = 'PAN must be in format ABCDE1234F';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (selectedLead) {
        await updateLead(selectedLead.lead_id, lead);
        setMessage('Lead updated successfully!');
      } else {
        await createLead(lead);
        setMessage('Lead created successfully!');
      }
      onSuccess();
      setLead(initialFormState);
      setErrors({});
    } catch (err) {
      console.error('Save failed:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setFormError(err.response.data.message); // New state
      } else {
        setFormError('Failed to save lead.');
  }
    }
  };

  return (
    <div className='lead-form-container'>
      <form onSubmit={handleSubmit} className='lead-form'>
        <input
          type="text"
          name="first_name"
          value={lead.first_name}
          onChange={handleChange}
          placeholder="First Name"
          className={errors.first_name ? 'error-input' : ''}
          required
        />
        {errors.first_name && <p className="error">{errors.first_name}</p>}

        <input
          type="text"
          name="last_name"
          value={lead.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          className={errors.last_name ? 'error-input' : ''}
          required
        />
        {errors.last_name && <p className="error">{errors.last_name}</p>}

        <input
          type="tel"
          name="phone"
          value={lead.phone}
          onChange={handleChange}
          placeholder="Phone"
          className={errors.phone ? 'error-input' : ''}
          required
        />
        {errors.phone && <p className="error">{errors.phone}</p>}

        <input
          type="email"
          name="email"
          value={lead.email}
          onChange={handleChange}
          placeholder="Email"
          className={errors.email ? 'error-input' : ''}
          required
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <label>Type:</label>
        <select
          name="type"
          value={lead.type}
          onChange={handleChange}
          required
        >
          <option value="applicant">Applicant</option>
          <option value="guarantor">Guarantor</option>
        </select>

        <input
          type="date"
          name="dob"
          value={lead.dob}
          onChange={handleChange}
          className={errors.dob ? 'error-input' : ''}
          required
        />
        {errors.dob && <p className="error">{errors.dob}</p>}

        <input
          type="text"
          name="pan_card"
          value={lead.pan_card}
          onChange={handleChange}
          placeholder="PAN"
          maxLength="10"
          className={errors.pan_card ? 'error-input' : ''}
          required
        />
        {errors.pan_card && <p className="error">{errors.pan_card}</p>}

        {formError && <p className="form-error">{formError}</p>}

        <button type="submit">
          {selectedLead ? 'Update Lead' : 'Create Lead'}
        </button>
      </form>
    </div>
  );
}

export default LeadForm;
