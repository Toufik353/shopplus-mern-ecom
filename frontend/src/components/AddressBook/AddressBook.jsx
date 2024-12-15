import React, { useState } from 'react';

const AddressBook = ({ onAddressAdd }) => {
  const [address, setAddress] = useState({
    addressLine: '',
    city: '',
    state: '',
    zip: '',
  });

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch('https://shopplus-ecom-backend.onrender.com/addaddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(address),
      });

      if (response.ok) {
          const data = await response.json();
          console.log("address data frontend",data)
          onAddressAdd(data);
        alert('Address added successfully!');
      } else {
        console.error('Error adding address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  return (
    <div>
      <h3>Add New Address</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Address Line:</label>
          <input
            type="text"
            name="addressLine"
            value={address.addressLine}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>State:</label>
          <input
            type="text"
            name="state"
            value={address.state}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>ZIP Code:</label>
          <input
            type="text"
            name="zip"
            value={address.zip}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Address</button>
      </form>
    </div>
  );
};

export default AddressBook;
