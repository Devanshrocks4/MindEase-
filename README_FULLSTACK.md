# MindEase - Full-Stack Mental Health Assessment Platform

A complete full-stack web application for mental health assessments with user authentication, admin analytics, and PDF report generation.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication with role-based access control
- User registration and login
- Admin and regular user roles
- Secure password hashing with bcrypt

### Assessment System
- Multiple mental health assessment categories
- Comprehensive scoring and analysis
- Lifetime assessment history storage
- Progress tracking and trends

### Admin Dashboard
- Complete user analytics and statistics
- Assessment data export (JSON/CSV)
- User management and monitoring
- PDF report generation for users

### PDF Generation
- Automated PDF report creation
- Professional report templates
- Secure file storage and download

## 🏗️ Architecture

### Backend (Node.js/Express)
- **Framework:** Express.js with middleware
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT tokens with bcrypt hashing
- **File Storage:** Local filesystem with PDF generation
- **Security:** Helmet, CORS, rate limiting, input validation

### Frontend (React)
- **Framework:** React 18 with hooks
- **Styling:** Tailwind CSS with animations
- **Routing:** React Router DOM
- **State Management:** Context API
- **HTTP Client:** Fetch API with custom wrapper

## 📁 Project Structure

```
mindease/
├── backend/                          # Node.js/Express backend
│   ├── middleware/
│   │   └── auth.js                   # JWT authentication middleware
│   ├── models/
│   │   ├── User.js                   # User schema
│   │   ├── Assessment.js             # Assessment schema
│   │   ├── UserDashboard.js          # Dashboard data schema
│   │   └── PDFReport.js              # PDF report schema
│   ├── routes/
│   │   ├── auth.js                   # Authentication routes
│   │   ├── user.js                   # User routes
│   │   └── admin.js                  # Admin routes
│   ├── utils/
│   │   └── pdfGenerator.js           # PDF generation utilities
│   ├── uploads/                      # Generated PDF files
│   ├── server.js                     # Main server file
│   ├── package.json                  # Backend dependencies
│   └── README.md                     # Backend documentation
├── src/                              # React frontend
│   ├── components/
│   │   ├── Login.js                  # Login component
│   │   ├── Register.js               # Registration component
│   │   ├── Dashboard_updated.js      # User dashboard
│   │   ├── AdminDashboard.js         # Admin dashboard
│   │   ├── AssessmentTest_updated.js # Assessment component
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.js            # Authentication context
│   ├── data/
│   │   └── assessmentData_updated.js # Assessment questions
│   ├── utils/
│   │   └── pdfGenerator.js           # Frontend PDF utilities
│   ├── App.js                        # Main app component
│   └── index.js                      # App entry point
├── public/                           # Static assets
├── package.json                      # Frontend dependencies
└── README.md                         # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd mindease/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```
   MONGODB_URI=mongodb://localhost:27017/mindease
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Start the backend server**
   ```bash
   npm start
   ```
   For development with auto-restart:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd mindease
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   Create `.env.local` in the root directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_FIREBASE_API_KEY=demo-api-key
   ```

4. **Start the frontend development server**
   ```bash
   npm start
   ```

## 🔗 API Endpoints

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

## 🗄️ Database Schema

### User Collection
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

### Assessment Collection
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

### UserDashboard Collection
```javascript
{
  userId: ObjectId (unique),
  recentActivities: Array,
  summaryData: Object,
  lastUpdated: Date
}
```

### PDFReport Collection
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

## 🔐 Security Features

- **Password Security:** bcrypt hashing with 12 salt rounds
- **JWT Authentication:** Secure token-based auth with expiration
- **Rate Limiting:** 100 requests per 15 minutes per IP
- **Input Validation:** express-validator for all inputs
- **CORS Protection:** Configured for frontend origin
- **Helmet Security:** Security headers and protections
- **Role-based Access:** User/Admin permission system

## 🚀 Deployment

### Backend Deployment
```bash
# Production build
npm run build

# Using PM2 for production
npm install -g pm2
pm2 start server.js --name mindease-backend
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Serve static files
npm install -g serve
serve -s build -l 3000
```

### Docker Deployment
```dockerfile
# Backend Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]

# Frontend Dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
npm test
```

## 📊 Monitoring & Analytics

- Admin dashboard with comprehensive analytics
- User assessment trends and statistics
- PDF generation and download tracking
- Error logging and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Create an issue in the repository
- Contact the development team

---

**Built with ❤️ for mental health awareness and support**
