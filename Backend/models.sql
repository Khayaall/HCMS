create table admin
(
    admin_id serial
        primary key,
    f_name   varchar(50)  not null,
    l_name   varchar(50)  not null,
    email    varchar(150) not null
        unique,
    password varchar(100) not null,
    phone    varchar(15),
    dob      date,
    gender   varchar(10),
    address  text
);

alter table admin
    owner to postgres;

create table doctor
(
    doctor_id      varchar(50)  not null
        primary key,
    f_name         varchar(50)  not null,
    l_name         varchar(50)  not null,
    email          varchar(150) not null
        unique,
    password       varchar(100) not null,
    dob            date,
    phone          varchar(15),
    gender         varchar(10),
    experience     text,
    address        text,
    specialty      varchar(100),
    about_me       text,
    start_time     time,
    account_status varchar(50),
    image_url      text,
    education      text,
    end_time       time
);

alter table doctor
    owner to postgres;

create table patient
(
    patient_id   serial
        primary key,
    patient_type varchar(50)  not null,
    f_name       varchar(50)  not null,
    l_name       varchar(50)  not null,
    email        varchar(150) not null
        unique,
    password     varchar(100) not null,
    phone        varchar(15),
    dob          date,
    gender       varchar(10),
    address      text,
    job          text,
    image_url    text
);

alter table patient
    owner to postgres;

create table receptionist
(
    receptionist_id varchar(50)  not null
        primary key,
    f_name          varchar(50)  not null,
    l_name          varchar(50)  not null,
    email           varchar(100) not null
        unique,
    password        varchar(100) not null,
    phone           varchar(15),
    dob             date,
    gender          varchar(10),
    address         text,
    account_status  varchar(50)  not null
);

alter table receptionist
    owner to postgres;

create table appointment
(
    appointment_id serial
        primary key,
    patient_id     integer
        references patient
            on delete cascade
        constraint fk_patient
            references patient
            on delete cascade,
    doctor_id      varchar(50)
        constraint appointment_doctor_doctor_id_fk
            references doctor,
    date           date not null,
    start_time     time not null,
    diagnosis      text,
    treatment      text,
    end_time       time,
    status         text
);

alter table appointment
    owner to postgres;

create table prescription
(
    prescription_id serial
        primary key,
    appointment_id  integer
        references appointment
            on delete cascade,
    doctor_id       varchar(50)
        constraint prescription_doctor_doctor_id_fk
            references doctor,
    patient_id      integer
        references patient
            on delete cascade,
    date_issue      date not null,
    medication      text,
    note            text
);

alter table prescription
    owner to postgres;

create table rating_review
(
    review_id  serial
        primary key,
    patient_id integer
        references patient
            on delete cascade,
    doctor_id  varchar(50)
        constraint rating_review_doctor_doctor_id_fk
            references doctor,
    date_issue date,
    rating     double precision
        constraint rating_review_rating_check
            check ((rating >= (1)::double precision) AND (rating <= (5)::double precision)),
    comment    text
);

alter table rating_review
    owner to postgres;

create table infant_medical_record
(
    record_id           serial
        primary key,
    patient_id          integer
        references patient
            on delete cascade,
    diagnosis           text,
    notes               text,
    treatment           text,
    patient_history     text,
    allergies           text,
    vaccination_history text,
    birth_weight        varchar(50),
    juandice            varchar(50),
    feeding_method      varchar(50)
);

alter table infant_medical_record
    owner to postgres;

create table obstetrics_medical_record
(
    record_id               serial
        primary key,
    patient_id              integer
        constraint unique_patient_id
            unique
        references patient
            on delete cascade,
    patient_type            varchar(50),
    diagnosis               text,
    notes                   text,
    treatment               text,
    patient_history         text,
    pregnancy_stage         varchar(50),
    labor_method            varchar(50),
    menstrual_cycle_details text,
    no_of_births            varchar(2),
    cancer_stage            varchar(2),
    cancer_type             varchar(50),
    c_treatment_period      varchar(2)
);

alter table obstetrics_medical_record
    owner to postgres;

create table patient_ultraimages
(
    patient_id      integer
        constraint patient_patient_id_fk
            references patient,
    ultraimage      text,
    pregnancy_stage text,
    age             integer,
    weight          text,
    pressure        text,
    heart_rate      integer,
    doctor_id       text
        constraint patient_ultraimages_doctor_doctor_id_fk
            references doctor
);

alter table patient_ultraimages
    owner to postgres;

create table cancer_treatment_plan
(
    session_date   date,
    cancer_stage   text,
    treatment_type text,
    dosage         text,
    age            integer,
    blood_pressure text,
    heart_rate     integer,
    patient_id     integer
        constraint cancer_treatment_plan_patient_patient_id_fk
            references patient,
    doctor_id      text
        constraint cancer_treatment_plan_doctor_doctor_id_fk
            references doctor
);

alter table cancer_treatment_plan
    owner to postgres;

create table infant
(
    patient_id               integer
        constraint infant_patient_patient_id_fk
            references patient,
    doctor_id                text
        constraint infant_doctor_doctor_id_fk
            references doctor,
    vaccination_date         date,
    vaccine_type             text,
    weight                   text,
    temprature               text,
    age                      integer,
    vaccination_instructions text,
    immune_system_status     text,
    heart_rate               integer
);

alter table infant
    owner to postgres;

