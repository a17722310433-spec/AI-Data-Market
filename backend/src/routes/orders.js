const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { auth } = require('../middleware/auth');
const logger = require('../middleware/logger');

const router = express.Router();

// Mock storage
const orders = new Map();
const conversationData = new Map();
const users = new Map();

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { dataId } = req.body;

    // Only enterprise users can purchase
    if (req.user.role !== 'enterprise') {
      return res.status(403).json({
        success: false,
        message: 'Only enterprise accounts can purchase data'
      });
    }

    // Find data
    const data = conversationData.get(dataId);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Data not found'
      });
    }

    if (data.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Data is not available for purchase'
      });
    }

    // Calculate fees
    const amount = data.estimatedValue;
    const platformFee = amount * (parseFloat(process.env.STRIPE_PLATFORM_FEE_PERCENT) || 10) / 100;
    const sellerEarnings = amount - platformFee;

    // Create order
    const order = {
      id: uuidv4(),
      buyerId: req.user.id,
      sellerId: data.userId,
      dataId,
      amount,
      platformFee,
      sellerEarnings,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    orders.set(order.id, order);
    
    logger.info(`Order created: ${order.id}`);

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    logger.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
});

// Get my orders (as buyer or seller)
router.get('/', auth, async (req, res) => {
  try {
    const { type = 'buyer', page = 1, limit = 10 } = req.query;

    let myOrders = Array.from(orders.values()).filter(o => {
      if (type === 'seller') {
        return o.sellerId === req.user.id;
      }
      return o.buyerId === req.user.id;
    });

    myOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const paginatedOrders = myOrders.slice(
      (page - 1) * limit,
      page * limit
    );

    res.json({
      success: true,
      data: {
        items: paginatedOrders,
        total: myOrders.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(myOrders.length / limit)
      }
    });
  } catch (error) {
    logger.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to get orders' });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = orders.get(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check access
    if (order.buyerId !== req.user.id && order.sellerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Include data info
    const data = conversationData.get(order.dataId);

    res.json({
      success: true,
      data: { ...order, data }
    });
  } catch (error) {
    logger.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Failed to get order' });
  }
});

// Confirm delivery (buyer confirms receipt)
router.post('/:id/confirm', auth, async (req, res) => {
  try {
    const order = orders.get(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.buyerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only buyer can confirm delivery'
      });
    }

    if (order.status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Order must be paid first'
      });
    }

    order.status = 'delivered';
    order.completedAt = new Date().toISOString();
    orders.set(order.id, order);

    // Update data status
    const data = conversationData.get(order.dataId);
    if (data) {
      data.status = 'sold';
      conversationData.set(order.dataId, data);
    }

    // Add earnings to seller
    const seller = users.get(order.sellerId);
    if (seller) {
      seller.balance += order.sellerEarnings;
      seller.totalEarnings += order.sellerEarnings;
      users.set(order.sellerId, seller);
    }

    logger.info(`Order delivered: ${order.id}`);

    res.json({
      success: true,
      data: order,
      message: 'Delivery confirmed'
    });
  } catch (error) {
    logger.error('Confirm delivery error:', error);
    res.status(500).json({ success: false, message: 'Failed to confirm delivery' });
  }
});

// Dispute order
router.post('/:id/dispute', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    const order = orders.get(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.buyerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only buyer can dispute'
      });
    }

    order.status = 'disputed';
    order.disputeReason = reason;
    orders.set(order.id, order);

    logger.info(`Order disputed: ${order.id}, reason: ${reason}`);

    res.json({
      success: true,
      data: order,
      message: 'Dispute submitted'
    });
  } catch (error) {
    logger.error('Dispute error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit dispute' });
  }
});

module.exports = router;
