# Admin Panel Web Application (Node.js, Express, MongoDB)

A clean and simple Admin Panel project built using Node.js, Express, MongoDB, and TailwindCSS. Includes user authentication, admin authentication, and basic user management.

## Features

### User Features

1. Signup
2. Login
3. Session-based authentication
4. Protected routes
5. Logout

### Admin Features

1. Admin login
2. Protected admin dashboard
3. View users
4. Block or unblock users
5. Edit user details

## Tech Stack

Node.js, Express.js, MongoDB (Mongoose), TailwindCSS, express-session, bcrypt

## Installation

### Step 1: Clone the repository

```
git clone https://github.com/rithinbaijupb/admin-panel-node.git
cd admin-panel-node
```

### Step 2: Install dependencies

```
npm install
```

### Step 3: Environment variables

Create a `.env` file:

```
MONGO_URI=your-mongodb-connection-string
SESSION_SECRET=your-secret-key
PORT=3000
```

### Step 4: Start the server

```
npm start
```

The app will run at `http://localhost:3000`.

## Admin Account Setup

The project includes a `seedAdmin.js` file.
To create the default admin account, run:

```
node seedAdmin.js
```

Default admin credentials:
Email: [admin@gmail.com](mailto:admin@gmail.com)
Password: admin123

## Authentication Flow

User: Signup → Login → Session → Protected routes

Admin: Login → Session → Dashboard → Manage users

## Future Improvements

1. JWT authentication
2. Pagination for users
3. File uploads
4. Dashboard analytics
5. Deployment on Render/Vercel/Railway

## License

MIT License
