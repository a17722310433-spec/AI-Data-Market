// Vercel Serverless Function Handler
// This file wraps the Express app for Vercel Functions

const app = require('./index');

// Vercel serverless function export
module.exports = app;
