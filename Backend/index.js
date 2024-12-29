// index.js
const express = require('express');
const doctor_routes = require('./router/doctor.js').authenticated;
const patient_routes = require('./router/patient.js').authenticated;
const admin_routes = require('./router/admin.js').authenticated;
const receptionist_routes = require('./router/receptionist.js').authenticated;
const gen_routes = require('./router/general.js').general;
const authMiddleware = require('./middlewares/auth');
const sessionMiddleware = require('./middlewares/session');
const sessionDataMiddleware = require('./middlewares/sessionDataMiddleware');
const roleAuth = require('./middlewares/roleAuth'); 
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors()); // Allow all origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sessionMiddleware);
app.use(sessionDataMiddleware); 
const PORT = 5000;

// Routes with role-based access control
app.use("/doctor", authMiddleware, roleAuth('doctor'), doctor_routes);  
app.use("/patient", authMiddleware, roleAuth('patient'), patient_routes);  
app.use("/receptionist", authMiddleware, roleAuth('receptionist'), receptionist_routes);  
app.use("/admin", authMiddleware, roleAuth('admin'), admin_routes);  

// General routes (accessible by everyone)
app.use("/", gen_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
