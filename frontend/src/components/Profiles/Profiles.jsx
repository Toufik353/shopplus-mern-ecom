import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./Profiles.module.css"

const Profiles = () => {
  const [userData, setUserData] = useState(null);
  const [address, setAddress] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addressLoading, setAddressLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
  });

  const fetchUserData = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch('https://shopplus-ecom-backend.onrender.com/profile', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          mobile: data.mobile || '',
        });
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddress = async () => {
    const token = localStorage.getItem('authToken');
    setAddressLoading(true);
    try {
      const response = await fetch('https://shopplus-ecom-backend.onrender.com/addaddress', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
          setAddress(data);
          localStorage.setItem("address",data)
      } else {
        console.error('Failed to fetch addresses');
      }
    } catch (error) {
      console.error('Error fetching address data:', error);
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchAddress();
  }, []);

  const handleProfileEditToggle = () => {
    setIsEditingProfile(!isEditingProfile);
  };

  const handleProfileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch('https://shopplus-ecom-backend.onrender.com/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
          toast.success('Profile updated successfully!', {
        position: "top-center"
      });
        setUserData(formData);
        setIsEditingProfile(false);
      } else {
          toast.success('Failed to update profile', {
        position:'top-center',
           })
          
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAddressAdd = async (newAddress) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch('https://shopplus-ecom-backend.onrender.com/addaddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAddress),
      });

      if (response.ok) {
        const addedAddress = await response.json();
        setAddress((prevAddress) => [...prevAddress, addedAddress]);
          setIsModalOpen(false);
          fetchAddress();
          toast.success('Address added successfully!', {
        position: "top-center"
      });
      } else {
        console.error('Failed to add address');
           toast.error('Failed to add address. Please check your input and try again.', {
        position: "top-center"
      });
      }
    } catch (error) {
      console.error('Error adding address:', error);
              toast.error('An error occurred. Please try again.', {
        position: "top-center"
      });
    }
  };

  const AddressForm = ({ onAddressAdd, onClose }) => {
    const [formData, setFormData] = useState({
      country: 'India',
      fullName: '',
      mobile: '',
      pincode: '',
      flat: '',
      area: '',
      landmark: '',
      city: '',
      state: '',
      isDefault: false,
    });

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      // Simple validation
      if (!formData.fullName || !formData.mobile || !formData.pincode || !formData.flat || !formData.city || !formData.state) {
           toast.error('Please fill out all required fields.', {
        position: "top-center"
      });
        return;
      }

      onAddressAdd(formData);
    };

    return (
      <div className={styles.modalContent}>
        <h2>Add New Address</h2>
        <form onSubmit={handleSubmit} className={styles.addressForm}>
          <div className={styles.formGroup}>
            <label>Country/Region</label>
            <select name="country" value={formData.country} onChange={handleChange} className={styles.input}>
              <option value="India">India</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={styles.input}
              placeholder="First and Last Name"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className={styles.input}
              placeholder="10-digit mobile number"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className={styles.input}
              placeholder="6 digits [0-9]"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Flat, House no., Building, Company, Apartment</label>
            <input
              type="text"
              name="flat"
              value={formData.flat}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Area, Street, Sector, Village</label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Landmark</label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              className={styles.input}
              placeholder="E.g. near Apollo Hospital"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Town/City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value="">Choose a state</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
              />{' '}
              Make this my default address
            </label>
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.button}>
              Save Address
            </button>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`${styles.container} ${styles.loading}`}>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className={`${styles.container} ${styles.loading}`}>
        <p>No user data available.</p>
      </div>
    );
  }

    return (
      <div className={styles.wrapper}>
            
    <div className={styles.container}>
      <h2 className={styles.header}>User Profile</h2>

      {isEditingProfile ? (
        <form onSubmit={handleProfileSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleProfileChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleProfileChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Mobile</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleProfileChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.button}>
              Save Changes
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleProfileEditToggle}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.profileInfo}>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Contact:</strong> {userData.mobile}</p>
          <button className={styles.editButton} onClick={handleProfileEditToggle}>
            Edit Profile
          </button>
        </div>
      )}
      <h3 className={styles.subHeader}>Addresses</h3>
      <div className={styles.addressSection}>
       
        {addressLoading ? (
          <p>Loading addresses...</p>
        ) : address.length > 0 ? (
          address.map((addr, index) => (
            <div key={index} className={styles.addressItem}>
              <p><strong>{addr.fullName}</strong></p>
              <p>{addr.flat}, {addr.area}, {addr.city} - {addr.pincode}</p>
              <p>{addr.state}, {addr.country}</p>
              {addr.landmark && <p>Landmark: {addr.landmark}</p>}
              {addr.isDefault && <p><strong>Default Address</strong></p>}
            </div>
          ))
        ) : (
          <p>No addresses available.</p>
        )}
       
          </div>
           <button
          className={styles.addAddressButton}
          onClick={() => setIsModalOpen(true)}
        >
          Add Address
        </button>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <AddressForm 
              onAddressAdd={handleAddressAdd} 
              onClose={() => setIsModalOpen(false)} 
            />
          </div>
        </div>
          )}
                <ToastContainer />

            </div>
      </div>
            
  );
};

export default Profiles;
