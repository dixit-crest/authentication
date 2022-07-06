const express = require('express');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json())

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))