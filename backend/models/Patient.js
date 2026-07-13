const { DataTypes } = require('sequelize');
const { getSequelize } = require('../config/db');

const sequelize = getSequelize();

const Patient = sequelize.define('Patient', {
  patientId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  village: {
    type: DataTypes.STRING,
    allowNull: false
  },
  district: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  abhaId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  aadhaarPlaceholder: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  occupation: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  medicalHistory: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  disabilityStatus: {
    type: DataTypes.STRING,
    defaultValue: 'None'
  },
  emergencyContact: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  qrCodeUrl: {
    type: DataTypes.TEXT,
    defaultValue: ''
  }
}, {
  tableName: 'Patients',
  timestamps: true
});

module.exports = Patient;
