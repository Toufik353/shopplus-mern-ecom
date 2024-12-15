import React, { useState, useEffect } from 'react';
import styles from './EditUser.module.css'; // Import the CSS module

const EditUser = () => {
  const [userData, setUserData] = useState({ name: '', email: '', mobile: '', password: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setMessage('No token found');
        return;
      }

      try {
        const response = await fetch('https://shopplus-ecom-backend.onrender.com/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
            const data = await response.json();
          setUserData(data);
        } else {
          setMessage('Error fetching user data: ' + response.statusText);
        }
      } catch (error) {
        setMessage('Error fetching user data: ' + error.message);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('No token found for update');
      return;
    }

    try {
      const response = await fetch('https://shopplus-ecom-backend.onrender.com/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setMessage('User updated successfully!');
      } else {
        setMessage('Update failed: ' + response.statusText);
      }
    } catch (error) {
      setMessage('Update failed: ' + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Edit User Information</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          value={userData.name}
          onChange={handleChange}
          placeholder="Name"
          className={styles.input}
        />
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          placeholder="Email"
          className={styles.input}
        />
        <input
          type="text"
          name="mobile"
          value={userData.mobile}
          onChange={handleChange}
          placeholder="Mobile"
          className={styles.input}
        />
        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="New Password"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Update</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default EditUser;
