const express = require('express');
const path = require('path');
const sequelize = require('./util/database');
const Meeting = require('./models/meeting');
const Booking = require('./models/booking');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'views')));

// Routes
const slotsRouter = require('./routes/slots');
app.use('/', slotsRouter);

// Serve index.html at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Define model associations
Meeting.hasMany(Booking, { foreignKey: 'MeetingId' });
Booking.belongsTo(Meeting, { foreignKey: 'MeetingId' });

// Sync database and add dummy data
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced');
    return Meeting.findAll(); // Check if meetings are created
  })
  .then(meetings => {
    if (meetings.length === 0) {
      return Meeting.bulkCreate([
        { time: '10:00 AM' },
        { time: '11:00 AM' },
        { time: '12:00 PM' },
        { time: '1:00 PM' },
        { time: '2:00 PM' }
      ]);
    }
  })
  .then(() => {
    return Booking.findAll(); // Check if bookings are created
  })
  .then(bookings => {
    if (bookings.length === 0) {
      return Booking.bulkCreate([
        { name: 'John Doe', email: 'john@example.com', MeetingId: 1 },
        { name: 'Jane Smith', email: 'jane@example.com', MeetingId: 2 }
      ]);
    }
  })
  .then(() => {
    console.log('Dummy data added');
  })
  .catch(err => {
    console.error('Error syncing database or adding dummy data:', err);
  });

// Error Handling
app.use((req, res, next) => {
    res.status(404).send('Page Not Found');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server Error');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
