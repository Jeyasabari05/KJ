const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 3306;
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASS || 'sabari@21';
const database = process.env.DB_NAME || 'physiocare_db';

// Create a single shared Sequelize instance
const sequelize = new Sequelize(database, user, password, {
    host,
    port: parseInt(port),
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

async function initializeDatabase() {
    try {
        // Create connection to MySQL to verify/create database before executing queries
        const connection = await mysql.createConnection({
            host,
            port,
            user,
            password
        });

        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await connection.end();
        console.log(`Database '${database}' verified/created successfully.`);

        // Authenticate the shared sequelize instance
        await sequelize.authenticate();
        console.log('Successfully connected to MySQL database via Sequelize.');
        return sequelize;
    } catch (error) {
        console.error('Unable to connect to the MySQL database:', error.message);
        throw error;
    }
}

function getSequelize() {
    return sequelize;
}

module.exports = {
    initializeDatabase,
    getSequelize
};
