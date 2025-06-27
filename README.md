# ZCoder Platform

An interactive platform for developers to build and manage coding profiles, save/share coding problems, follow contest calendars, and engage with a community feed.

## Features

- **User Profiles**: Store personal info such as Github Link and Codeforces Id.
- **Contest Tracker**: View upcoming programming contests and integrate them into a personal calendar.
- **Problem Management**: You can bookmark problems and mark them as solved for easy tracking.

## Tech Stack

- **Frontend**: React.js  
- **Backend**: Node.js + Express.js  
- **Database**: MongoDB  
- **Styling**: CSS  

*(MERN stack — Mongo, Express, React, Node)*

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)  
- npm (Node Package Manager)

### Installation

1. **Clone the repo**
    ```bash
    git clone https://github.com/tejas615/ZCoder.git
    cd ZCoder
    ```

2. **Install dependencies**
    ```bash
    npm install          # installs root dependencies
    cd server && npm install
    cd ../client && npm install
    cd ..
    ```

3. **Run the application**

    Open two terminal sessions:

    **Backend:**
    ```bash
    cd server
    npm start        # or node server.js
    ```

    **Frontend:**
    ```bash
    cd client
    npm run dev
    ```

    The backend runs on `http://localhost:5000` by default, and the React app runs on `http://localhost:3000`.

## Usage

- Register or log in to create and customize your developer profile.
- Explore public coding problems categorized by ratings to enhance and personalize your learning journey.
- Follow upcoming contests listed in your personal calendar.


