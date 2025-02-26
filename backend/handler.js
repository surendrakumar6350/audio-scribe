/**
 * Main server configuration for a serverless Express application
 * This file sets up the Express application with middleware, routes, and error handling.
 */
const serverless = require("serverless-http");
const express = require("express");
const app = express();
require('dotenv').config();  // Load environment variables from .env file
const bodyParser = require('body-parser');
const cors = require('cors');
const allApis = require('./routes/api');  // Import all API routes
const {limiter} = require('./utils/limiter');  // Rate limiting middleware
const { corsOptions } = require('./utils/corsOptions')  // CORS configuration

/**
 * Configure the application to trust the proxy when running behind a reverse proxy
 * This is important for correct IP address determination for rate limiting
 */
app.set('trust proxy', function (ip) {
  return ip === '127.0.0.1';
});

/**
 * Configure body-parser middleware for handling JSON and URL-encoded data
 * Sets a 10MB limit for request body size to allow for larger payloads like audio files
 */
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

/**
 * Enable CORS (Cross-Origin Resource Sharing) pre-flight requests
 * This allows browsers to make requests to this API from different origins
 */
app.options('*', cors(corsOptions));

/**
 * Apply rate limiting middleware to prevent abuse
 * Limits the number of requests a client can make in a given time period
 */
app.use(limiter);

/**
 * Root endpoint to check if the server is running
 * @route GET /
 * @returns {Object} 200 - Success response with a message
 */
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello! Sever is Running...",
  });
});

/**
 * Mount all API routes under the /v1 path
 * This creates a versioned API structure for better maintenance
 */
app.use('/v1', allApis);

/**
 * 404 Not Found handler for undefined routes
 * This catches any requests that don't match defined routes
 */
app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

/**
 * Export the Express app wrapped with serverless-http
 * This allows the app to run in serverless environments like AWS Lambda
 */
exports.handler = serverless(app);
