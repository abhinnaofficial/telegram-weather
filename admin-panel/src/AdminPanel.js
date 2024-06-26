import React, { useEffect, useState } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/auth/session`, { credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                console.log("Received data:", data);  // Detailed log of the received data
                if (data.isAuthenticated) {
                    console.log("User is authenticated, setting user data:", data.user);
                    setUser(data.user);
                } else {
                    console.log("User is not authenticated.");
                    setUser(null);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching session data:', error);
                setLoading(false);
            });
    }, []);

    const handleGoogleLogin = () => {
        const clientId = '872902945558-7nri7aoh67objhntk14clsf56hoq434u.apps.googleusercontent.com';
        const redirectUri = encodeURIComponent(`${process.env.REACT_APP_API_URL}/auth/google/callback`);
        const scope = encodeURIComponent('profile email');
        const responseType = 'code';
        const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&access_type=offline`;
        window.location.href = googleUrl;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="admin-panel">
            <h1>Welcome to Weather Bot Admin Panel</h1>
            <div className="login-box">
                {!user ? (
                    <button onClick={handleGoogleLogin}>Sign in with Google</button>
                ) : (
                    <div className="user-card">
                        <img src={user.picture || 'default-profile.png'} alt="Profile" />
                        <p>Signed in as {user.email || 'No email available'}</p>
                    </div>
                )}
            </div>
        </div>
    );

};

export default AdminPanel;