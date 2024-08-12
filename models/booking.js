const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const Meeting = require('./meeting');

const Booking = sequelize.define('Booking', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

Booking.belongsTo(Meeting, { foreignKey: 'MeetingId' });

module.exports = Booking;
