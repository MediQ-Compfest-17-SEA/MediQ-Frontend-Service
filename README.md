# Welcome to MediQ FE🩺
A real-time queue management system for clinics and hospitals, built with React Native (Expo) and Socket.IO.

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
  
## 🌍 Overview
MediQ is a **SaaS platform** for Health Facilities (Hospitals, Clinics, Pharmacies) to enable:  
- Faster Patient Registration  
- Automated Queue Management  
- Real-time Monitoring & Leaderboard Displays  

It uses **OCR (Optical Character Recognition)** to scan patient IDs, and **WebSocket (Socket.IO)** for live updates.
For more information please visit this documentation https://docs.google.com/document/d/1VNrx0CQD5U2tLe1vzBbh80MWr4pG7xw5spXGc2PmkUM/view?usp=sharing

## 💡 Key Features
- 📷 OCR-based patient ID scanning
- ⏱️ Real-time queue tracking with WebSocket (Socket.IO)
- 📊 Leaderboard display for TV/monitor
- 🔒 Role-based access (Admin, User, Public Leaderboard)
- 📱 Cross-platform (iOS, Android, Web via Expo)

## </> Tech Stack
- Frontend: React Native (Expo), React Navigation, Expo Router
- Backend: NestJS, Socket.IO
- Database: MySQL, Redis
- Deployment: Docker, Hostinger, Nginx, CloudFlare
  
## 🏗️ Architecture
<img width="1122" height="600" alt="image" src="https://github.com/user-attachments/assets/df81ce3d-8263-44f2-8462-e840633b90d9" />

## 🛠️ Get started

1. Clone Repository 

   ```bash
   git clone https://github.com/<your-username>/MediQ-Frontend.git
   cd MediQ-Frontend
   ```
   
2. Install dependencies

   ```bash
   npm install
   ```

3. Start the app

   ```bash
   npx expo start
   ```
   
In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## ⚙️ Environment Setup

Create a .env file in the root project:

API_URL=https://api.mediq.com
SOCKET_URL=wss://api.mediq.com

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community
Join our community of developers creating universal apps.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
MIT © 2025 Jordan Arya Leksana, Alif Nurhidayat, Achmad Faruq, and Rafly Rayhansyah

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
