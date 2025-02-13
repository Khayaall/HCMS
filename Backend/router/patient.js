const express = require("express");
const patient_routes = express.Router();
const pool = require("../db_connection");
// const Joi =  require("joi");
patient_routes.use(express.json());
const multer = require("multer");
const path = require("path");
var format = require("pg-format");

const parentDir = path.dirname(__dirname);
const uploadsDir = path.join(parentDir, "uploads");
// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

module.exports.authenticated = patient_routes;

patient_routes.get("/", async (req, res) => {
  const actual_patient_id = req.session.authorization.id;
  try {
    const patient = await pool.query(
      "SELECT * FROM patient WHERE patient_id = $1",
      [actual_patient_id]
    );
    return res.status(200).send(patient.rows[0]);
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    return res
      .status(500)
      .send("An error occurred while fetching the patient profile.");
  }
});

patient_routes.get("/recent-doctors", async (req, res) => {
  try {
    const actual_patient_id = req.session.authorization.id;
    const recent_doctors = await pool.query(
      "SELECT * FROM doctor WHERE doctor_id = (SELECT DISTINCT doctor_id FROM appointment WHERE patient_id = $1);",
      [actual_patient_id]
    );
    return res.status(200).send(recent_doctors.rows);
  } catch (error) {
    console.error("Error fetching recent doctors:", error);
    return res
      .status(500)
      .send("An error occurred while fetching recent doctors of patient.");
  }
});

patient_routes.get("/appointments", async (req, res) => {
  try {
    const actual_patient_id = req.session.authorization.id;
    const appointments = await pool.query(
      "SELECT * FROM appointment WHERE patient_id = $1;",
      [actual_patient_id]
    );
    return res.status(200).send(appointments.rows);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res
      .status(500)
      .send("An error occurred while fetching appointments of patient.");
  }
});

patient_routes.get("/browse-doctors", async (req, res) => {
  try {
    const actual_patient_id = req.session.authorization.id;
    const type_doctors = await pool.query(
      "SELECT * FROM doctor WHERE specialty = (SELECT patient_type FROM patient WHERE patient_id = $1);",
      [actual_patient_id]
    );
    return res.status(200).send(type_doctors.rows);
  } catch (error) {
    console.error("Error fetching same-type doctors:", error);
    return res
      .status(500)
      .send("An error occurred while fetching same-type doctors of patient.");
  }
});

patient_routes.get("/browse-selected-doctors/:type", async (req, res) => {
  try {
    const type = req.params.type;
    const type_doctors = await pool.query(
      "SELECT * FROM doctor WHERE specialty = $1;",
      [type]
    );
    return res.status(200).send(type_doctors.rows);
  } catch (error) {
    console.error("Error fetching selected doctors:", error);
    return res
      .status(500)
      .send("An error occurred while fetching selected doctors.");
  }
});

patient_routes.get("/prescriptions", async (req, res) => {
  try {
    const actual_patient_id = req.session.authorization.id;
    const prescriptions = await pool.query(
      "SELECT * FROM prescription WHERE patient_id = $1;",
      [actual_patient_id]
    );
    return res.status(200).send(prescriptions.rows);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return res
      .status(500)
      .send("An error occurred while fetching prescriptions of patient.");
  }
});

patient_routes.get("/view-image", async (req, res) => {
  const actual_patient_id = req.session.authorization.id;

  try {
    const result = await pool.query(
      "SELECT image_url FROM patient WHERE patient_id = $1",
      [actual_patient_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Image not found");
    }
    const imageUrl = result.rows[0].image_url;
    return res.status(200).sendFile(path.join(parentDir, imageUrl));
  } catch (error) {
    console.error("Error viewing image:", error);
    res.status(500).send("An error occurred while viewing patient's image.");
  }
});

patient_routes.get("/ultra-images", async (req, res) => {
  try {
    const p_id = req.session.authorization.id;
    const ultra_images = await pool.query(
      "SELECT * FROM patient_ultraimages WHERE patient_id = $1;",
      [p_id]
    );
    if (ultra_images.rows.length === 0) {
      return res.status(404).send("No images found.");
    }
    return res.status(200).send(ultra_images.rows);
  } catch (error) {
    console.error("Error fetching ultra images:", error);
    return res
      .status(500)
      .send("An error occured while fetching patient's ultra images");
  }
});

patient_routes.get("/medical-record", async (req, res) => {
  const p_id = req.session.authorization.id;
  const type = await pool.query(
    "SELECT patient_type FROM patient WHERE patient_id = $1;",
    [p_id]
  );
  try {
    const result = await pool.query(
      format(
        "SELECT * FROM %s_medical_record WHERE patient_id = %s",
        type.rows[0].patient_type,
        p_id
      )
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Medical record not found");
    }
    return res.status(200).send(result.rows);
  } catch (error) {
    console.error("Error viewing medical record:", error);
    return res
      .status(500)
      .send("An error occurred while fetching patient's medical record");
  }
});

patient_routes.get("/statistics", async (req, res) => {
  const p_id = req.session.authorization.id;
  try {
    const total_doctors = await pool.query(
      "SELECT COUNT(*) FROM doctor WHERE doctor_id = (SELECT DISTINCT doctor_id FROM appointment WHERE patient_id = $1);",
      [p_id]
    );
    const total_appointments = await pool.query(
      "SELECT COUNT(*) FROM appointment WHERE patient_id = $1;",
      [p_id]
    );
    const total_reviews = await pool.query(
      "SELECT COUNT(*) FROM rating_review WHERE patient_id = $1;",
      [p_id]
    );
    const total_ultraimages = await pool.query(
      "SELECT COUNT(*) from patient_ultraimages WHERE patient_id = $1;",
      [p_id]
    );
    res.status(200).send({
      Total_doctors: total_doctors.rows[0].count,
      Total_appointments: total_appointments.rows[0].count,
      Total_reviews: total_reviews.rows[0].count,
      Total_ultra_images: total_ultraimages.rows[0].count,
    });
  } catch (error) {
    console.error("Error viewing statistics:", error);
    return res
      .status(500)
      .send("An error occurred while fetching patient's the statistics");
  }
});

patient_routes.get("/doctors", async (req, res) => {
  try {
    const doctors = await pool.query("SELECT * FROM doctor");
    return res.status(200).send(doctors.rows);
  } catch (error) {
    console.error("Error fetching all doctors:", error);
    return res.status(500).send("An error occurred while fetching all doctors");
  }
});

patient_routes.get("/treatment-plan", async (req, res) => {
  try {
    const p_id = req.session.authorization.id;
    const type = await pool.query(
      "SELECT patient_type FROM patient WHERE patient_id = $1",
      [p_id]
    );
    if (type === "obstetrics") {
      const result = await pool.query(
        "SELECT * FROM cancer_treatment_plan WHERE patient_id = $1",
        [p_id]
      );
      return res.status(200).send(result.rows);
    } else {
      const result = await pool.query(
        "SELECT * FROM infant WHERE patient_id = $1",
        [p_id]
      );
      return res.status(200).send(result.rows);
    }
  } catch (error) {
    console.error("Error fetching treatment plan:", error);
    return res
      .status(500)
      .send("An error occurred while fetching patient's treatment plan.");
  }
});

patient_routes.get("/selected-ratings/:type", async (req, res) => {
  try {
    const type = req.params.type;
    const result = await pool.query(
      "SELECT d.doctor_id, AVG(rr.rating) AS avg_rating FROM doctor d LEFT JOIN rating_review rr ON d.doctor_id = rr.doctor_id WHERE d.specialty = $1 GROUP BY d.doctor_id;",
      [type]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("No ratings found.");
    }
    return res.status(200).send(result.rows);
  } catch (error) {
    console.error("Error fetching selected ratings:", error);
    return res
      .status(500)
      .send("An error occurred while fetching selected ratings.");
  }
});

patient_routes.put("/edit-profile", async (req, res) => {
  const actual_patient_id = req.session.authorization.id;
  const fields = [
    "f_name",
    "l_name",
    "email",
    "password",
    "dob",
    "phone",
    "gender",
    "address",
  ];
  var c = 0;
  try {
    for await (const field of fields) {
      if (req.body[field]) {
        await pool.query(
          `UPDATE patient SET ${field} = $1 WHERE patient_id = $2`,
          [req.body[field], actual_patient_id]
        );
        c++;
      }
    }
  } catch (error) {
    console.error("Error editing patient's details:", error);
    return res.status(500).send("An error occurred while updating profile");
  }
  if (c === 0) {
    return res.status(400).send("No fields to update");
  }
  return res.status(200).send("Profile successfully edited");
});

patient_routes.put("/edit-medical-record", async (req, res) => {
  const actual_patient_id = req.session.authorization.id;
  const type = await pool.query(
    "SELECT patient_type FROM patient WHERE patient_id = $1;",
    [actual_patient_id]
  );
  var c = 0;
  try {
    if (type.rows[0].patient_type.toLowerCase() === "infant") {
      if (
        (
          await pool.query(
            "SELECT * FROM infant_medical_record WHERE patient_id = $1",
            [actual_patient_id]
          )
        ).rows.length === 0
      ) {
        return res.status(404).send("Medical record not found.");
      }
      const fields = [
        "birth_weight",
        "feeding_method",
        "vaccination_history",
        "patient_history",
      ];
      for await (const field of fields) {
        if (req.body[field]) {
          await pool.query(
            `UPDATE infant_medical_record SET ${field} = $1 WHERE patient_id = $2`,
            [req.body[field].toLowerCase(), actual_patient_id]
          );
          c++;
        }
      }
    }
    if (type.rows[0].patient_type.toLowerCase() === "obstetrics") {
      if (
        (
          await pool.query(
            "SELECT * FROM obstetrics_medical_record WHERE patient_id = $1",
            [actual_patient_id]
          )
        ).rows.length === 0
      ) {
        return res.status(404).send("Medical record not found.");
      }
      const fields = [
        "patient_type",
        "patient_history",
        "labor_method",
        "no_of_births",
        "menstrual_cycle_details",
      ];
      for await (const field of fields) {
        if (req.body[field]) {
          await pool.query(
            `UPDATE obstetrics_medical_record SET ${field} = $1 WHERE patient_id = $2`,
            [req.body[field].toLowerCase(), actual_patient_id]
          );
          c++;
        }
      }
    }
  } catch (error) {
    console.error("Error editing patient's medical record:", error);
    return res
      .status(500)
      .send("An error occurred while updating medical record.");
  }
  if (c === 0) {
    return res.status(400).send("No fields to update.");
  }
  return res.status(200).send("Medical record successfully edited.");
});

patient_routes.post("/new-appointment", async (req, res) => {
  const { doctor_id, date, start_time } = req.body;
  const patient_id = req.session.authorization.id;

  try {
    // Construct Date object for the appointment start time
    const appointmentStartDateTime = new Date(`${date}T${start_time}`);

    // Check if the constructed start date is valid
    if (isNaN(appointmentStartDateTime.getTime())) {
      return res.status(400).send("Invalid date or time format.");
    }

    // Calculate the end time by adding 30 minutes to the start time
    const appointmentEndDateTime = new Date(
      appointmentStartDateTime.getTime() + 30 * 60000
    );

    // Check if the appointment date and time are in the past
    const now = new Date();
    if (appointmentStartDateTime < now) {
      return res
        .status(400)
        .send("Appointment date and time cannot be in the past.");
    }

    // Check if the doctor exists
    const doctor = await pool.query(
      "SELECT * FROM doctor WHERE doctor_id = $1;",
      [doctor_id]
    );
    if (doctor.rows.length === 0) {
      return res.status(404).send("Doctor not found.");
    }

    // Check if the appointment is within the doctor's working hours
    const { start_time: doctor_start_time, end_time: doctor_end_time } =
      doctor.rows[0];
    const doctorStartDateTime = new Date(`${date}T${doctor_start_time}:00`);
    const doctorEndDateTime = new Date(`${date}T${doctor_end_time}:00`);

    if (
      appointmentStartDateTime < doctorStartDateTime ||
      appointmentEndDateTime > doctorEndDateTime
    ) {
      return res
        .status(400)
        .send("Appointment time is outside the doctor's working hours.");
    }

    // Check for conflicting appointments
    const conflictingAppointments = await pool.query(
      "SELECT * FROM appointment WHERE doctor_id = $1 AND date = $2 AND ((start_time <= $3 AND end_time > $3) OR (start_time < $4 AND end_time >= $4));",
      [
        doctor_id,
        date,
        start_time,
        appointmentEndDateTime.toTimeString().slice(0, 8),
      ]
    );
    if (conflictingAppointments.rows.length > 0) {
      return res.status(400).send("The chosen time slot is not available.");
    }

    var appointment_id = await pool.query(
      "SELECT MAX(appointment_id) FROM appointment;"
    );
    appointment_id = appointment_id.rows[0].max + 1;
    // Insert the new appointment
    const newAppointment = await pool.query(
      "INSERT INTO appointment (appointment_id,patient_id, doctor_id, date, start_time, end_time, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;",
      [
        appointment_id,
        patient_id,
        doctor_id,
        date,
        start_time,
        appointmentEndDateTime.toTimeString().slice(0, 8),
        "Scheduled",
      ]
    );

    return res.status(200).send(newAppointment.rows[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send("An error occurred while scheduling the appointment.");
  }
});

patient_routes.post(
  "/upload-image",
  upload.single("image"),
  async (req, res) => {
    const actual_patient_id = req.session.authorization.id;
    const imageUrl = path.join("uploads", req.file.filename);

    try {
      await pool.query(
        "UPDATE patient SET image_url = $1 WHERE patient_id = $2",
        [imageUrl, actual_patient_id]
      );
      return res.status(200).send("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      return res
        .status(500)
        .send("An error occurred while uploading the image");
    }
  }
);

patient_routes.get("/doctor/:doctorId", async (req, res) => {
  const doctorId = req.params.doctorId;
  try {
    const doctor = await pool.query(
      "SELECT * FROM doctor WHERE doctor_id = $1",
      [doctorId]
    );
    return res.status(200).send(doctor.rows[0]);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return res.status(500).send("An error occurred while fetching the doctor");
  }
});
