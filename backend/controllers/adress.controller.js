const User = require("../models/user.model");
const Address = require("../models/adressSchema.model.js");

// Get all addresses for a user
const getAllAddresses = async (req, res) => {
  try {
      const userId = req.user.userId;
    const addresses = await Address.find({ userId }).sort({ createdAt: -1 });

    if (!addresses) return res.status(404).json({ error: "No addresses found for the user" });
    res.status(200).json(addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
};

// Add a new address
const addAddress = async (req, res) => {
  try {
    const { fullName, mobile, pincode, flat, area, landmark, city, state, country, isDefault } = req.body;
      const userId = req.user.userId;

    if (isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const newAddress = new Address({
      userId,
      fullName,
      mobile,
      pincode,
      flat,
      area,
      landmark,
      city,
      state,
      country,
      isDefault,
    });

    await newAddress.save();
    res.status(201).json({ message: "Address added successfully", address: newAddress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add address" });
  }
};

// Edit an address
const editAddress = async (req, res) => {
  try {
      const addressId = req.params.id;
    const { fullName, mobile, pincode, flat, area, landmark, city, state, country, isDefault } = req.body;
    const userId = req.user.userId;

    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) return res.status(404).json({ error: "Address not found" });

    if (isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    Object.assign(address, { fullName, mobile, pincode, flat, area, landmark, city, state, country, isDefault });
    await address.save();

    res.status(200).json({ message: "Address updated successfully", address });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update address" });
  }
};

// Delete an address
const deleteAddress = async (req, res) => {
  try {
      const addressId = req.params.id;
    const userId = req.user.userId;

    const address = await Address.findOneAndDelete({ _id: addressId, userId });
    if (!address) return res.status(404).json({ error: "Address not found" });

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete address" });
  }
};

module.exports = {
  getAllAddresses,
  addAddress,
  editAddress,
  deleteAddress,
};
