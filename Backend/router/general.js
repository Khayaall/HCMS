const pool = require('../db_connection');
const express = require('express');
const jwt = require('jsonwebtoken');
const public_users = express.Router();
const session = require('express-session')

public_users.post('/signup', async (req, res) => {
    try {
        const { email, password, role, f_name, l_name , speciality} = req.body;
        if (!email || !password || !role || !f_name || !l_name) {
            return res.status(400).send("Please fill in all the fields");
        }
        if(role.toLowerCase() == 'doctor')
        {
            const { email, password, role, f_name, l_name, d_id } = req.body;
            if ((d_id.startsWith('dr') == false || d_id.length <= 5)) {
                return res.status(400).send("Please enter a vaild doctor id");
            }
            const ids = await pool.query("SELECT * FROM doctor WHERE doctor_id = $1", [d_id]);
            if (ids.rows.length > 0) {
                return res.status(400).send("Doctor id already exists");
            }
            const user = await pool.query("SELECT * FROM doctor WHERE email = $1", [email]);
            if (user.rows.length > 0) 
            {
                return res.status(400).send("doctor already exists");
            }
            else
            {
                const newUser = await pool.query("INSERT INTO doctor (f_name, l_name, email, password, account_status, doctor_id, specialty) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [f_name, l_name, email, password, 'pending', d_id, speciality]);
                return res.json("doctor added waiting for admin approval");
            }
        }
        if(role.toLowerCase() == 'patient')
            {
                const { email, password, role, f_name, l_name,patient_type } = req.body;
                const user = await pool.query("SELECT * FROM patient WHERE email = $1", [email]);
                if (user.rows.length > 0) 
                {
                    return res.status(400).send("patient already exists");
                }
                else
                {
                    const newUser = await pool.query("INSERT INTO patient (f_name, l_name, email, password, patient_type) VALUES ($1, $2, $3, $4, $5) RETURNING *", [f_name, l_name, email, password, patient_type]);
                    if(patient_type.toLowerCase() == 'obstetrics' || patient_type.toLowerCase() == 'obstetric')
                    {
                        await pool.query("INSERT INTO obstetrics_medical_record(patient_id) VALUES ($1)", [newUser.rows[0].patient_id]);
                    }
                    else
                    {
                        await pool.query("INSERT INTO infant_medical_record(patient_id) VALUES ($1)", [newUser.rows[0].patient_id]);
                    }
                    return res.json("patient added succesfuly");
                }
            }
        if(role.toLowerCase() == 'receptionist')
            {   
                const { email, password, role, f_name, l_name, r_id } = req.body;
                if (r_id.startsWith('re') == false || r_id.length < 5) {
                    return res.status(400).send("Please enter a vaild doctor id");
                }
                const ids = await pool.query("SELECT * FROM receptionist WHERE receptionist_id = $1", [r_id]);
                if (ids.rows.length > 0) {
                    return res.status(400).send("receptionist id already exists");
                }
                const user = await pool.query("SELECT * FROM receptionist WHERE email = $1", [email]);
                if (user.rows.length > 0) 
                {
                    return res.status(400).send("receptionist already exists");
                }
                else
                {
                    const newUser = await pool.query("INSERT INTO receptionist (f_name, l_name, email, password, account_status, receptionist_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [f_name, l_name, email, password, 'pending', r_id]);
                    return res.json("receptionist added waiting for admin approval");
                }
            }
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

public_users.post('/login', async (req, res) => {
    try {
        const { role } = req.body;
        if (!role) {
            return res.status(400).send("Please specify a role.");
        }

        let user;
        if (role.toLowerCase() === 'patient') {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).send("Please fill in all the fields.");
            }
            user = await pool.query("SELECT * FROM patient WHERE email = $1", [email]);
            if (user.rows.length === 0 || user.rows[0].password !== password) {
                return res.status(400).send("Invalid Credentials");
            }
        } 
        else if (role.toLowerCase() === 'doctor') {
            const { d_id, password } = req.body;
            if (!d_id || !password) {
                return res.status(400).send("Please fill in all the fields.");
            }
            user = await pool.query("SELECT * FROM doctor WHERE doctor_id = $1", [d_id]);
            if (user.rows.length === 0 || user.rows[0].password !== password) {
                return res.status(400).send("Invalid Credentials");
            }
        } 
        else if (role.toLowerCase() === 'receptionist') {
            const { r_id, password } = req.body;
            if (!r_id || !password) {
                return res.status(400).send("Please fill in all the fields.");
            }
            user = await pool.query("SELECT * FROM receptionist WHERE receptionist_id = $1", [r_id]);
            if (user.rows.length === 0 || user.rows[0].password !== password) {
                return res.status(400).send("Invalid Credentials");
            }
        } 
        else if (role.toLowerCase() === 'admin') {
            const { a_id, password } = req.body;
            if (!a_id || !password) {
                return res.status(400).send("Please fill in all the fields.");
            }
            user = await pool.query("SELECT * FROM admin WHERE admin_id = $1", [a_id]);
            if (user.rows.length === 0 || user.rows[0].password !== password) {
                return res.status(400).send("Invalid Credentials");
            }
        } 
        else {
            return res.status(400).send("Invalid role specified");
        }

        // Create JWT with user info and role
        let token = jwt.sign({ username: user.rows[0].f_name, role: role}, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = { accessToken: token, user: user.rows[0].f_name, role: role, id: user.rows[0].doctor_id || user.rows[0].patient_id || user.rows[0].receptionist_id || user.rows[0].admin_id };
        return res.status(200).json({ 
            message: `${req.session.authorization.user} logged in successfully`,
            token: token,
            role: req.session.authorization.role,
            id: req.session.authorization.id    
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

public_users.get('/statistics', async (req, res) => {
    try {
        const totalPatients = await pool.query("SELECT COUNT(*) AS total_patients FROM patient");
        const totalAppointments = await pool.query("SELECT COUNT(*) AS total_appointments FROM appointment");
        const totalDoctors = await pool.query("SELECT COUNT(*) AS total_doctors FROM doctor");
        const totalReviews = await pool.query("SELECT COUNT(*) AS total_reviews FROM rating_review");

        const statistics = {
            total_patients: totalPatients.rows[0].total_patients,
            total_appointments: totalAppointments.rows[0].total_appointments,
            total_doctors: totalDoctors.rows[0].total_doctors,
            total_reviews: totalReviews.rows[0].total_reviews
        };

        res.json(statistics);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).send('An error occurred while fetching statistics');
    }
});













module.exports.general = public_users;