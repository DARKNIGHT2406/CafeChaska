require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for now, restrict in production
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cafe_chaska';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/menu-items', require('./routes/menuItems'));
app.use('/api/tables', require('./routes/tables'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/upload', require('./routes/upload'));

app.get('/', (req, res) => {
  res.send('Cafe Chaska API is running...');
});

// Socket.io
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
