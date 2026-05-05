const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { auth } = require('../middleware/auth');
const logger = require('../middleware/logger');

const router = express.Router();

// Mock storage
const conversationData = new Map();
const evaluations = new Map();

// Upload conversation data
router.post('/upload', auth, async (req, res) => {
  try {
    const { files, platform } = req.body;
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const dataId = uuidv4();
    
    // Create data entry
    const dataEntry = {
      id: dataId,
      userId: req.user.id,
      platform: platform || 'other',
      title: `Conversation ${Date.now()}`,
      messages: [],
      quality: 0,
      estimatedValue: 0,
      category: null,
      tags: [],
      duration: 0,
      messageCount: 0,
      status: 'pending',
      uploadedAt: new Date().toISOString(),
      fileName: files[0]?.name || 'unknown',
      fileSize: files[0]?.size || 0,
      content: files[0]?.content || ''
    };

    conversationData.set(dataId, dataEntry);
    
    logger.info(`Data uploaded: ${dataId} by user ${req.user.id}`);

    // Start async evaluation
    evaluateDataAsync(dataId);

    res.status(201).json({
      success: true,
      data: dataEntry,
      message: 'Data uploaded successfully, evaluation in progress'
    });
  } catch (error) {
    logger.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// Async evaluation using OpenAI
async function evaluateDataAsync(dataId) {
  try {
    const data = conversationData.get(dataId);
    if (!data) return;

    // Update status to processing
    data.status = 'processing';
    conversationData.set(dataId, data);

    // Simulate AI evaluation (replace with actual OpenAI call)
    const evaluation = await simulateAIEvaluation(data);
    
    // Update data with evaluation results
    data.quality = evaluation.quality;
    data.estimatedValue = evaluation.estimatedValue;
    data.category = evaluation.category;
    data.tags = evaluation.tags;
    data.status = 'evaluated';
    data.processedAt = new Date().toISOString();

    conversationData.set(dataId, data);
    evaluations.set(dataId, evaluation);
    
    logger.info(`Data evaluated: ${dataId}, quality: ${evaluation.quality}`);
  } catch (error) {
    logger.error('Evaluation error:', error);
    const data = conversationData.get(dataId);
    if (data) {
      data.status = 'pending';
      conversationData.set(dataId, data);
    }
  }
}

// Simulate AI evaluation (replace with actual OpenAI API)
async function simulateAIEvaluation(data) {
  // In production, use OpenAI API to analyze conversation content
  // const OpenAI = require('openai');
  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  // Simulated evaluation based on content analysis
  const contentLength = data.content?.length || 0;
  const baseQuality = Math.min(95, Math.max(50, contentLength / 100));
  
  const categories = ['coding', 'writing', 'analysis', 'research', 'business', 'creative', 'language', 'other'];
  const tags = ['AI', 'Chat', 'Conversation', 'Data'];
  
  return {
    quality: Math.round(baseQuality),
    estimatedValue: Math.round((baseQuality / 10) * 100) / 100,
    category: categories[Math.floor(Math.random() * categories.length)],
    tags: tags.slice(0, Math.floor(Math.random() * 4) + 2),
    summary: 'AI conversation data with moderate complexity.',
    insights: [
      'Contains diverse query types',
      'Good topic coverage',
      'Moderate conversation depth'
    ],
    recommendations: [
      'Suitable for training assistant models',
      'Consider pairing with similar data for batch training'
    ]
  };
}

// Evaluate data endpoint
router.post('/evaluate', auth, async (req, res) => {
  try {
    const { content, platform } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    const evaluation = await simulateAIEvaluation({ content, platform });

    res.json({
      success: true,
      data: evaluation
    });
  } catch (error) {
    logger.error('Evaluate error:', error);
    res.status(500).json({ success: false, message: 'Evaluation failed' });
  }
});

// Get my data
router.get('/my', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const userData = Array.from(conversationData.values())
      .filter(d => d.userId === req.user.id)
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    const paginatedData = userData.slice(
      (page - 1) * limit,
      page * limit
    );

    res.json({
      success: true,
      data: {
        items: paginatedData,
        total: userData.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(userData.length / limit)
      }
    });
  } catch (error) {
    logger.error('Get my data error:', error);
    res.status(500).json({ success: false, message: 'Failed to get data' });
  }
});

// Get data by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const data = conversationData.get(req.params.id);
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Data not found'
      });
    }

    // Check ownership or if published
    if (data.userId !== req.user.id && data.status !== 'published') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    logger.error('Get data error:', error);
    res.status(500).json({ success: false, message: 'Failed to get data' });
  }
});

// Get market data
router.get('/', async (req, res) => {
  try {
    const { 
      platform, 
      category, 
      minQuality, 
      maxPrice,
      sortBy = 'quality',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    let marketData = Array.from(conversationData.values())
      .filter(d => d.status === 'published' || d.status === 'sold');

    // Apply filters
    if (platform && platform !== 'all') {
      marketData = marketData.filter(d => d.platform === platform);
    }
    if (category && category !== 'all') {
      marketData = marketData.filter(d => d.category === category);
    }
    if (minQuality) {
      marketData = marketData.filter(d => d.quality >= parseInt(minQuality));
    }
    if (maxPrice) {
      marketData = marketData.filter(d => d.estimatedValue <= parseFloat(maxPrice));
    }

    // Sort
    marketData.sort((a, b) => {
      const aVal = a[sortBy] || 0;
      const bVal = b[sortBy] || 0;
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });

    const paginatedData = marketData.slice(
      (page - 1) * limit,
      page * limit
    );

    res.json({
      success: true,
      data: {
        items: paginatedData,
        total: marketData.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(marketData.length / limit)
      }
    });
  } catch (error) {
    logger.error('Get market data error:', error);
    res.status(500).json({ success: false, message: 'Failed to get market data' });
  }
});

// Publish data
router.post('/:id/publish', auth, async (req, res) => {
  try {
    const data = conversationData.get(req.params.id);
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Data not found'
      });
    }

    if (data.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (data.status !== 'evaluated') {
      return res.status(400).json({
        success: false,
        message: 'Data must be evaluated before publishing'
      });
    }

    data.status = 'published';
    conversationData.set(req.params.id, data);

    logger.info(`Data published: ${req.params.id}`);

    res.json({
      success: true,
      data,
      message: 'Data published to market'
    });
  } catch (error) {
    logger.error('Publish error:', error);
    res.status(500).json({ success: false, message: 'Failed to publish data' });
  }
});

// Delete data
router.delete('/:id', auth, async (req, res) => {
  try {
    const data = conversationData.get(req.params.id);
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Data not found'
      });
    }

    if (data.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (data.status === 'sold') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete sold data'
      });
    }

    conversationData.delete(req.params.id);
    evaluations.delete(req.params.id);

    logger.info(`Data deleted: ${req.params.id}`);

    res.json({
      success: true,
      message: 'Data deleted successfully'
    });
  } catch (error) {
    logger.error('Delete error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete data' });
  }
});

module.exports = router;
