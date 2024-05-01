import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallbackHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (!code) {
            console.error('Authorization code not found.');
            navigate('/admin'); // Redirect to login if no code is found
            return;
        }

        const authenticate = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/google/callback?code=${code}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include' // Ensure credentials are included if using cookies
                });

                if (response.ok) {
                    navigate('/dashboard'); // Redirect to dashboard on success
                } else {
                    const data = await response.json();
                    throw new Error(data.message || 'Failed to authenticate');
                }
            } catch (error) {
                console.error('Authentication error:', error);
                navigate('/admin'); // Redirect to login on failure
            }
        };

        authenticate();
    }, [navigate]);

    return <div>Loading...</div>; // Show a loading message while processing
};

export default OAuthCallbackHandler;