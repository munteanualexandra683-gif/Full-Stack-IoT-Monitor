# Full-Stack IoT Environmental Monitor

An end-to-end IoT telemetry system designed to monitor, filter, and transmit real-time voltage and temperature data. Co-built this project to bridge the gap between embedded hardware design and backend web development.

## Overview
This project utilizes an ESP32 microcontroller to collect environmental data. The hardware filters analog noise and packages the readings into JSON payloads, which are transmitted wirelessly to a custom RESTful API hosted on a Raspberry Pi. The backend logs the data persistently in an SQLite database and serves a live web dashboard for local network monitoring.

## Tech Stack & Skills
*   **Hardware:** ESP32, TH06 Temperature Sensor (I2C), Voltage Divider, LEDs, Active Buzzer
*   **Backend:** Python, Flask, REST APIs, SQLite
*   **Frontend:** HTML, JavaScript (Chart.js for live graphing), dynamic fetching
*   **Features:** Hardware noise filtering, Wi-Fi telemetry, local alarm logic, device health tracking (Uptime/RSSI), and automated CSV data exporting.

## Dashboard & Hardware

<img width="1536" height="2048" alt="WhatsApp Image 2026-08-13 at 1 10 04 PM (2)" src="https://github.com/user-attachments/assets/76953585-2340-4724-bdbd-c271264fce39" />

<img width="1919" height="906" alt="Screenshot 2026-08-17 104922" src="https://github.com/user-attachments/assets/17afacc4-e008-4e75-b9cc-a29456489e1b" />


<img width="773" height="581" alt="WhatsApp Image 2026-08-13 at 1 10 05 PM (1)" src="https://github.com/user-attachments/assets/5a565ae4-58fd-4048-a6e4-f6af70a424b7" />

<img width="828" height="654" alt="WhatsApp Image 2026-08-13 at 1 10 05 PM" src="https://github.com/user-attachments/assets/6b6de4fe-4e15-4499-aec1-258a6030f059" />
