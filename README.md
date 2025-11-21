# MindEase - AI Mental Health Companion

A modern, responsive React application designed to provide mental health support through AI-powered conversations. Built with React, Firebase, and Tailwind CSS.

## Features

- 🤖 AI-powered mental health conversations
- 🔐 User authentication with Firebase
- 📱 Responsive design with Tailwind CSS
- 🎨 Beautiful animations with Framer Motion
- 💬 Real-time chat interface
- 👤 User profile management
- 🌟 Guest access available

## Tech Stack

- **Frontend:** React 18, React Router
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Backend:** Firebase (Auth, Firestore)
- **Icons:** React Icons
- **Notifications:** React Hot Toast

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mindease
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore Database
   - Copy your Firebase config

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

   The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify

1. Build the project: `npm run build`
2. Upload the `build` folder to Netlify
3. Configure environment variables in Netlify dashboard

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Project Structure

```
mindease/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Chat.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── firebase.js
│   ├── App.js
│   └── index.js
├── .env.example
├── package.json
└── README.md
```

## Features Overview

### Authentication
- User registration and login
- Persistent sessions across browser restarts
- Guest access for anonymous users
- Secure password handling

### Chat Interface
- AI-powered responses based on user input
- Emoji picker for enhanced communication
- Real-time message display
- Responsive design for all devices

### User Experience
- Smooth animations and transitions
- Glassmorphism design elements
- Intuitive navigation
- Mobile-first responsive design

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@mindease.com or create an issue in this repository.

---

**Made by KeenCoders**
# MindEase-
