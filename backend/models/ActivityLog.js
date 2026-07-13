const { DataTypes } = require('sequelize');
const { getSequelize } = require('../config/db');

const sequelize = getSequelize();

const ActivityLog = sequelize.define('ActivityLog', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    kioskId: {
        type: DataTypes.STRING,
        defaultValue: 'KIOSK-TN-01'
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    details: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    operator: {
        type: DataTypes.STRING,
        defaultValue: 'Health Worker'
    },
    deviceHealth: {
        type: DataTypes.JSON,
        defaultValue: { cpuUsage: 15, memUsage: 42, cameraStatus: 'Online', networkLatency: 28 }
    }
}, {
    tableName: 'ActivityLogs',
    timestamps: true
});

module.exports = ActivityLog;
