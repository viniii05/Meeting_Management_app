const express = require('express');
const router = express.Router();
const Meeting = require('../models/meeting');
const Booking = require('../models/booking');
const { Op } = require('sequelize');

// Fetch available slots
router.get('/slots', async (req, res) => {
    try {
      // Limit the number of slots returned
      const slots = await Meeting.findAll({ limit: 4 });
      res.json(slots);
    } catch (err) {
      console.error('Error fetching slots:', err);
      res.status(500).json({ error: 'Error fetching slots' });
    }
  });
  router.get('/api/slots', async (req, res) => {
    try {
        const meetings = await Meeting.findAll(); // Fetch all meetings
        res.json(meetings); // Send the data as JSON response
    } catch (error) {
        console.error('Error fetching slots:', error);
        res.status(500).json({ error: 'Error fetching slots.' });
    }
});

router.get('/api/booked', async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [Meeting]
        });
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching booked slots:', error);
        res.status(500).json({ error: 'Error fetching booked slots.' });
    }
});
  router.get('/booked-slots', async (req, res) => {
    try {
      const bookings = await Booking.findAll({
        include: [Meeting]
      });
  
      const bookedSlots = bookings.map(booking => ({
        time: booking.Meeting.time,
        userId: booking.userId
      }));
  
      res.json(bookedSlots);
    } catch (err) {
      console.error('Error fetching booked slots:', err);
      res.status(500).json({ error: 'Error fetching booked slots' });
    }
  });
  
  
  
  router.post('/book', async (req, res) => {
    const { time, name, email } = req.body;
    try {
      const meeting = await Meeting.findOne({ where: { time } });
      if (!meeting) {
        return res.status(400).json({ error: 'Meeting slot not found' });
      }
  
      await Booking.create({
        userId: Math.floor(Math.random() * 1000),
        meetingId: meeting.id,
        name,
        email
      });
  
      res.json({ success: true });
    } catch (err) {
      console.error('Error booking slot:', err);
      res.status(500).json({ error: 'Error booking slot' });
    }
  });
  
module.exports = router;
