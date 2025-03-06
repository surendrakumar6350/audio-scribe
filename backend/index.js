/**
 * Main server configuration for a standard Node.js Express application
 * This file sets up the Express application with middleware, routes, and error handling.
 */
const express = require("express");
const app = express();
require('dotenv').config();  // Load environment variables from .env file
const bodyParser = require('body-parser');
const cors = require('cors');
const allApis = require('./routes/api');  // Import all API routes
const { limiter } = require('./utils/limiter');  // Rate limiting middleware
const { corsOptions } = require('./utils/corsOptions');  // CORS configuration

const PORT = process.env.PORT || 4000; // Set the port

/**
 * Configure the application to trust the proxy when running behind a reverse proxy
 * This is important for correct IP address determination for rate limiting
 */
app.set('trust proxy', function (ip) {
    return ip === '127.0.0.1';
});

/**
 * Enable CORS (Cross-Origin Resource Sharing) pre-flight requests
 * This allows browsers to make requests to this API from different origins
 */
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

/**
 * Configure body-parser middleware for handling JSON and URL-encoded data
 * Sets a 10MB limit for request body size to allow for larger payloads like audio files
 */
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

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
        message: "Hello! Server is Running...",
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
 * Start the Express server
 */
app.listen(PORT, () => {
    console.log(`Backend Server is running ....`);
});
