require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const userRoutes = require('./routes/userRoutes');
const initSockets = require('./sockets');
var cors = require('cors')
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
app.use(cors())

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(passport.initialize());
require('./config/passport')(passport);



app.get('/uploads/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join("uploads", imageName);
  fs.exists(imagePath, exists => {
    if (exists) {
      res.setHeader('Content-Type', 'image/jpeg');
      fs.createReadStream(imagePath).pipe(res);
    } else {
      res.status(404).send('Not Found');
    }
  });
});
app.use('/api/users', userRoutes);


initSockets(server);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
