const express = require('express');
const receptionist_routes = express.Router();
const pool = require('../db_connection');
// const Joi =  require("joi");
receptionist_routes.use(express.json());
const multer = require('multer');
const path = require('path');
var format = require('pg-format');


const parentDir = path.dirname(__dirname);
const uploadsDir = path.join(parentDir, 'uploads');
// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

module.exports.authenticated = receptionist_routes;

receptionist_routes.get('/', async (req, res) => {
    const r_id = req.session.authorization.id;
    try {
        const recept = await pool.query("SELECT * FROM receptionist WHERE patient_id = $1", [actual_patient_id]);
        return res.status(200).send(patient.rows[0]);
    } catch (error) {
        console.error('Error fetching patient profile:', error);
        return res.status(500).send('An error occurred while fetching the patient profile.');
    }
});