const express = require('express');
const pool = require('../db_connection');
const doctor_routes = express.Router();
const multer = require('multer');
const path = require('path');


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

// Upload doctor image
doctor_routes.post('/upload_image', upload.single('image'), async (req, res) => {
    const d_id = req.session.authorization.id;
    const imageUrl = path.join('uploads', req.file.filename);

    try {
        await pool.query("UPDATE doctor SET image_url = $1 WHERE doctor_id = $2", [imageUrl, d_id]);
        res.send('Image uploaded successfully');
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).send('An error occurred while uploading the image');
    }
});

// View doctor image
doctor_routes.get('/view_image', async (req, res) => {
    const d_id = req.session.authorization.id;

    try {
        const result = await pool.query("SELECT image_url FROM doctor WHERE doctor_id = $1", [d_id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Image not found');
        }
        const imageUrl = result.rows[0].image_url;
        res.sendFile(path.join(parentDir, imageUrl));
    } catch (error) {
        console.error('Error viewing image:', error);
        res.status(500).send('An error occurred while viewing the image');
    }
});

doctor_routes.get('/all', async (req, res) => {
    const doctors = await pool.query("SELECT * FROM doctor");
    res.send(doctors.rows);
});

doctor_routes.get('/patients', async (req, res) => {
    const actual_doctor_id = req.session.authorization.id
    const patients_id = await pool.query("SELECT * FROM appointment WHERE doctor_id = $1", [actual_doctor_id]);
    const patients = await pool.query("SELECT * FROM patient WHERE patient_id = ANY($1)", [patients_id.rows.map(row => row.patient_id)]);
    res.send(patients.rows);
});

doctor_routes.get('/reviews', async (req, res) => {
    try {
        const rating_reviews = await pool.query("SELECT * FROM rating_review WHERE doctor_id = $1", [req.session.authorization.id]);
        res.send(rating_reviews.rows);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send('An error occurred while fetching reviews');
    }
});

doctor_routes.post('/edit_profile', async (req, res) => {
    const d_id = req.session.authorization.id;
    const fields = ['f_name', 'l_name', 'email', 'password', 'dob', 'phone', 'gender', 'experience', 'specialty', 'about_me'];
    const updates = [];
    const values = [];

    fields.forEach((field) => {
        if (req.body[field]) {
            updates.push(`${field} = $${updates.length + 1}`);
            values.push(req.body[field]);
        }
    });

    if (updates.length === 0) {
        return res.status(400).send('No fields to update');
    }

    values.push(d_id);
    const query = `UPDATE doctor SET ${updates.join(', ')} WHERE doctor_id = $${values.length}`;

    try {
        await pool.query(query, values);
        res.send('Profile updated successfully');
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('An error occurred while updating the profile');
    }
});

doctor_routes.post('/appointment/:a_id', async (req, res) => {
    const appointment_id = req.params.a_id;
    const d_id = req.session.authorization.id;
    try {
        const p_id_result = await pool.query('SELECT patient_id FROM appointment WHERE appointment_id = $1', [appointment_id]);
        const p_id = p_id_result.rows[0].patient_id;

        if (req.body.diagnosis) {
            await pool.query("UPDATE appointment SET diagnosis = $1 WHERE appointment_id = $2", [req.body.diagnosis, appointment_id]);
        }
        if (req.body.treatment) {
            await pool.query("UPDATE appointment SET treatment = $1 WHERE appointment_id = $2", [req.body.treatment, appointment_id]);
        }
        if (req.body.medication || req.body.note) {
            const date_issue_result = await pool.query("SELECT date FROM appointment WHERE appointment_id = $1", [appointment_id]);
            const date_issue = date_issue_result.rows[0].date; // Extract the date value
            await pool.query("INSERT INTO prescription(appointment_id, doctor_id, patient_id, date_issue) VALUES ($1, $2, $3, $4)", [appointment_id, d_id, p_id, date_issue]);
        }
        if (req.body.medication) {
            await pool.query("UPDATE prescription SET medication = $1 WHERE appointment_id = $2", [req.body.medication, appointment_id]);
        }
        if (req.body.note) {
            await pool.query("UPDATE prescription SET note = $1 WHERE appointment_id = $2", [req.body.note, appointment_id]);
        }
        res.send('Appointment updated successfully');
    } catch (error) {
        console.error('Error editing appointment:', error);
        res.status(500).send('An error occurred while updating appointment');
    }
});

doctor_routes.get('/get_todays_appointments', async (req, res) => {
    const d_id = req.session.authorization.id;
    const currentDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Cairo' });

    try {
        const result = await pool.query(
            "SELECT * FROM appointment WHERE doctor_id = $1 AND date::date = $2::date",
            [d_id, currentDate]
        );
        res.send(result.rows);
    } catch (error) {
        console.error('Error fetching today\'s appointments:', error);
        res.status(500).send('An error occurred while fetching today\'s appointments');
    }
});

doctor_routes.get('/get_upcoming_appointments', async (req, res) => {
    const d_id = req.session.authorization.id;
    const currentDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Cairo' });

    try {
        const result = await pool.query(
            "SELECT * FROM appointment WHERE doctor_id = $1 AND date::date > $2::date",
            [d_id, currentDate]
        );
        res.send(result.rows);
    } catch (error) {
        console.error('Error fetching upcoming appointments:', error);
        res.status(500).send('An error occurred while fetching upcoming appointments');
    }
});


module.exports.authenticated = doctor_routes;