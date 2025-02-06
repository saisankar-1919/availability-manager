# Weekly Availability Manager

This project allows you to manage weekly availability for users.

## Setup Instructions

Follow the steps below to set up the project locally.

### 1. Clone the repository or extract the compressed file

Clone the repo from [https://github.com/saisankar-1919/availability-manager](https://github.com/saisankar-1919/availability-manager) or extract the compressed file.

### 2. Navigate to the root directory

cd weekly-availability-manager

### 3. Install dependencies

npm install

### 4. Create a .env file in the root directory of the project and add the following environment variables

REDIS_HOST=<your_redis_host_url>
REDIS_PORT=<your_redis_port>
NEXT_PUBLIC_BASE_URL="http://localhost:3000/"

### 5. Start your Redis server locally (if it's not already running)

redis-server

### 6. Start the application in development mode

npm run dev

### 7. Once the application is running, open your browser and go to [http://localhost:3000](http://localhost:3000) to view the application.
