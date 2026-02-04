// require('dotenv').config();
// const http = require('http');
// const socketIo = require('socket.io');
// const app = require('./app');
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: { origin: "*", methods: ["GET", "POST"] }
// });

// // Initialize Socket.IO controller
// const SocketController = require('./controllers/socketController');
// new SocketController(io);

// // Make io available to app for routes
// app.set('io', io);

// // Initialize pairing routes with io
// const { initializePairingRoutes } = require('./routes/pairingRoutes');
// initializePairingRoutes(io);

// const PORT = process.env.PORT || 3000;

// server.listen(PORT, () => {
//   console.log(`\n🚀 Server running on port ${PORT}`);
//   console.log(`\n📡 Socket.IO server initialized`);
//   console.log(`\n📋 API Endpoints:`);
//   console.log(`   GET  /api/pairing/generate-code`);
//   console.log(`   POST /api/pairing/validate-code`);
//   console.log(`   POST /api/pairing/submit-link`);
//   console.log(`   GET  /api/pairing/active-codes`);
//   console.log(`   GET  /api/admin/dashboard`);
//   console.log(`   POST /api/admin/reset-codes`);
//   console.log(`   GET  /health`);
//   console.log(`   GET  /health/redis\n`);
// });


require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const app = require('./app');

const server = http.createServer(app);

// Create io instance with proper CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "https://codeconnect01.netlify.app",
  "https://automatic-waffle-94wx66pp7p43pqg9-3000.app.github.dev"
];

const io = socketIo(server, {
  cors: {
    origin: function(origin, callback) {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "https://localhost:3000",
        "https://localhost:3001",
        "https://127.0.0.1:3000",
        "https://codeconnect01.netlify.app",
        "https://automatic-waffle-94wx66pp7p43pqg9-3000.app.github.dev"
      ];
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn('CORS blocked origin:', origin);
        callback(new Error('CORS not allowed'), false);
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
    allowEIO3: true
  },
  transports: ['websocket', 'polling'],
  secure: true,
  rejectUnauthorized: false
});

// Make io available to app
app.set('io', io);

// Initialize Socket.IO controller AFTER io is created
const SocketController = require('./controllers/socketController');
new SocketController(io);

// Initialize pairing routes
const { initializePairingRoutes } = require('./routes/pairingRoutes');
initializePairingRoutes(io);

const PORT = process.env.PORT || 3000;
console.log("REDIS URL:", process.env.UPSTASH_REDIS_REST_URL ? "✅ set" : "❌ missing");
console.log("REDIS TOKEN:", process.env.UPSTASH_REDIS_REST_TOKEN ? "✅ set" : "❌ missing");

server.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`\n📡 Socket.IO server initialized`);
  console.log(`\n📋 API Endpoints:`);
  console.log(`   GET  /api/pairing/generate-code`);
  console.log(`   POST /api/pairing/validate-code`);
  console.log(`   POST /api/pairing/submit-link`);
  console.log(`   GET  /api/pairing/active-codes`);
  console.log(`   GET  /api/admin/dashboard`);
  console.log(`   POST /api/admin/reset-codes`);
  console.log(`   GET  /health`);
  console.log(`   GET  /health/redis\n`);
});