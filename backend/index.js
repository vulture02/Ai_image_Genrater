import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);

// Routes
app.get('/', (req, res) => {
  res.send('Hello from AI Image Generation Server 🚀');
});

// Start server
const startServer = async () => {
  try{
    connectDB(process.env.MONGODB_URL);
    app.listen(8080, () => console.log('Server has started on http://localhost:8080'));
  }
  catch(error){
    console.log('Error connecting to MongoDB:', error);
    return;
  }
  
};

startServer();

