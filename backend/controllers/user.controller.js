const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const User = require("../models/user.model.js")


const signup = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!name || (!email && !mobile) || !password) {
    return res.status(400).json({ message: 'Please provide all required fields signup.' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or mobile already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
        addresses: [],
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error, please try again later.', error: error.message });
  }
};

// Login

const login = async (req, res) => {
  try {
      const { email, password } = req.body;
      
      if (!email || !password) {
          return res.status(400).json({ message: "Please fill all fields for login" });
      }

      const user = await User.findOne({ email });
      console.log("email found", user)
    if (!user) return res.status(404).json({ message: 'User not found' });

      
      console.log("Input password:", password);
      console.log("Stored hashed password:", user.password);
      
      const isMatch = await bcrypt.compare(password, user.password);
            console.log("Password match:", isMatch);

    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

      
      console.log("midd tokem",token)

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get user profile function: Fetches user data if the token is valid
 const getUserProfile = async (req, res) => {
  try {
    console.log("req.user", req.user);
    
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).send('Server error');
  }
};

// // Update User Information
const updateUserInfo = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    const { userId } = req.user;

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (mobile) updates.mobile = mobile;
    if (password) updates.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Manage Addresses
const addAddress = async (req, res) => {
    console.log("add address")
  const { addressLine, city, state, zip } = req.body;
  if (!addressLine || !city || !state || !zip) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newAddress = new Address({ addressLine, city, state, zip });
    await newAddress.save();

    const user = await User.findById(req.user.id);
    user.addresses.push(newAddress);
    await user.save();

    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add address' });
  }
};

// Route to update address
const updateAddress =  async (req, res) => {
  const { addressLine, city, state, zip } = req.body;
  const addressId = req.params.id;

  if (!addressLine || !city || !state || !zip) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { addressLine, city, state, zip },
      { new: true }
    );

    const user = await User.findById(req.user.id);
    user.addresses = user.addresses.map(address =>
      address._id.toString() === addressId ? updatedAddress : address
    );
    await user.save();

    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update address' });
  }
};

// Route to delete address
const deleteAddress = async (req, res) => {
  const addressId = req.params.id;

  try {
    await Address.findByIdAndDelete(addressId);

    const user = await User.findById(req.user.id);
    user.addresses = user.addresses.filter(address => address._id.toString() !== addressId);
    await user.save();

    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete address' });
  }
};



module.exports = {
    login,
    signup,
    getUserProfile,
    updateUserInfo,
    addAddress,
    updateAddress,
    deleteAddress

}