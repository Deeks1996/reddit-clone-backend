import express from 'express';  
import bodyParser from 'body-parser'; 
import dotenv from 'dotenv';  
import authRoutes from './routes/authRoutes.js';  
import cors from 'cors';
import protectedRoute from './routes/protectedRoute.js';
import communityRoutes from './routes/communityRoutes.js';
import postRoutes from './routes/postRoutes.js';
import voteRoutes from './routes/voteRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();  

const app = express();
app.use(express.json());

app.use(bodyParser.json());
app.use(cors());

app.use('/', protectedRoute);

app.use('/api/auth', authRoutes);
app.use('/api/communities',communityRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running...');
});

// Start the server
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on PORT:${port}`);
});
