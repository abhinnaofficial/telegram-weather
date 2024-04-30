import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Function to extract query parameters
        const getQueryParam = (param) => {
            const urlParams = new URLSearchParams(location.search);
            return urlParams.get(param);
        };


        const code = getQueryParam('code');
        if (!code) {
            console.error('Authorization code not found.');
            navigate('/'); // Redirect to login if no code is found
            return;
        }

        // Function to handle the authentication with the backend
        const authenticate = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/google/callback`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code })
                });

                const data = await response.json();
                if (response.ok) {

                    navigate('/dashboard'); // Redirect to dashboard on success
                } else {
                    throw new Error(data.message || 'Failed to authenticate');
                }
            } catch (error) {
                console.error('Authentication error:', error);
                navigate('/'); // Redirect to login on failure
            }
        };

        authenticate();
    }, [navigate, location.search]);

    return (
        <div>Loading...</div> // Show a loading message while processing
    );
};

export default AuthHandler;