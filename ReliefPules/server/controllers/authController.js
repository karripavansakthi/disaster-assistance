const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      organization,
      location,
      peopleCount,
      specialRequirements,
      emergencyContact,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      phone: phone || '',
      role: 'citizen',
      organization: organization || '',
      location: location || {},
      peopleCount: Number(peopleCount) || 1,
      specialRequirements: specialRequirements || '',
      emergencyContact: emergencyContact || {},
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        organization: user.organization,
        location: user.location,
        peopleCount: user.peopleCount,
        specialRequirements: user.specialRequirements,
        emergencyContact: user.emergencyContact,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;
    const identifier = String(email || phone || '').trim();

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password',
      });
    }

    const normalizedIdentifier = identifier.toLowerCase();
    const user = await User.findOne({
      $or: [{ email: normalizedIdentifier }, { phone: identifier }],
    }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    // Block admin users from logging in via the public /login endpoint
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin accounts must log in through the secure admin portal at /admin',
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'This account is inactive. Contact an administrator for assistance.',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        organization: user.organization,
        location: user.location,
        peopleCount: user.peopleCount,
        specialRequirements: user.specialRequirements,
        emergencyContact: user.emergencyContact,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/user/profile (or /api/auth/me)
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        organization: user.organization,
        location: user.location,
        emergencyContact: user.emergencyContact,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, organization, location, emergencyContact } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (phone !== undefined) fieldsToUpdate.phone = phone;
    if (organization !== undefined) fieldsToUpdate.organization = organization;
    if (location) fieldsToUpdate.location = location;
    if (emergencyContact) fieldsToUpdate.emergencyContact = emergencyContact;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        organization: updatedUser.organization,
        location: updatedUser.location,
        emergencyContact: updatedUser.emergencyContact,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin-only login (accessible only from /admin portal)
// @route   POST /api/auth/admin-login
// @access  Public
const adminLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password',
      });
    }

    // Only accept 'admin' as username
    if (username.toLowerCase() !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials',
      });
    }

    // Only accept 'admin123' as password
    if (password !== 'admin123') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials',
      });
    }

    // Find or create the admin user
    let adminUser = await User.findOne({ email: 'admin@reliefpulse.in' }).select('+password');

    if (!adminUser) {
      // Auto-create the admin account if it doesn't exist
      adminUser = await User.create({
        name: 'Command Admin',
        email: 'admin@reliefpulse.in',
        password: 'admin123',
        role: 'admin',
        phone: '9000000001',
      });
    }

    adminUser.lastLogin = new Date();
    await adminUser.save();

    const token = generateToken(adminUser._id);

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        phone: adminUser.phone,
        role: adminUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  adminLogin,
  getProfile,
  updateProfile,
};
