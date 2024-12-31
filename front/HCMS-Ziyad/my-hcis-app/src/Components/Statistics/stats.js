import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faFaceSmile } from "@fortawesome/free-regular-svg-icons";
import {
  faClipboardList,
  faStethoscope,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export const stats = [
  {
    id: 1,
    title: "Appointments",
    value: "10.1k",
    icon: faCalendar,
  },
  {
    id: 2,
    title: "Total Patients",
    value: "5.8k",
    icon: faUser,
  },
  {
    id: 3,
    title: "Total Doctors",
    value: "1.2k",
    icon: faStethoscope,
  },
  {
    id: 4,
    title: "Total Reviews",
    value: "50k",
    icon: faFaceSmile,
  },
  {
    id: 5,
    title: "Total Vaccines",
    value: "4.5k",
    icon: faClipboardList,
  },
];
