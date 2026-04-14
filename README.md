# Smart QR Hub

A mobile-responsive Progressive Web App (PWA) for creating personalized QR code profiles. Built with React, Tailwind CSS, and Firebase Firestore.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=FFA000)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=646CFF)

## ✨ Features

- **PWA Support** - Add to Home Screen functionality with service workers
- **Glassmorphism UI** - Modern dark theme with neon glow effects
- **QR Code Generation** - Auto-generated unique QR codes for each user
- **Link Management** - Add up to 10 social links to your profile
- **Route Protection** - Secure authentication flow with route guards
- **Session Persistence** - Local storage based session management
- **Mobile Responsive** - Optimized for all device sizes

## 🛠 Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS with Glassmorphism theme
- **State Management**: React Context API
- **Backend**: Firebase Firestore
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **QR Generation**: qrcode.react

## 📁 Project Structure

```
src/
├── assets/             # Images and static assets
├── components/         # Reusable UI components
│   ├── common/         # Button, Card, Input
│   ├── layout/         # Navbar
│   └── qr/              # QR Generator
├── context/            # Global state (AuthContext)
├── pages/               # Page components
│   ├── Register.jsx     # User registration
│   ├── Login.jsx        # User login
│   ├── Index.jsx        # QR display (Home)
│   ├── Dashboard.jsx    # Link management
│   ├── Docs.jsx         # Developer info
│   └── ProfileView.jsx  # Public profile
├── services/            # Firebase configuration
│   ├── firebase.config.js
│   └── firestore.js
└── App.jsx             # Main routing
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project

### Installation

```bash
# Clone the repository
git clone https://github.com/amkyawdev/qr-scanner-app.git

# Navigate to project directory
cd qr-scanner-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 🔧 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Firestore Database**
4. Create a `users` collection
5. Get your configuration keys
6. Add environment variables

## 📱 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Build for Production

```bash
npm run build
```

## 🔐 Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /users/{userId} {
    allow read: if true;
    allow write: if request.auth != null && request.auth.uid == userId;
  }
}
```

## 🎨 UI Components

### Glassmorphism Card

```jsx
<div className="glass-card rounded-xl p-6">
  {/* Content */}
</div>
```

### Neon Button

```jsx
<button className="btn-neon">
  Click Me
</button>
```

## 📄 License

MIT License - feel free to use this project for any purpose.

## 👨‍💻 Developer

**Aung Myo Kyaw**

- GitHub: [amkyawdev](https://github.com/amkyawdev)
- Email: aung.thuyrain.at449@gmail.com
- Phone: 09677740154

---

Built with ❤️ using React & Firebase