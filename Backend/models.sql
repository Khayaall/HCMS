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
    gender   char,
    address  text
);



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
    gender         char(10),
    experience     text,
    address        text,
    specialty      varchar(100),
    about_me       text,
    opening_hours  varchar(20),
    account_status varchar(50)
);



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
    gender       char(10),
    address      text
);


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
    gender          char,
    address         text,
    account_status  varchar(50)  not null
);


create table appointment
(
    appointment_id serial
        primary key,
    patient_id     integer
        references patient
            on delete cascade,
    doctor_id      varchar(50)
        constraint appointment_doctor_doctor_id_fk
            references doctor,
    date           date not null,
    time           time not null,
    diagnosis      text,
    treatment      text
);


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
    medication      text not null,
    note            text
);



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


create table obstetrics_medical_record
(
    record_id               serial
        primary key,
    patient_id              integer
        references patient
            on delete cascade,
    patient_type            varchar(50),
    diagnosis               text,
    notes                   text,
    treatment               text,
    patient_history         text,
    ultra_image             bytea,
    pregnancy_stage         varchar(50),
    labor_method            varchar(50),
    menstrual_cycle_details text,
    no_of_births            varchar(2),
    cancer_stage            varchar(2),
    cancer_type             varchar(50),
    c_treatment_period      varchar(2)
);


