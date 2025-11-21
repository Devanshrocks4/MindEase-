# MindEase Backend API

Node.js/Express backend API for the MindEase mental health assessment platform.

## Features

- 🔐 JWT Authentication with role-based access control
- 👥 User and Admin roles
- 📊 Assessment data management
- 📄 PDF report generation
- 📈 Analytics and reporting
- 🛡️ Security middleware (helmet, rate limiting, CORS)
- 📁 File upload handling

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Security:** bcryptjs, helmet, express-rate-limit
- **File Processing:** pdfkit, multer
- **Validation:** express-validator

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Navigate to backend directory**
   ```bash
   cd mindease/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```
   MONGODB_URI=mongodb://localhost:27017/mindease
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Start the server**
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User/Admin login

### User Routes (`/api/user`) - *Requires Authentication*
- `GET /assessments` - Get user's assessment history
- `GET /assessment/:id` - Get specific assessment
- `POST /assessment/create` - Create new assessment
- `GET /assessment/:id/pdf` - Download PDF report
- `GET /dashboard` - Get user dashboard data

### Admin Routes (`/api/admin`) - *Admin Only*
- `GET /users` - Get all users
- `GET /user/:id/assessments` - Get user's assessments
- `GET /assessments` - Get all assessments with filters
- `GET /export/pdf` - Export user data as PDF
- `GET /export/csv` - Export assessment data as CSV
- `GET /analytics` - Get admin analytics

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  passwordHash: String,
  role: 'user' | 'admin',
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Assessment
```javascript
{
  userId: ObjectId,
  category: String,
  categoryName: String,
  testDate: Date,
  rawScores: Array,
  computedScore: Number,
  resultCategory: String,
  wellnessIndex: Number,
  wellnessLevel: String,
  testResults: Array,
  suggestions: Array,
  metadata: Object,
  isActive: Boolean
}
```

### UserDashboard
```javascript
{
  userId: ObjectId (unique),
  recentActivities: Array,
  summaryData: Object,
  lastUpdated: Date
}
```

### PDFReport
```javascript
{
  userId: ObjectId,
  assessmentId: ObjectId,
  fileName: String,
  pdfPath: String,
  fileSize: Number,
  generatedAt: Date,
  downloadCount: Number,
  metadata: Object,
  isActive: Boolean,
  expiresAt: Date
}
```

## Security Features

- **Password Hashing:** bcryptjs with 12 salt rounds
- **JWT Tokens:** Secure token-based authentication
- **Rate Limiting:** 100 requests per 15 minutes per IP
- **CORS:** Configured for frontend origin
- **Helmet:** Security headers
- **Input Validation:** express-validator for all inputs
- **Role-based Access:** User/Admin permissions

## File Structure

```
backend/
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   ├── User.js             # User model
│   ├── Assessment.js       # Assessment model
│   ├── UserDashboard.js    # Dashboard model
│   └── PDFReport.js        # PDF report model
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── user.js             # User routes
│   └── admin.js            # Admin routes
├── utils/
│   └── pdfGenerator.js     # PDF generation utilities
├── uploads/                # Generated PDF files
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
├── server.js              # Main server file
└── README.md              # This file
```

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (when implemented)

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/mindease |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

## Deployment

### Production Considerations

1. **Environment Variables:** Set all required environment variables
2. **Database:** Use MongoDB Atlas or production MongoDB instance
3. **File Storage:** Consider cloud storage (AWS S3, Google Cloud) for PDFs
4. **SSL/HTTPS:** Enable HTTPS in production
5. **Rate Limiting:** Adjust rate limits based on needs
6. **Monitoring:** Add logging and monitoring solutions

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Include input validation
4. Update documentation
5. Test your changes

## License

This project is licensed under the MIT License.
