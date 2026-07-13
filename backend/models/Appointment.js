const { DataTypes } = require('sequelize');
const { getSequelize } = require('../config/db');

const sequelize = getSequelize();

const Appointment = sequelize.define('Appointment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    patientId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    patientName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    doctorId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    doctorName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    appointmentDate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    appointmentTime: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Scheduled'
    },
    type: {
        type: DataTypes.STRING,
        defaultValue: 'Video'
    },
    notes: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    prescription: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    videoRoomId: {
        type: DataTypes.STRING,
        defaultValue: ''
    }
}, {
    tableName: 'Appointments',
    timestamps: true
});

module.exports = Appointment;
