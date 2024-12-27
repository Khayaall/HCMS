
const express = require('express');
const pool = require('../db_connection');
const admin_routes = express.Router();

// Create User
admin_routes.post('/create_user', async (req, res) => {
    const { role, email, password, f_name,l_name,d_id, p_id, r_id } = req.body;
    try {
        if(role.toLowerCase() == 'doctor')
        {    
            const result = await pool.query(
                "INSERT INTO doctor ( email, password, f_name, l_name, doctor_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [ email, password, f_name, l_name ,d_id]
            );
        }
        if(role.toLowerCase() == 'patient')
        {    
            const result = await pool.query(
                "INSERT INTO patient ( email, password, f_name, l_name, patient_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [ email, password, f_name, l_name,p_id ]
            );
        }
        if(role.toLowerCase() == 'receptionist')
        {
            const result = await pool.query(
                "INSERT INTO receptionist ( email, password, f_name, l_name, receptionist_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [ email, password, f_name, l_name ,r_id]
            );  
        }
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('An error occurred while creating the user');
    }
});
admin_routes.put('/approve_doctor/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("UPDATE doctor SET account_status = 'approved' WHERE doctor_id = $1 RETURNING *", [id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error approving doctor:', error);
        res.status(500).send('An error occurred while approving the doctor');
    }
});

admin_routes.put('/approve_receptionist/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("UPDATE receptionist SET account_status = 'approved' WHERE doctor_id = $1 RETURNING *", [id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error approving doctor:', error);
        res.status(500).send('An error occurred while approving the doctor');
    }
});



// Update User
admin_routes.put('/update_user/:id', async (req, res) => {
    const { id } = req.params;
    const { email, f_name, l_name, password, dob, phone, gender, address, account_status, role } = req.body;
    query = "";
    if (role.toLowerCase() == 'doctor')
    {
        query = "UPDATE doctor SET ";
    }
    if (role.toLowerCase() == 'patient')
    {
         query = "UPDATE patient SET ";
    }
    if (role.toLowerCase() == 'receptionist')
    {
         query = "UPDATE receptionist SET ";
    }
    const values = [];
    let index = 1;
    const fields = { email, f_name, l_name, password, dob, phone, gender, address, account_status };
    for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
            query += `${key} = $${index}, `;
            values.push(value);
            index++;
        }
    }
    query = query.slice(0, -2);
    query += ` WHERE ${role}_id = $${index} RETURNING *`;
    values.push(id);
    try {
        const result = await pool.query(query, values);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('An error occurred while updating the user');
    }
});

// Delete User
admin_routes.delete('/delete_user/:id', async (req, res) => {
    const { id } = req.params;

    try {
        if (id.startsWith('d'))
         {
            await pool.query("DELETE FROM doctor WHERE doctor_id = $1", [id]);
         }
        if (id.startsWith('r'))
        {
            await pool.query("DELETE FROM receptionist WHERE receptionist_id = $1", [id]);
        }
        else
        {
            await pool.query("DELETE FROM patient WHERE patient_id = $1", [id]);
        }
        res.status(204).send('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send(`An error occurred while deleting the user of id ${id}`);
    }
});

// Get All Users
admin_routes.get('/all_doctors', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM doctor");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('An error occurred while fetching users');
    }
});

admin_routes.get('/all_patients', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM patient");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('An error occurred while fetching users');
    }
});
admin_routes.get('/all_receptionists', async (req, res) => 
    {
    try {
        const result = await pool.query("SELECT * FROM receptionist");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('An error occurred while fetching users');
    }
});

admin_routes.get('/all_admins', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM admin");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('An error occurred while fetching users');
    }
});

admin_routes.get('/all_appointments', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM appointment");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send('An error occurred while fetching appointments');
    }
});

admin_routes.get('/all_prescriptions', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM prescription");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        res.status(500).send('An error occurred while fetching prescriptions');
    }
});

admin_routes.get('/all_ratings', async (req, res) => { 
    try {
        const result = await pool.query("SELECT * FROM rating_review");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching ratings:', error);
        res.status(500).send('An error occurred while fetching ratings');
    }
});

admin_routes.put('/edit_appointment/:id', async (req, res) => {
    const { id } = req.params;
    const fields =['doctor_id', 'date', 'start_time', 'end_time', 'status'];
    try {
        fields.forEach(field => {
            if (req.body[field]) {
                pool.query(`UPDATE appointment SET ${field} = $1 WHERE appointment_id = $2`, [req.body[field], id]);
            }});
        res.status(200).send('Appointment updated successfully');
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).send('An error occurred while updating the appointment');
    }
});

// Get System Statistics
admin_routes.get('/statistics', async (req, res) => {
    try {
        const doctorCount = await pool.query("SELECT COUNT(*) FROM doctor");
        const patientCount = await pool.query("SELECT COUNT(*) FROM patient");
        const receptionistCount = await pool.query("SELECT COUNT(*) FROM receptionist");
        const prescriptionCount = await pool.query("SELECT COUNT(*) FROM prescription");
        const appointmentCount = await pool.query("SELECT COUNT(*) FROM appointment");
        res.status(200).json({
            doctorCount: doctorCount.rows[0].count,
            patientCount: patientCount.rows[0].count,
            receptionistCount: receptionistCount.rows[0].count,
            prescriptionCount: prescriptionCount.rows[0].count,
            appointmentCount: appointmentCount.rows[0].count
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).send('An error occurred while fetching statistics');
    }
});



module.exports.authenticated = admin_routes;