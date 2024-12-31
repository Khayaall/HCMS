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
        const result = await pool.query("SELECT * FROM receptionist WHERE receptionist_id = $1", [r_id]);
        return res.status(200).send(result.rows[0]);
    } catch (error) {
        console.error('Error fetching receptionist profile:', error);
        return res.status(500).send('An error occurred while fetching the receptionist profile.');
    }
});

receptionist_routes.get('/patients', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM patient");
        return res.status(200).send(result.rows);
    } catch (error) {
        console.error('Error fetching all patients:', error);
        return res.status(500).send('An error occurred while fetching all patients.');
    }
});

receptionist_routes.get('/doctors', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM doctor");
        return res.status(200).send(result.rows);
    } catch (error) {
        console.error('Error fetching all doctors:', error);
        return res.status(500).send('An error occurred while fetching all doctors.');
    }
});

receptionist_routes.get('/appointments', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM appointment");
        return res.status(200).send(result.rows);
    } catch (error) {
        console.error('Error fetching all appointments:', error);
        return res.status(500).send('An error occurred while fetching all appointments.');
    }
});

receptionist_routes.get('/patient/:p_id', async (req, res) => {
    try {
        const p_id = req.params.p_id;
        const result = await pool.query("SELECT * FROM patient WHERE patient_id = $1",[p_id]);
        return res.status(200).send(result.rows[0]);
    } catch (error) {
        console.error('Error fetching patient\'s data:', error);
        return res.status(500).send('An error occurred while fetching patient\'s data.');
    }
});

receptionist_routes.get('/doctor/:d_id', async (req, res) => {
    try {
        const d_id = req.params.d_id;
        const result = await pool.query("SELECT * FROM doctor WHERE doctor_id = $1",[d_id]);
        return res.status(200).send(result.rows[0]);
    } catch (error) {
        console.error('Error fetching doctor\'s data:', error);
        return res.status(500).send('An error occurred while fetching doctor\'s data.');
    }
});

receptionist_routes.get('/patient-appointments/:p_id', async (req, res) => {
    try {
        const p_id = req.params.p_id;
        const result = await pool.query("SELECT * FROM appointment WHERE patient_id = $1",[p_id]);
        return res.status(200).send(result.rows);
    } catch (error) {
        console.error('Error fetching patient\'s appointments:', error);
        return res.status(500).send('An error occurred while fetching patient\'s appointments.');
    }
});

receptionist_routes.get('/doctor-appointments/:d_id', async (req, res) => {
    try {
        const d_id = req.params.d_id;
        const result = await pool.query("SELECT * FROM appointment WHERE doctor_id = $1",[d_id]);
        return res.status(200).send(result.rows);
    } catch (error) {
        console.error('Error fetching doctor\'s appointments:', error);
        return res.status(500).send('An error occurred while fetching doctor\'s appointments.');
    }
});

receptionist_routes.get('/view-image', async (req, res) => {
    const r_id = req.session.authorization.id;

    try {
        const result = await pool.query("SELECT image_url FROM receptionist WHERE receptionist_id = $1", [r_id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Image not found');
        }
        const imageUrl = result.rows[0].image_url;
        return res.status(200).sendFile(path.join(parentDir, imageUrl));
    } catch (error) {
        console.error('Error viewing image:', error);
        res.status(500).send('An error occurred while viewing receptionist\'s image.');
    }
});

receptionist_routes.post('/upload-image', upload.single('image'), async (req, res) => {
    const r_id = req.session.authorization.id;
    const imageUrl = path.join('uploads', req.file.filename);

    try {
        await pool.query("UPDATE receptionist SET image_url = $1 WHERE receptionist_id = $2", [imageUrl, r_id]);
        return res.status(200).send('Image uploaded successfully');
    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).send('An error occurred while uploading the image');
    }
});

receptionist_routes.put('/edit-profile', async (req, res) => {
    const r_id = req.session.authorization.id;
    const fields = ['f_name', 'l_name', 'email', 'password', 'dob', 'phone', 'gender','address'];
    var c = 0;
    try{
        for await (const field of fields){
            if (req.body[field]) {
                await pool.query(`UPDATE receptionist SET ${field} = $1 WHERE receptionist_id = $2`,[req.body[field],r_id]);
                c++;
            }
        };
    } catch(error){
        console.error('Error editing receptionist\'s details:', error);
        return res.status(500).send('An error occurred while updating profile');
    }
    if (c === 0){
        return res.status(400).send("No fields to update")
    }
    return res.status(200).send("Profile successfully edited")
});

receptionist_routes.put('/edit-appointment/:id', async (req, res) => {
    const appointment_id = req.params.id;
    const { date, start_time, end_time, status } = req.body;

    if (!appointment_id) {
        return res.status(400).send("Appointment ID is required.");
    }

    // Ensure at least one field is provided for update
    if (!date && !start_time && !end_time && !status) {
        return res.status(400).send("At least one field to update must be provided.");
    }

    try {
        // Fetch the current appointment details
        const currentAppointment = await pool.query("SELECT * FROM appointment WHERE appointment_id = $1;", [appointment_id]);
        if (currentAppointment.rows.length === 0) {
            return res.status(404).send("Appointment not found or you do not have permission to edit this appointment.");
        }

        const appointment = currentAppointment.rows[0];

        // Use existing values if not provided
        const newDoctorId = appointment.doctor_id;
        var newDate = date || appointment.date.toString();
        const newStartTime = start_time || appointment.start_time;
        const newEndTime = end_time || appointment.end_time;
        const newStatus = status || appointment.status;

       // Adjust the date to local time zone
       const localDate = new Date(appointment.date);
       const offset = localDate.getTimezoneOffset() * 60000; // Offset in milliseconds
       newDate = new Date(localDate.getTime() - offset).toISOString().split('T')[0];

        // Construct Date objects for the new appointment start and end times
        const appointmentStartDateTime = new Date(`${newDate}T${newStartTime}`);
        const appointmentEndDateTime = new Date(`${newDate}T${newEndTime}`);

        // Check if the constructed dates are valid
        if (isNaN(appointmentStartDateTime.getTime()) || isNaN(appointmentEndDateTime.getTime())) {
            return res.status(400).send("Invalid date or time format.");
        }

        // Check if the new appointment date and time are in the past
        const now = new Date();
        if (appointmentStartDateTime <= now || appointmentEndDateTime <= appointmentStartDateTime) {
            return res.status(400).send("Appointment date and time cannot be in the past or end before it starts.");
        }

        // Check if the doctor exists
        const doctor = await pool.query("SELECT * FROM doctor WHERE doctor_id = $1;", [newDoctorId]);
        if (doctor.rows.length === 0) {
            return res.status(404).send("Doctor not found.");
        }

        // Check if the appointment is within the doctor's working hours
        const { start_time: doctor_start_time, end_time: doctor_end_time } = doctor.rows[0];
        const doctorStartDateTime = new Date(`${newDate}T${doctor_start_time}`);
        const doctorEndDateTime = new Date(`${newDate}T${doctor_end_time}`);

        if (appointmentStartDateTime <= doctorStartDateTime || appointmentEndDateTime >= doctorEndDateTime) {
            return res.status(400).send("Appointment time is outside the doctor's working hours.");
        }

        // Check for conflicting appointments, excluding the current appointment
        const conflictingAppointments = await pool.query(
            "SELECT * FROM appointment WHERE doctor_id = $1 AND date = $2 AND appointment_id != $3 AND ((start_time < $4 AND end_time > $4) OR (start_time < $5 AND end_time > $5));",
            [newDoctorId, newDate, appointment_id, newEndTime, newStartTime]
        );
        if (conflictingAppointments.rows.length > 0) {
            return res.status(400).send("The chosen time slot is not available.");
        }

        // Update the appointment
        const updatedAppointment = await pool.query(
            "UPDATE appointment SET doctor_id = $1, date = $2, start_time = $3, end_time = $4, status = $5 WHERE appointment_id = $6 RETURNING *;",
            [newDoctorId, newDate, newStartTime, newEndTime, newStatus, appointment_id]
        );

        return res.status(200).send(updatedAppointment.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred while updating the appointment.");
    }
});