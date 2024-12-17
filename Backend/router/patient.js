const express = require('express');
const patient_routes = express.Router();
const pool = require('../db_connection');
// const Joi =  require("joi");
patient_routes.use(express.json());
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

module.exports.authenticated = patient_routes;

patient_routes.get('/', async (req, res) => {
    const actual_patient_id = req.session.authorization.id;
    try {
        const patient = await pool.query("SELECT * FROM patient WHERE patient_id = $1", [actual_patient_id]);
        return res.status(200).send(patient.rows[0]);
    } catch (error) {
        console.error('Error fetching patient profile:', error);
        return res.status(500).send('An error occurred while fetching the patient profile');
    }
})

patient_routes.get('/recent-doctors', async (req, res) => {
    const actual_patient_id = req.session.authorization.id;
    const recent_doctors = await pool.query("SELECT * FROM doctor WHERE doctor_id = (SELECT doctor_id FROM appointment WHERE patient_id = $1);",[actual_patient_id]);
    return res.status(200).send(recent_doctors.rows);
});

patient_routes.get('/appointments', async (req, res) => {
    const actual_patient_id = req.session.authorization.id;
    const appointments = await pool.query("SELECT * FROM appointment WHERE patient_id = $1;",[actual_patient_id]);
    return res.status(200).send(appointments.rows);
});

patient_routes.get('/browse-doctors', async (req, res) => {
    const actual_patient_id = req.session.authorization.id;
    const type_doctors = await pool.query("SELECT * FROM doctor WHERE specialty = (SELECT patient_type FROM patient WHERE patient_id = $1);",[actual_patient_id]);
    return res.status(200).send(type_doctors.rows);
});

patient_routes.get('/browse-selected-doctors', async (req, res) => {
    const {type} = req.body;
    const type_doctors = await pool.query("SELECT * FROM doctor WHERE specialty = $1;",[type]);
    return res.status(200).send(type_doctors.rows)
})

patient_routes.get('/prescriptions', async (req, res) => {
    const actual_patient_id = req.session.authorization.id;
    const prescriptions = await pool.query("SELECT * FROM prescription WHERE patient_id = $1;",[actual_patient_id]);
    return res.status(200).send(prescriptions.rows);
});

patient_routes.get('/view-image', async (req, res) => {
    const actual_patient_id = req.session.authorization.id;

    try {
        const result = await pool.query("SELECT image_url FROM patient WHERE patient_id = $1", [actual_patient_id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Image not found');
        }
        const imageUrl = result.rows[0].image_url;
        return res.status(200).sendFile(path.join(parentDir, imageUrl));
    } catch (error) {
        console.error('Error viewing image:', error);
        res.status(500).send('An error occurred while viewing the image');
    }
});

patient_routes.get('/ultra-images', async (req, res) => {
    const p_id = req.session.authorization.id;
    const ultra_images = await pool.query("SELECT * FROM patient_ultraimages WHERE patient_id = $1;",[p_id]);
    if (ultra_images.rows.length === 0){
        return res.status(404).send("No images found.")
    }
    return res.status(200).send(ultra_images.rows);
});

patient_routes.get('/medical-record', async (req, res) => {
    const p_id = req.session.authorization.id;
    try{
        const result = await pool.query("SELECT * FROM medical_record WHERE patient_id = $1",[p_id]);
        if(result.rows.length === 0){
            return res.status(404).send('Medical record not found');
        }
        return res.status(200).send(result.rows);
    }catch (error){
        console.error('Error viewing medical record:', error);
        return res.status(500).send('An error occurred while viewing the medical record');
    }
});

patient_routes.get('/statistics',async (req, res) => {
    const p_id = req.session.authorization.id;
    try{
        const total_doctors = await pool.query("SELECT COUNT(*) FROM doctor WHERE doctor_id = (SELECT doctor_id FROM appointment WHERE patient_id = $1);",[p_id]);
        const total_appointments = await pool.query("SELECT COUNT(*) FROM appointment WHERE patient_id = $1;",[p_id]);
        const total_reviews = await pool.query("SELECT COUNT(*) FROM rating_review WHERE patient_id = $1;",[p_id]);
        const total_ultraimages = await pool.query("SELECT COUNT(*) from patient_ultraimages WHERE patient_id = $1;",[p_id]);
        res.status(200).send({"Total doctors": total_doctors.rows[0].count, "Total appointments": total_appointments.rows[0].count,
            "Total reviews": total_reviews.rows[0].count, "Total ultra images": total_ultraimages.rows[0].count});
    } catch(error){
        console.error('Error viewing statistics:', error);
        return res.status(500).send('An error occurred while viewing the statistics');
    }
});

patient_routes.post('/edit-profile', async (req, res) => {
    const actual_patient_id = req.session.authorization.id;
    const fields = ['f_name', 'l_name', 'email', 'password', 'dob', 'phone', 'gender','address'];
    var c = 0;
    try{
        for await (const field of fields){
            if (req.body[field]) {
                await pool.query(`UPDATE patient SET ${field} = $1 WHERE patient_id = $2`,[req.body[field],actual_patient_id]);
                c++;
            }
        };
    } catch(error){
        console.error('Error editing patient\'s details:', error);
        return res.status(500).send('An error occurred while updating profile');
    }
    if (c === 0){
        return res.status(400).send("No fields to update")
    }
    return res.status(200).send("Profile successfully edited")
});

patient_routes.post('/edit-medical-record', async (req, res) => {
    const actual_patient_id = req.session.authorization.id;
    const type = await pool.query("SELECT patient_type FROM patient WHERE patient_id = $1;",[actual_patient_id])
    var c = 0;
    try{
        if (type.rows[0].patient_type === 'pediatric'){
            if ((await pool.query("SELECT * FROM infant_medical_record WHERE patient_id = $1",[actual_patient_id])).rows.length === 0){
                return res.status(404).send("Medical record not found.")
            }
            const fields = ['birth_weight','feeding_method','vaccination_history','patient_history']
                for await (const field of fields){
                    if (req.body[field]) {
                        await pool.query(`UPDATE infant_medical_record SET ${field} = $1 WHERE patient_id = $2`,[req.body[field],actual_patient_id]);
                        c++;
                    }
                };
            };
        if (type.rows[0].patient_type === 'obstetric'){
            if ((await pool.query("SELECT * FROM obstetrics_medical_record WHERE patient_id = $1",[actual_patient_id])).rows.length === 0){
                return res.status(404).send("Medical record not found.")
            }
            const fields = ['patient_type','patient_history','labor_method','no_of_births','menstrual_cycle_details']
            for await (const field of fields){
                if (req.body[field]) {
                    await pool.query(`UPDATE obstetrics_medical_record SET ${field} = $1 WHERE patient_id = $2`,[req.body[field],actual_patient_id]);
                    c++;
                }
            };
        }}catch(error){
            console.error('Error editing patient\'s medical record:', error);
            return res.status(500).send('An error occurred while updating medical record.');
        }
        if (c === 0){
            return res.status(400).send("No fields to update.")
        }
        return res.status(200).send("Medical record successfully edited.")
});

patient_routes.post('/new-appointment', async (req, res) => {
    const { doctor_id, date, start_time, end_time } = req.body;
    const patient_id = req.session.authorization.id;

    try {
        // Parse and construct Date object for the appointment
        const appointmentStartDateTime = new Date(`${date}T${start_time}`);
        const appointmentEndDateTime = new Date(`${date}T${end_time}`);

        // Check if the appointment date and time are in the past
        const now = new Date();
        if (appointmentStartDateTime < now || appointmentEndDateTime < now) {
            return res.status(400).send("Appointment date and time cannot be in the past.");
        }

        // Check if the doctor exists
        const doctor = await pool.query("SELECT * FROM doctor WHERE doctor_id = $1;", [doctor_id]);
        if (doctor.rows.length === 0) {
            return res.status(404).send("Doctor not found.");
        }

        // Check if the appointment is within the doctor's working hours
        const { start_time: doctor_start_time, end_time: doctor_end_time } = doctor.rows[0];
        const doctorStartDateTime = new Date(`${date}T${doctor_start_time}`);
        const doctorEndDateTime = new Date(`${date}T${doctor_end_time}`);

        if (appointmentStartDateTime < doctorStartDateTime || appointmentEndDateTime > doctorEndDateTime) {
            return res.status(400).send("Appointment time is outside the doctor's working hours.");
        }

        // Check for conflicting appointments
        const conflictingAppointments = await pool.query(
            "SELECT * FROM appointment WHERE doctor_id = $1 AND date = $2 AND ((start_time <= $3 AND end_time > $3) OR (start_time < $4 AND end_time >= $4));",
            [doctor_id, date, start_time, end_time]
        );
        if (conflictingAppointments.rows.length > 0) {
            return res.status(400).send("The chosen time slot is not available.");
        }

        // Insert the new appointment
        const newAppointment = await pool.query(
            "INSERT INTO appointment (patient_id, doctor_id, date, start_time, end_time, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
            [patient_id, doctor_id, date, start_time, end_time, 'Scheduled']
        );

        return res.status(201).send(newAppointment.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred while scheduling the appointment.");
    }
});

patient_routes.post('/upload_image', upload.single('image'), async (req, res) => {
    const actual_patient_id = req.session.authorization.id;
    const imageUrl = path.join('uploads', req.file.filename);

    try {
        await pool.query("UPDATE patient SET image_url = $1 WHERE patient_id = $2", [imageUrl, actual_patient_id]);
        return res.status(200).send('Image uploaded successfully');
    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).send('An error occurred while uploading the image');
    }
});