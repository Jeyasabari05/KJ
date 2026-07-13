const { DataTypes } = require('sequelize');
const { getSequelize } = require('../config/db');

const sequelize = getSequelize();

const Assessment = sequelize.define('Assessment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    patientId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    healthScore: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    assessmentClass: {
        type: DataTypes.STRING,
        allowNull: false
    },
    painScore: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    bmi: {
        type: DataTypes.FLOAT,
        defaultValue: 22.0
    },
    postureScores: {
        type: DataTypes.JSON,
        defaultValue: { forwardHead: 0, roundedShoulders: 0, scoliosis: 0, kneeValgus: 0 }
    },
    mobility: {
        type: DataTypes.INTEGER,
        defaultValue: 100
    },
    balance: {
        type: DataTypes.INTEGER,
        defaultValue: 100
    },
    flexibility: {
        type: DataTypes.INTEGER,
        defaultValue: 100
    },
    painQuestionnaire: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    mentalHealthQuestionnaire: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    strokeScreening: {
        type: DataTypes.STRING,
        defaultValue: 'Normal'
    },
    fallRiskStatus: {
        type: DataTypes.STRING,
        defaultValue: 'Low'
    },
    recommendations: {
        type: DataTypes.JSON,
        defaultValue: []
    }
}, {
    tableName: 'Assessments',
    timestamps: true
});

module.exports = Assessment;
