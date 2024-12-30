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
doctor_routes.get('/', async (req, res) => { 
    const d_id = req.session.authorization.id;
    console.log('d_id', d_id);
    try {
        const doctor = await pool.query("SELECT * FROM doctor WHERE doctor_id = $1", [d_id]);
        res.send(doctor.rows[0]);
    } catch (error) {
        console.error('Error fetching doctor profile:', error);
        res.status(500).send('An error occurred while fetching the doctor profile');
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
    const fields = ['f_name', 'l_name', 'email', 'password', 'dob', 'phone', 'gender', 'experience', 'specialty', 'about_me', 'education'];
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

        const patient_type_result = await pool.query("SELECT patient_type FROM patient WHERE patient_id = $1", [p_id]);
        const patient_type = patient_type_result.rows[0].patient_type.toLowerCase();
        const table_name = patient_type === 'obstetrics' ? 'obstetrics_medical_record' : 'infant_medical_record';
        await pool.query("UPDATE appointment SET status = $1 WHERE appointment_id = $2", ['completed', appointment_id]);

        if (req.body.diagnosis) {
            await pool.query("UPDATE appointment SET diagnosis = $1 WHERE appointment_id = $2", [req.body.diagnosis, appointment_id]);
            await pool.query(
                `INSERT INTO ${table_name} (patient_id, diagnosis) VALUES ($1, $2)`,
                [p_id, req.body.diagnosis]
            );
        }

        if (req.body.treatment) {
            await pool.query("UPDATE appointment SET treatment = $1 WHERE appointment_id = $2", [req.body.treatment, appointment_id]);
            await pool.query(
                `INSERT INTO ${table_name} (patient_id, treatment) VALUES ($1, $2)`,
                [p_id, req.body.treatment]
            );
        }

        if (req.body.medication || req.body.note) {
            const date_issue_result = await pool.query("SELECT date FROM appointment WHERE appointment_id = $1", [appointment_id]);
            const date_issue = date_issue_result.rows[0].date; // Extract the date value
            await pool.query(
                `INSERT INTO prescription (appointment_id, doctor_id, patient_id, date_issue) VALUES ($1, $2, $3, $4)`,
                [appointment_id, d_id, p_id, date_issue]
            );
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

doctor_routes.get('/all_appointments', async (req, res) => {
    const d_id = req.session.authorization.id;
    const result = await pool.query("SELECT * FROM appointment WHERE doctor_id = $1", [d_id]);
    res.status(200).send(result.rows);
});

doctor_routes.get('/statistics', async (req, res) => {
    const d_id = req.session.authorization.id;

    try {
        const totalAppointments = await pool.query("SELECT COUNT(*) FROM appointment WHERE doctor_id = $1", [d_id]);
        const totalPatients = await pool.query("SELECT COUNT(DISTINCT patient_id) FROM appointment WHERE doctor_id = $1", [d_id]);
        const totalReviews = await pool.query("SELECT COUNT(*) FROM rating_review WHERE doctor_id = $1", [d_id]);
        const totalPrescriptions = await pool.query("SELECT COUNT(*) FROM prescription WHERE doctor_id = $1", [d_id]);

        const statistics = {
            total_appointments: totalAppointments.rows[0].count,
            total_patients: totalPatients.rows[0].count,
            total_reviews: totalReviews.rows[0].count,
            total_prescriptions: totalPrescriptions.rows[0].count
        };

        res.json(statistics);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).send('An error occurred while fetching statistics');
    }
});

doctor_routes.post('/edit_medical_record/:patient_id', upload.single('image'), async (req, res) => {
    const d_id = req.session.authorization.id; 
    const p_id = req.params.patient_id;
    const imageUrl = req.file ? path.join('uploads', req.file.filename) : null;
    
    try {
        const patient_type_result = await pool.query("SELECT patient_type FROM patient WHERE patient_id = $1", [p_id]);
        if (patient_type_result.rows.length === 0) {
            return res.status(404).send('Patient not found');
        }

        const patient_type = patient_type_result.rows[0].patient_type.toLowerCase();
        console.log('Patient type:', patient_type);

        let patient;
        let fields = [];
        if (patient_type === 'infant') {
            patient = 'infant';
            fields = ['notes', 'diagnosis', 'treatment', 'juandice', 'vaccination_history'];
        } else {
            patient = 'obstetrics';
            fields = ['notes', 'diagnosis', 'treatment', 'cancer_stage', 'cancer_type', 'c_treatment_period'];
        }

        const updates = [];
        const values = [];

        fields.forEach((field) => {
            if (req.body[field]) {
                updates.push(`${field} = $${updates.length + 1}`);
                values.push(req.body[field]);
            }
        });

        if (imageUrl) {
            try {
                await pool.query(
                    "INSERT INTO patient_ultraimages(patient_id, ultraimage) VALUES ($1, $2)", 
                    [p_id, imageUrl]
                );
            } catch (error) {
                console.error('Error uploading image:', error);
                return res.status(500).send('An error occurred while uploading the image');
            }
        }

    
        if (updates.length === 0) {
            return res.status(400).send('No fields to update');
        }

        values.push(p_id);

        const updateQuery = `
            UPDATE ${patient}_medical_record
            SET ${updates.join(', ')}
            WHERE patient_id = $${updates.length + 1}`;
        
        try {
            const result = await pool.query(updateQuery, values);

            // // If no rows were updated, perform an INSERT instead
            // if (result.rowCount === 0) {
            //     const insertFields = fields.filter(field => req.body[field]);
            //     const insertPlaceholders = insertFields.map((_, index) => `$${index + 2}`);
            //     const insertQuery = `
            //         INSERT INTO ${patient}_medical_record (patient_id, ${insertFields.join(', ')})
            //         VALUES ($1, ${insertPlaceholders.join(', ')})`;

            //     await pool.query(insertQuery, [p_id, ...insertFields.map(field => req.body[field])]);
            // }
            res.send('Medical record updated successfully');
        } catch (error) {
            console.error('Error updating medical record:', error);
            res.status(500).send('An error occurred while updating the medical record');
        }
    } catch (error) {
        console.error('Error retrieving patient type:', error);
        res.status(500).send('An error occurred while retrieving the patient information');
    }
});

doctor_routes.post('/add_prescription/:appointment_id', async (req, res) => {
    const appointment_id = req.params.appointment_id;
    const d_id = req.session.authorization.id;
    const p_id_result = await pool.query('SELECT patient_id FROM appointment WHERE appointment_id = $1', [appointment_id]);
    const p_id = p_id_result.rows[0].patient_id;
    const date_issue_result = await pool.query("SELECT date FROM appointment WHERE appointment_id = $1", [appointment_id]);
    const date_issue = date_issue_result.rows[0].date; // Extract the date value

    try {
        await pool.query(
            `INSERT INTO prescription (appointment_id, doctor_id, patient_id, date_issue, medication, note)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [appointment_id, d_id, p_id, date_issue, req.body.medication, req.body.note]
        );
        res.send('Prescription added successfully');
    } catch (error) {
        console.error('Error adding prescription:', error);
        res.status(500).send('An error occurred while adding the prescription');
    }
});

doctor_routes.get('/get_prescriptions/:patient_id', async (req, res) => {
const p_id = req.params.patient_id;
try {
    const result = await pool.query("SELECT * FROM prescription WHERE patient_id = $1", [p_id]);
    res.send(result.rows);
}
catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).send('An error occurred while fetching prescriptions');
}
});

doctor_routes.post('/treatment_plan/:patient_id', async (req, res) => {
    const p_id = req.params.patient_id;
    const d_id = req.session.authorization.id;
    patient_type_result = await pool.query("SELECT patient_type FROM patient WHERE patient_id = $1", [p_id]);
    let fields = ['session_date', 'cancer_stage', 'dosage', 'age', 'blood_pressure', 'heart_rate'];
    let query = 'INSERT INTO treatment_plan (patient_id, doctor_id, ';
    if(patient_type_result.rows[0].patient_type.toLowerCase() === 'infant') {
        console.log('Pediatric patient');
        fields = ['vaccination_date', 'vaccine_type', 'temprature', 'weight', 'age' , 'immune_system_status', 'heart_rate' , 'vaccination_instructions'];
        query = 'INSERT INTO infant (patient_id, doctor_id, ';
    }
    console.log('fields:', fields);
    console.log('query:', query);
    let valuesQuery = 'VALUES ($1, $2, ';
    const values = [p_id, d_id];
    let index = 3;

    fields.forEach(field => {
        if (req.body[field]) {
            query += `${field}, `;
            valuesQuery += `$${index}, `;
            values.push(req.body[field]);
            index++;
        }
    });

    // Remove the trailing comma and space
    query = query.slice(0, -2) + ') ';
    valuesQuery = valuesQuery.slice(0, -2) + ')';
    query += valuesQuery;

    try {
        const result = await pool.query(query, values);
        res.status(200).send('Treatment plan added successfully');
    } catch (error) {
        console.error('Error adding treatment plan:', error);
        res.status(500).send('An error occurred while adding the treatment plan');
    }
});


doctor_routes.put('/edit_treatment_plan/:patient_id', async (req, res) => {
    const patient_id = req.params.patient_id;
    const doctor_id = req.session.authorization.id;
    patient_type_result = await pool.query("SELECT patient_type FROM patient WHERE patient_id = $1", [p_id]);
    const fields = ['session_date', 'cancer_stage', 'dosage', 'age', 'blood_pressure', 'heart_rate'];
    let query = 'UPDATE treatment_plan SET ';
    if(patient_type_result.rows[0].patient_type.toLowerCase() === 'infant') {
        fields = ['vaccination_date', 'vaccine_type', 'temprature', 'weight', 'age' , 'immune_system_status', 'heart_rate' , 'vaccination_instructions'];
        query = 'UPDATE infant SET ';
    }
    const values = [];
    let index = 1;

    fields.forEach(field => {
        if (req.body[field]) {
            query += `${field} = $${index}, `;
            values.push(req.body[field]);
            index++;
        }
    });

    // Remove the trailing comma and space
    query = query.slice(0, -2);

    // Add the WHERE clause
    query += ` WHERE patient_id = $${index} AND doctor_id = $${index + 1}`;
    values.push(patient_id, doctor_id);

    try {
        const result = await pool.query(query, values);
        res.status(200).send('Treatment plan updated successfully');
    } catch (error) {
        console.error('Error updating treatment plan:', error);
        res.status(500).send('An error occurred while updating the treatment plan');
    }
});

doctor_routes.get('/get_cancer_treatment_plan/:patient_id', async (req, res) => {
    const patient_id = req.params.patient_id;
    const doctor_id = req.session.authorization.id;

    try {
        const result = await pool.query(
            'SELECT * FROM treatment_plan WHERE patient_id = $1 AND doctor_id = $2',
            [patient_id, doctor_id]
        );
        res.send(result.rows);
    } catch (error) {
        console.error('Error fetching treatment plan:', error);
        res.status(500).send('An error occurred while fetching the treatment plan');
    }
});

doctor_routes.post('/tracking_pregnancy/:patient_id', async (req, res) => {
    const p_id = req.params.patient_id;
    const d_id = req.session.authorization.id;
    const fields = ['date', 'pregnancy_stage', 'weight', 'age', 'blood_pressure', 'heart_rate'];
    
    let query = 'INSERT INTO patient_ultraimages (patient_id, doctor_id, ';
    let valuesQuery = 'VALUES ($1, $2, ';
    const values = [p_id, d_id];
    let index = 3;

    fields.forEach(field => {
        if (req.body[field]) {
            query += `${field}, `;
            valuesQuery += `$${index}, `;
            values.push(req.body[field]);
            index++;
        }
    });

    // Remove the trailing comma and space
    query = query.slice(0, -2) + ') ';
    valuesQuery = valuesQuery.slice(0, -2) + ')';
    query += valuesQuery;

    try {
        const result = await pool.query(query, values);
        res.status(200).send('Tracking pregnancy added successfully');
    } catch (error) {
        console.error('Error Tracking pregnancy:', error);
        res.status(500).send('An error occurred while adding the treatment plan');
    }
});

doctor_routes.put('/edit_pregnancy_tracking/:patient_id', async (req, res) => {
    const patient_id = req.params.patient_id;
    const doctor_id = req.session.authorization.id;
    const fields = ['date', 'pregnancy_stage', 'weight', 'age', 'blood_pressure', 'heart_rate'];
    
    let query = 'UPDATE patient_ultraimages SET ';
    const values = [];
    let index = 1;

    fields.forEach(field => {
        if (req.body[field]) {
            query += `${field} = $${index}, `;
            values.push(req.body[field]);
            index++;
        }
    });

    // Remove the trailing comma and space
    query = query.slice(0, -2);

    // Add the WHERE clause
    query += ` WHERE patient_id = $${index} AND doctor_id = $${index + 1}`;
    values.push(patient_id, doctor_id);

    try {
        const result = await pool.query(query, values);
        res.status(200).send('Treatment plan updated successfully');
    } catch (error) {
        console.error('Error updating treatment plan:', error);
        res.status(500).send('An error occurred while updating the treatment plan');
    }
});

doctor_routes.get('/get_pregnancy_tracking/:patient_id', async (req, res) => {
    const patient_id = req.params.patient_id;
    const doctor_id = req.session.authorization.id;

    try {
        const result = await pool.query(
            'SELECT * FROM patient_ultraimages WHERE patient_id = $1 AND doctor_id = $2',
            [patient_id, doctor_id]
        );
        res.send(result.rows);
    } catch (error) {
        console.error('Error fetching treatment plan:', error);
        res.status(500).send('An error occurred while fetching the treatment plan');
    }
});

doctor_routes.get('/infant_treatment_plan/:patient_id', async (req, res) => {
    const patient_id = req.params.patient_id;
    const doctor_id = req.session.authorization.id;

    try {
        const result = await pool.query(
            'SELECT * FROM infant WHERE patient_id = $1 AND doctor_id = $2',
            [patient_id, doctor_id]
        );
        res.send(result.rows);
    } catch (error) {
        console.error('Error fetching treatment plan:', error);
        res.status(500).send('An error occurred while fetching the treatment plan');
    }
});

doctor_routes.get('/patient_details/:id',async (req,res)=>{
    const id = req.params.id;
    const patient = await pool.query("SELECT * FROM patient WHERE patient_id = $1", [id]);
    res.send(patient.rows[0]);
});


module.exports.authenticated = doctor_routes;