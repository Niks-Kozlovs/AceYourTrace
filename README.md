<!-- PROJECT LOGO -->
<br />
<div align="center">
    <a href="https://github.com/YourUsername/AceYourTrace">
        <img src="img/logo.png" alt="Logo" width="250">
    </a>
    <h3 align="center">Ace Your Trace</h3>
    <p align="center">
        An interactive web application to generate personalized walking routes.
        <br />
        <a href="https://github.com/Niks-Kozlovs/AceYourTrace/tree/master">View original</a>
        ·
        <a href="https://github.com/Niks-Kozlovs/AceYourTrace/issues">Report Bug</a>
        ·
        <a href="https://github.com/Niks-Kozlovs/AceYourTrace/issues">Request Feature</a>
    </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
    <summary>Table of Contents</summary>
    <ol>
        <li><a href="#about-the-project">About The Project</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#principles-and-best-practices">Principles and Best Practices</a></li>
        <li><a href="#built-with">Built With</a></li>
        <li>
            <a href="#getting-started">Getting Started</a>
            <ul>
                <li><a href="#prerequisites">Prerequisites</a></li>
                <li><a href="#installation">Installation</a></li>
            </ul>
        </li>
        <li><a href="#usage">Usage</a></li>
        <li><a href="#license">License</a></li>
        <li><a href="#contact">Contact</a></li>
    </ol>
</details>

## About The Project
https://github.com/user-attachments/assets/ff25b70e-e6ea-401d-9c13-d7c367ec3df1

"Ace Your Trace" is an interactive web application aimed at providing users with personalized walking routes. Whether you are looking for a quick stroll or a long-distance hike, this app helps you explore your surroundings by generating routes based on your desired distance and location.

Originally developed during a weekend hackathon to help people explore safely during the pandemic, the application has since been updated to a modern **Client-Server architecture**. This ensures that API keys remain secure on the backend while offloading heavy route calculations from the user's browser.

## Features

* **Route Generation:** Generates walking routes based on user-defined distance.
* **Interactive Map:** Utilizes Leaflet for selecting starting points and visualizing routes.
* **Geolocation Support:** Use your current location via the browser's Geolocation API.
* **Smart Round-Trips:** Backend logic calculates circular paths to bring you back to your starting point.
* **Secure Architecture:** API keys are hidden on the server side to prevent unauthorized use.
* **Real-time Feedback:** Immediate visual updates on the map when parameters change.

## Principles and Best Practices

* **Separation of Concerns:** Distinct separation between frontend (UI/Map) and backend (Routing logic/API communication).
* **Security:** Use of Environment Variables (`.env`) to protect sensitive API credentials.
* **Modular Architecture:** Organized using ES6 modules on the frontend and Express middleware on the backend.
* **Asynchronous Programming:** Extensive use of `async/await` for non-blocking API calls.

## Built With

<p align="center">
    <img alt="JavaScript" src="https://img.shields.io/badge/-JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black">
    <img alt="Node.js" src="https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
    <img alt="Express" src="https://img.shields.io/badge/-Express-000000?style=for-the-badge&logo=Express&logoColor=white">
    <img alt="Leaflet" src="https://img.shields.io/badge/-Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white">
    <img alt="HTML5" src="https://img.shields.io/badge/-HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white">
    <img alt="CSS3" src="https://img.shields.io/badge/-CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white">
</p>

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

* **Node.js** (v14 or higher)
* **npm** (Node Package Manager)
* **GraphHopper API Key**: Required for the routing engine.

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/YourUsername/AceYourTrace.git
   cd AceYourTrace
   ```

2. **Setup the Backend**
   ```bash
   cd server
   npm install
   ```

3. **Configure Environment Variables**
   * Create a `.env` file in the `server` directory.
   * Add your GraphHopper API Key:
     ```env
     PORT=3000
     GRAPHHOPPER_API_KEY=your_api_key_here
     ```

4. **Start the Server**
   ```bash
   npm start
   ```

5. **Launch the Frontend**
   * Simply open `index.html` in your web browser (or use a Live Server extension in VS Code).
   * Ensure the frontend `RoutingService.js` is pointed to your local server (default: `http://localhost:3000`).

## Usage

### 1. Set Distance and Route Type
Use the sidebar to input your desired distance and select between "A-to-B" or "Round Trip".

### 2. Select Starting Point
* Click **"Use Current Location"** to use GPS.
* **OR** Click anywhere on the map to set a custom starting point.

### 3. Generate Routes
Click **"Preview Routes"**. The frontend will send a request to your local Node.js server, which processes the route geometry and returns the data to be drawn on the map.

## License

This project is released under the Unlicense, allowing for free use and distribution.

## Contact

Niks Kozlovs - [@NiksKozlovs](https://x.com/NiksKozlovs) - kozlovs.niks1@gmail.com
