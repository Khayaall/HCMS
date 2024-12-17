// index.js
const express = require('express');
const doctor_routes = require('./router/doctor.js').authenticated;
const patient_routes = require('./router/patient.js').authenticated;
const admin_routes = require('./router/admin.js').authenticated;
const receptionist_routes = require('./router/receptionist.js').authenticated;
const gen_routes = require('./router/general.js').general;
const authMiddleware = require('./middlewares/auth');
const sessionMiddleware = require('./middlewares/session');
const roleAuth = require('./middlewares/roleAuth'); 
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(sessionMiddleware);
const PORT = 5000;

// Routes with role-based access control
app.use("/doctor", authMiddleware, roleAuth('doctor'), doctor_routes);  
app.use("/patient", authMiddleware, roleAuth('patient'), patient_routes);  
app.use("/receptionist", authMiddleware, roleAuth('receptionist'), receptionist_routes);  
app.use("/admin", authMiddleware, roleAuth('admin'), admin_routes);  

// General routes (accessible by everyone)
app.use("/", gen_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
