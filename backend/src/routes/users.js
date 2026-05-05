const express = require('express');
const { auth } = require('../middleware/auth');
const logger = require('../middleware/logger');

const router = express.Router();

// Mock storage
const users = new Map();

// Get user stats
router.get('/stats', auth, async (req, res) => {
  try {
    const user = users.get(req.user.id);
    
    res.json({
      success: true,
      data: {
        totalUploads: 24,
        totalSold: 18,
        totalEarnings: 520.50,
        pendingEarnings: 45.25,
        averageQuality: 78.5,
        responseRate: 98.5
      }
    });
  } catch (error) {
    logger.error('User stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to get stats' });
  }
});

// Get earnings
router.get('/earnings', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Mock earnings data
    const earnings = [
      { date: '2024-01-15', amount: 15.50, type: 'sale', dataId: 'data1' },
      { date: '2024-01-14', amount: 8.75, type: 'sale', dataId: 'data2' },
      { date: '2024-01-13', amount: 12.00, type: 'sale', dataId: 'data3' },
      { date: '2024-01-12', amount: 18.25, type: 'sale', dataId: 'data4' },
      { date: '2024-01-10', amount: 10.00, type: 'bonus', dataId: null }
    ];

    res.json({
      success: true,
      data: earnings
    });
  } catch (error) {
    logger.error('Get earnings error:', error);
    res.status(500).json({ success: false, message: 'Failed to get earnings' });
  }
});

// Get balance
router.get('/balance', auth, async (req, res) => {
  try {
    const user = users.get(req.user.id);
    
    res.json({
      success: true,
      data: {
        balance: user?.balance || 125.50,
        pendingBalance: 45.25,
        totalEarnings: 520.50,
        totalWithdrawn: 150.00
      }
    });
  } catch (error) {
    logger.error('Get balance error:', error);
    res.status(500).json({ success: false, message: 'Failed to get balance' });
  }
});

module.exports = router;
