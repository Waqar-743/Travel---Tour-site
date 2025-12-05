# 🏔️ GB Travel Agency

A modern, fully responsive travel agency website for exploring the breathtaking beauty of Gilgit-Baltistan, Pakistan. Built with React and Node.js, featuring an elegant UI, authentication system, booking management, and more.

![GB Travel Agency](https://img.shields.io/badge/Made%20with-React-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)

## ✨ Features

### Frontend
- 🎨 **Modern UI/UX** - Beautiful, responsive design with smooth animations
- 📱 **Fully Responsive** - Optimized for all devices (mobile, tablet, desktop)
- 🔐 **User Authentication** - Signup, login with email verification
- 📦 **Tour Packages** - Browse and book travel packages
- 🗺️ **Interactive Map** - Explore destinations on an interactive map
- 📸 **Photo Gallery** - Stunning photo gallery with lightbox
- 💬 **Testimonials** - Customer reviews carousel
- 📝 **Contact Form** - Inquiry form with database storage
- 🤖 **AI Trip Planner** - Smart trip planning assistant
- 📰 **Blog Section** - Travel tips and destination guides

### Backend
- 🔒 **JWT Authentication** - Secure token-based authentication
- 📧 **Email Verification** - Email verification with clickable links
- 💳 **Payment Integration** - Stripe and Easypaisa payment options
- 📊 **MongoDB Database** - Persistent data storage
- 🛡️ **Security** - Helmet, CORS, rate limiting

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router DOM** - Client-side routing
- **CSS3** - Custom styling with CSS variables

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Nodemailer** - Email service
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
gb-travel-agency/
├── src/
│   ├── components/
│   │   ├── Auth/           # Authentication modal
│   │   ├── Blog/           # Blog section
│   │   ├── Common/         # Shared components
│   │   ├── Contact/        # Contact form
│   │   ├── Destinations/   # Destination cards
│   │   ├── Footer/         # Footer component
│   │   ├── Gallery/        # Photo gallery
│   │   ├── Header/         # Navigation header
│   │   ├── Hero/           # Hero section
│   │   ├── Map/            # Interactive map
│   │   ├── Packages/       # Tour packages
│   │   ├── Team/           # Team section
│   │   ├── Testimonials/   # Reviews carousel
│   │   └── WhyChooseUs/    # Features section
│   ├── data/               # Static data files
│   ├── pages/              # Page components
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── backend/
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── server.js           # Server entry point
└── public/                 # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- Gmail account (for email service)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Waqar-743/Travel---Tour-site.git
   cd Travel---Tour-site
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   FRONTEND_URL=http://localhost:5173/gb-travel-agency
   NODE_ENV=development
   ```

5. **Start the backend server**
   ```bash
   cd backend
   node server.js
   ```

6. **Start the frontend (new terminal)**
   ```bash
   npm run dev
   ```

7. **Open in browser**
   ```
   http://localhost:5173/gb-travel-agency/
   ```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/verify-email/:token` | Verify email |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings` | Get user bookings |

### Inquiries
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/inquiries` | Submit contact form |
| GET | `/api/inquiries` | Get all inquiries (admin) |

### Trips & Destinations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trips` | Get all trips |
| GET | `/api/destinations` | Get all destinations |

## 📱 Responsive Breakpoints

| Device | Breakpoint |
|--------|------------|
| Mobile | < 480px |
| Tablet | 480px - 768px |
| Laptop | 768px - 1024px |
| Desktop | > 1024px |

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Dark | `#1a3a3a` | Headers, Footer |
| Primary Accent | `#2d7a7e` | Buttons, Links |
| Secondary Accent | `#d4a574` | CTAs, Highlights |
| Background | `#f5f5f5` | Page background |
| Text Primary | `#1a1a1a` | Main text |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI Library
- [Vite](https://vitejs.dev/) - Build Tool
- [MongoDB](https://www.mongodb.com/) - Database
- [Unsplash](https://unsplash.com/) - Stock Photos

---

<div align="center">

### Made with ❤️ by Waqar Ahmed

*Explore the beauty of Gilgit-Baltistan* 🏔️

</div>
