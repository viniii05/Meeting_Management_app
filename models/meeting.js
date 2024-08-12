const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Meeting = sequelize.define('Meeting', {
    time: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = Meeting;
