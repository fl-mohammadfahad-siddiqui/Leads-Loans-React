// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LeadsPage from './pages/LeadsPage';
import LeadDetailsPage from './pages/LeadDetailsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LeadsPage />} />
      <Route path="/leads/:id" element={<LeadDetailsPage />} />
    </Routes>
  );
}


export default App;
