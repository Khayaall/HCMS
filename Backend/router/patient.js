const express = require('express');
const patient_routes = express.Router();
const pool = require('../db_connection');
// const Joi =  require("joi");
patient_routes.use(express.json());

module.exports.authenticated = patient_routes;

patient_routes.get('/recent-doctors', async (req, res) => {
    const actual_patient_id = req.session.authorization.id;
    const recent_doctors = await pool.query("SELECT * FROM doctor WHERE doctor_id = (SELECT doctor_id FROM appointment WHERE patient_id = $1);",[actual_patient_id]);
    res.send(recent_doctors.rows);
});

patient_routes.get('/appointments', async (req, res) => {
    const actual_patient_id = req.session.authorization.id;
    const appointments = await pool.query("SELECT * FROM appointment WHERE patient_id = $1;",[actual_patient_id]);
    res.send(appointments.rows);
});

patient_routes.get('/browse-doctors', async (req, res) => {
    const actual_patient_id = req.session.authorization.id;
    const type_doctors = await pool.query("SELECT * FROM doctor WHERE specialty = (SELECT patient_type FROM patient WHERE patient_id = $1);",[actual_patient_id]);
    res.send(type_doctors.rows);
});

patient_routes.get('/prescriptions', async (req, res) => {
    const actual_patient_id = req.session.authorization.id;
    const prescriptions = await pool.query("SELECT * FROM prescription WHERE patient_id = $1;",[actual_patient_id]);
    res.send(prescriptions.rows);
});