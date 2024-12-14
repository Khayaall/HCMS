CREATE TABLE Admin (
    Admin_ID SERIAL PRIMARY KEY,
    F_Name VARCHAR(50) NOT NULL,
    L_Name VARCHAR(50) NOT NULL,
    Email VARCHAR(150) UNIQUE NOT NULL,
    Password VARCHAR(100) NOT NULL,
    Phone VARCHAR(15),
    DOB DATE,
    Gender CHAR(10),
    Address TEXT
);
CREATE TABLE Doctor (
    Doctor_ID SERIAL PRIMARY KEY,
    F_Name VARCHAR(50) NOT NULL,
    L_Name VARCHAR(50) NOT NULL,
    Email VARCHAR(150) UNIQUE NOT NULL,
    Password varchar(100) NOT NULL,
    DOB DATE,
    Phone VARCHAR(15),
    Gender CHAR(10),
    Experience INT,
    Address TEXT,
    Specialty VARCHAR(100)
);
CREATE TABLE Patient (
    Patient_ID SERIAL PRIMARY KEY,
    Patient_Type varchar(50) NOT NULL,
    F_Name VARCHAR(50) NOT NULL,
    L_Name VARCHAR(50) NOT NULL,
    Email VARCHAR(150) UNIQUE NOT NULL,
    Password VARCHAR(100) NOT NULL,
    Phone VARCHAR(15),
    DOB DATE,
    Gender CHAR(10),
    Address TEXT
);
CREATE TABLE Receptionist (
    Receptionist_ID SERIAL PRIMARY KEY,
    F_Name VARCHAR(50) NOT NULL,
    L_Name VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(100) NOT NULL,
    Phone VARCHAR(15),
    DOB DATE,
    Gender CHAR(1),
    Address TEXT
);
CREATE TABLE Appointment (
    Appointment_ID SERIAL PRIMARY KEY,
    Patient_ID INT REFERENCES Patient(Patient_ID) ON DELETE CASCADE,
    Doctor_ID INT REFERENCES Doctor(Doctor_ID) ON DELETE SET NULL,
    Date DATE NOT NULL,
    Time TIME NOT NULL
);
CREATE TABLE Prescription (
    Prescription_ID SERIAL PRIMARY KEY,
    Appointment_ID INT REFERENCES Appointment(Appointment_ID) ON DELETE CASCADE,
    Doctor_ID INT REFERENCES Doctor(Doctor_ID) ON DELETE CASCADE,
    Patient_ID INT REFERENCES Patient(Patient_ID) ON DELETE CASCADE,
    Date_Issue DATE NOT NULL,
    Medication TEXT NOT NULL,
    Note TEXT
);
CREATE TABLE Rating_Review (
    Review_ID SERIAL PRIMARY KEY,
    Patient_ID INT REFERENCES Patient(Patient_ID) ON DELETE CASCADE,
    Doctor_ID INT REFERENCES Doctor(Doctor_ID) ON DELETE CASCADE,
    Date_Issue DATE,
    Rating FLOAT CHECK (Rating BETWEEN 1 AND 5),
    Comment TEXT
);
CREATE TABLE Infant_Medical_Record (
    Record_ID SERIAL PRIMARY KEY,
    Patient_ID INT REFERENCES Patient(Patient_ID) ON DELETE CASCADE,
    Diagnosis TEXT,
    Notes TEXT,
    Treatment TEXT,
    Patient_History TEXT,
    Allergies TEXT,
    Vaccination_History TEXT,
    Birth_Weight VARCHAR(50),
    Juandice VARCHAR(50),
    Feeding_method VARCHAR(50)
);
CREATE TABLE Obstetrics_Medical_Record (
    Record_ID SERIAL PRIMARY KEY,
    Patient_ID INT REFERENCES Patient(Patient_ID) ON DELETE CASCADE,
    Patient_Type VARCHAR(50),
    Diagnosis TEXT,
    Notes TEXT,
    Treatment TEXT,
    Patient_History TEXT,
    Ultra_Image BYTEA,
    Pregnancy_Stage VARCHAR(50),
    Labor_Method VARCHAR(50),
    Menstrual_Cycle_Details TEXT,
    No_Of_Births VARCHAR(2),
    Cancer_Stage VARCHAR(2),
    Cancer_Type VARCHAR(50),
    C_Treatment_Period varchar(2)
);
