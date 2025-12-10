# RideShare Local - Backend API

Node.js/Express REST API with MongoDB for RideShare Local platform.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/rideshare
   JWT_SECRET=your-secret-key-here
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

3. **Start MongoDB:**
   ```bash
   mongod
   ```

4. **Start server:**
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Vehicles
- `GET /api/vehicles` - List vehicles (with filters)
- `GET /api/vehicles/:id` - Get vehicle details
- `POST /api/vehicles` - Create vehicle (auth required)
- `PUT /api/vehicles/:id` - Update vehicle (auth required)
- `DELETE /api/vehicles/:id` - Delete vehicle (auth required)

### Bookings
- `POST /api/bookings` - Create booking (auth required)
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/owner-requests` - Get owner requests
- `PUT /api/bookings/:id/status` - Update booking status

### Chat
- `GET /api/chat/booking/:bookingId` - Get chat
- `GET /api/chat/my-chats` - Get user chats
- `POST /api/chat/:chatId/messages` - Send message

### Upload
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images

## 🔐 Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

## 📦 Database Models

- **User**: User accounts and profiles
- **Vehicle**: Vehicle listings
- **Booking**: Rental bookings
- **Chat**: Chat conversations and messages

## 🛠️ Development

- `npm run dev` - Start with nodemon (auto-reload)
- `npm start` - Start production server

## 📝 Notes

- Images are stored in `uploads/` folder
- JWT tokens expire in 7 days (configurable)
- All timestamps use MongoDB Date type
- File upload limit: 5MB per image

