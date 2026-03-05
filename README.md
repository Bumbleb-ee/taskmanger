# sofTwAreTasK

A full-stack application with a Vite-based React frontend and a Node.js backend.

## Project Structure

- `frontend/`: Contains the React application created with Vite. Connects to the backend via API endpoints.
- `backend/`: Contains the Node.js/Express server providing the backend APIs and handling server-side logic (e.g., database interactions).

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Installation
Clone the repository and install dependencies for both the frontend and backend.

```bash
git clone https://github.com/Bumbleb-ee/sofTwAreTasK.git
cd sofTwAreTasK

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the Application

To run both the frontend and backend servers together for development:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Technologies Used
- Frontend: React, Vite
- Backend: Node.js, Express

