require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { init } = require('./config/db');
const authRoutes = require('./routes/auth');
const studentsRoutes = require('./routes/students');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes);

app.get('/', (req, res) => res.send('MERN Auth Backend (SQLite) running'));

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await init();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
})();
