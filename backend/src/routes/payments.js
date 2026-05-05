const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Stripe = require('stripe');
const { auth } = require('../middleware/auth');
const logger = require('../middleware/logger');

const router = express.Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

// Mock storage
const payments = new Map();
const withdrawals = new Map();
const transactions = new Map();
const orders = new Map();
const users = new Map();

// Create checkout session
router.post('/checkout', auth, async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = orders.get(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.buyerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `AI Conversation Data #${order.dataId}`,
              description: 'High-quality AI training data'
            },
            unit_amount: Math.round(order.amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/order/cancel?order_id=${orderId}`,
      metadata: {
        orderId: order.id
      }
    });

    // Create payment record
    const payment = {
      id: uuidv4(),
      orderId,
      stripeSessionId: session.id,
      amount: order.amount,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    payments.set(payment.id, payment);

    logger.info(`Checkout session created: ${session.id}`);

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url
      }
    });
  } catch (error) {
    logger.error('Checkout error:', error);
    res.status(500).json({ success: false, message: 'Failed to create checkout session' });
  }
});

// Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    let event;

    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = JSON.parse(req.body);
    }

    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.metadata.orderId;
      
      const order = orders.get(orderId);
      if (order) {
        order.status = 'paid';
        order.stripePaymentId = session.payment_intent;
        order.paidAt = new Date().toISOString();
        orders.set(orderId, order);

        logger.info(`Payment completed for order: ${orderId}`);
      }
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook Error' });
  }
});

// Get payment status
router.get('/:id', auth, async (req, res) => {
  try {
    const payment = payments.get(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    logger.error('Get payment error:', error);
    res.status(500).json({ success: false, message: 'Failed to get payment' });
  }
});

// Create withdrawal
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount, method, bankAccount } = req.body;

    if (!amount || amount < 10) {
      return res.status(400).json({
        success: false,
        message: 'Minimum withdrawal amount is $10'
      });
    }

    const user = users.get(req.user.id);
    if (!user || user.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Create withdrawal
    const withdrawal = {
      id: uuidv4(),
      userId: req.user.id,
      amount,
      method,
      bankAccount: method === 'bank' ? bankAccount : undefined,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    withdrawals.set(withdrawal.id, withdrawal);

    // Deduct from balance
    user.balance -= amount;
    users.set(req.user.id, user);

    logger.info(`Withdrawal created: ${withdrawal.id}, amount: $${amount}`);

    // Simulate processing
    setTimeout(() => {
      withdrawal.status = 'completed';
      withdrawal.processedAt = new Date().toISOString();
      withdrawals.set(withdrawal.id, withdrawal);
      logger.info(`Withdrawal completed: ${withdrawal.id}`);
    }, 3000);

    res.status(201).json({
      success: true,
      data: withdrawal,
      message: 'Withdrawal submitted'
    });
  } catch (error) {
    logger.error('Withdrawal error:', error);
    res.status(500).json({ success: false, message: 'Failed to create withdrawal' });
  }
});

// Get withdrawals
router.get('/withdrawals', auth, async (req, res) => {
  try {
    const userWithdrawals = Array.from(withdrawals.values())
      .filter(w => w.userId === req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: userWithdrawals
    });
  } catch (error) {
    logger.error('Get withdrawals error:', error);
    res.status(500).json({ success: false, message: 'Failed to get withdrawals' });
  }
});

// Get transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;

    let userTransactions = Array.from(transactions.values())
      .filter(t => t.userId === req.user.id);

    if (type && type !== 'all') {
      userTransactions = userTransactions.filter(t => t.type === type);
    }
    if (startDate) {
      userTransactions = userTransactions.filter(t => new Date(t.date) >= new Date(startDate));
    }
    if (endDate) {
      userTransactions = userTransactions.filter(t => new Date(t.date) <= new Date(endDate));
    }

    userTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: userTransactions
    });
  } catch (error) {
    logger.error('Get transactions error:', error);
    res.status(500).json({ success: false, message: 'Failed to get transactions' });
  }
});

module.exports = router;
