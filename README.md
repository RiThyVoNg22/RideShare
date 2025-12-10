# RideShare Local - Complete Modern Application

A professional vehicle rental platform for Cambodia, built with React, TypeScript, Node.js, Express, and MongoDB.

## 🚀 Features

- **Modern React Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **RESTful Backend API**: Node.js, Express, MongoDB
- **User Authentication**: JWT-based authentication
- **Vehicle Management**: List, browse, filter vehicles
- **Booking System**: Create and manage bookings
- **Real-time Chat**: Messaging between renters and owners
- **File Uploads**: Image upload for vehicles
- **Responsive Design**: Mobile-first design

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)

## 🛠️ Installation & Setup

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Setup Environment Variables

**Frontend** (create `.env` in root):
```
VITE_API_URL=http://localhost:5001/api
```

**Backend** (create `.env` in `server/` folder):
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/rideshare
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4. Start MongoDB

Make sure MongoDB is running:
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

### 5. Start Backend Server

```bash
cd server
npm run dev
```

The API will run on `http://localhost:5001`

### 6. Start Frontend

```bash
# From project root
npm run dev
```

The app will open at `http://localhost:3001`

> **📖 Quick Start**: See [QUICK_START.md](./QUICK_START.md) for detailed step-by-step instructions.

## 📁 Project Structure

```
RideShare MJP2/
├── server/                 # Backend API
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── uploads/           # Uploaded images
│   └── server.js          # Express server
├── src/                   # React frontend
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── contexts/          # React Context
│   ├── services/          # API service layer
│   └── config/            # Configuration
└── public/                # Static assets
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Vehicles
- `GET /api/vehicles` - Get all vehicles (with filters)
- `GET /api/vehicles/:id` - Get single vehicle
- `POST /api/vehicles` - Create vehicle (protected)
- `PUT /api/vehicles/:id` - Update vehicle (protected)
- `DELETE /api/vehicles/:id` - Delete vehicle (protected)
- `GET /api/vehicles/user/my-vehicles` - Get user's vehicles

### Bookings
- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/owner-requests` - Get owner's requests
- `GET /api/bookings/:id` - Get single booking
- `PUT /api/bookings/:id/status` - Update booking status

### Chat
- `GET /api/chat/booking/:bookingId` - Get chat for booking
- `GET /api/chat/my-chats` - Get user's chats
- `POST /api/chat/:chatId/messages` - Send message
- `PUT /api/chat/:chatId/read` - Mark as read

### Upload
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images

## 🎯 Key Features Implemented

✅ User authentication (register/login)
✅ Vehicle listing and browsing
✅ Vehicle filtering and search
✅ Booking creation
✅ Profile management
✅ Image uploads
✅ Responsive design
✅ Real-time chat system
✅ Booking management

## 🚧 Next Steps

1. Add payment integration
2. Add email notifications
3. Add reviews and ratings
4. Add admin dashboard
5. Add ID verification system
6. Add push notifications
7. Add advanced search with geolocation

## 📝 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## 🔐 Security Notes

- Change JWT_SECRET in production
- Use environment variables for sensitive data
- Implement rate limiting
- Add input validation
- Use HTTPS in production

## 📄 License

All rights reserved - RideShare Local
