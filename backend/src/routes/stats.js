const express = require('express');
const { auth } = require('../middleware/auth');
const logger = require('../middleware/logger');

const router = express.Router();

// Get dashboard stats
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Mock stats - in production, aggregate from database
    const stats = {
      totalUsers: 50000,
      totalDataUploaded: 125000,
      totalTransactions: 8500,
      totalVolume: 2500000,
      todayUploads: 450,
      todayTransactions: 120,
      activeUsers: 12500,
      conversionRate: 3.5
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to get stats' });
  }
});

// Get market stats
router.get('/market', async (req, res) => {
  try {
    // Mock market stats
    const stats = {
      totalDataListings: 45000,
      averageQuality: 72.5,
      averagePrice: 15.75,
      topCategories: [
        { name: '编程开发', count: 12500, percentage: 28 },
        { name: '写作创作', count: 9800, percentage: 22 },
        { name: '数据分析', count: 7200, percentage: 16 },
        { name: '商业咨询', count: 5500, percentage: 12 },
        { name: '其他', count: 10000, percentage: 22 }
      ],
      topPlatforms: [
        { name: 'ChatGPT', count: 28000, percentage: 62 },
        { name: 'Claude', count: 12000, percentage: 27 },
        { name: '文心一言', count: 5000, percentage: 11 }
      ],
      recentTrends: {
        uploads: [120, 135, 142, 158, 175, 190, 210],
        sales: [85, 92, 98, 105, 112, 125, 140]
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Market stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to get market stats' });
  }
});

// Get user-specific stats
router.get('/user', auth, async (req, res) => {
  try {
    // Mock user stats
    const stats = {
      totalUploads: 24,
      totalSold: 18,
      totalEarnings: 520.50,
      pendingEarnings: 45.25,
      averageQuality: 78.5,
      topCategories: ['编程开发', '数据分析', '创意写作'],
      monthlyEarnings: [
        { month: 'Aug', amount: 85.50 },
        { month: 'Sep', amount: 120.00 },
        { month: 'Oct', amount: 95.25 },
        { month: 'Nov', amount: 110.00 },
        { month: 'Dec', amount: 109.75 }
      ],
      qualityDistribution: [
        { range: '90-100%', count: 5 },
        { range: '80-89%', count: 8 },
        { range: '70-79%', count: 6 },
        { range: '60-69%', count: 3 },
        { range: '<60%', count: 2 }
      ]
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('User stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to get user stats' });
  }
});

module.exports = router;
