import React, { useState, useEffect } from 'react';
import './Admindashboard.css';


const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [apiKey, setApiKey] = useState('');  // State to hold the API key input

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/users`)
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const handleToggleBlockUser = async (userId, isCurrentlyBlocked) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/toggle-block/${userId}`, {
            method: 'POST',
        });
        if (response.ok) {
            setUsers(users.map(user => user.id === userId ? { ...user, isBlocked: !isCurrentlyBlocked } : user));
        }
    };

    const handleDeleteUser = async (userId) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
            method: 'DELETE',
        });
        if (response.ok) {  // Check if the HTTP response is successful
            setUsers(users.filter(user => user.id !== userId));
        }
    };

    const handleUpdateApiKey = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/update-api-key`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ apiKey }),
        });
        const data = await response.json();
        alert(data.message);  // Alert the response message
    };

    const handleSignOut = async () => {
        await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
            method: 'GET',
            credentials: 'include' // necessary for cookies if sessions are used
        })
            .then(response => {
                if (response.ok) {
                    localStorage.removeItem('user'); // Clear local storage if used
                    sessionStorage.removeItem('user'); // Clear session storage if used
                    window.location.href = '/'; // Adjust if the path to the login page is different
                }
            })
            .catch(error => {
                console.error('Logout failed:', error);
            });
    };

    return (
        <div>
            <h1 className='header'>Admin Dashboard</h1>
            <button onClick={handleSignOut} style={{ position: 'absolute', top: 30, right: 20 }}>Sign Out</button>
            <div>
                <h2 className='header2'>User Management</h2>
                {users.length > 0 ? (
                    <ul>
                        {users.map(user => (
                            <li key={user.id}>
                                {user.telegramUsername} (ID: {user.telegramUserId}) - {user.isBlocked ? 'Blocked' : 'Active'}
                                <button onClick={() => handleToggleBlockUser(user.id, user.isBlocked)}>
                                    {user.isBlocked ? 'Unblock' : 'Block'}
                                </button>
                                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No users found.</p>
                )}
            </div>
            <div>
                <h2 className='header3'>API Key Management</h2>
                <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter new API key"
                />
                <button onClick={handleUpdateApiKey}>Update API Key</button>
            </div>
        </div>
    );
};

export default Dashboard;