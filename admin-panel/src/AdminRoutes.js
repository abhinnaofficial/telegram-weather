import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AdminPanel from './AdminPanel';
import Dashboard from './component/Admindashboard';
import OAuthCallbackHandler from './component/OAuthCallbackHandler';

const AdminRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/admin" replace />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/auth/google/callback" element={<OAuthCallbackHandler />} />
            </Routes>
        </Router>
    );
};

export default AdminRoutes;