import axios from 'axios';

const API_URL = "http://localhost:3000/loans";

export const getLoans = () => axios.get(API_URL);

export const createLead = (data) => axios.post(API_URL, data);

export const updateLead = (id, data) => axios.put(`${API_URL}/${id}`, data);

export const deleteLead = (id) => axios.delete(`${API_URL}/${id}`);

export const getLoan = (id) => axios.get(`${API_URL}/${id}`);