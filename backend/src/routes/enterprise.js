const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const logger = require('../middleware/logger');

const router = express.Router();

// Mock user storage
const users = new Map();

// Enterprise registration
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('companyName').trim().notEmpty(),
  body('businessLicense').trim().notEmpty(),
  body('industry').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password, companyName, businessLicense, industry, website } = req.body;

    // Check if user exists
    const existingUser = Array.from(users.values()).find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create enterprise user
    const user = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name: companyName,
      role: 'enterprise',
      balance: 0,
      totalEarnings: 0,
      createdAt: new Date().toISOString(),
      isVerified: false,
      companyName,
      businessLicense,
      industry,
      website,
      verificationStatus: 'pending'
    };

    users.set(user.id, user);
    logger.info(`Enterprise registered: ${companyName}`);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyName: user.companyName,
          industry: user.industry,
          verificationStatus: user.verificationStatus
        }
      },
      message: 'Registration submitted for verification'
    });
  } catch (error) {
    logger.error('Enterprise registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Verify enterprise
router.post('/verify', auth, async (req, res) => {
  try {
    if (req.user.role !== 'enterprise') {
      return res.status(403).json({
        success: false,
        message: 'Not an enterprise account'
      });
    }

    const user = users.get(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { verificationDoc } = req.body;

    user.verificationDoc = verificationDoc;
    user.verificationStatus = 'under_review';
    users.set(user.id, user);

    logger.info(`Verification submitted for: ${user.companyName}`);

    // In production, this would trigger a manual review process
    res.json({
      success: true,
      message: 'Verification documents submitted for review'
    });
  } catch (error) {
    logger.error('Verification error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit verification' });
  }
});

// Get verification status
router.get('/status', auth, async (req, res) => {
  try {
    const user = users.get(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        verificationStatus: user.verificationStatus || 'pending',
        isVerified: user.isVerified,
        verifiedAt: user.verifiedAt
      }
    });
  } catch (error) {
    logger.error('Get verification status error:', error);
    res.status(500).json({ success: false, message: 'Failed to get verification status' });
  }
});

module.exports = router;
