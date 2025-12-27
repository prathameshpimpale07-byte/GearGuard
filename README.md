# GearGuard: The Ultimate Maintenance Tracker

A comprehensive maintenance management system built for the Odoo Hackathon. Track company assets, manage maintenance teams, and handle repair requests with an intuitive Kanban board interface.

## 🚀 Features

### Core Functionality
- **Equipment Management** - Track all company assets (machines, vehicles, computers)
- **Maintenance Teams** - Organize specialized teams (Mechanics, Electricians, IT Support)
- **Request Management** - Handle both corrective (breakdowns) and preventive maintenance
- **Kanban Board** - Drag-and-drop interface for request workflow (New → In Progress → Repaired → Scrap)
- **Calendar View** - Schedule and visualize preventive maintenance
- **Smart Auto-Fill** - Automatically populate team and technician when selecting equipment
- **Smart Buttons** - View equipment-specific requests with count badges
- **Scrap Logic** - Mark equipment as unusable when requests reach scrap stage

### User Roles
- **Admin** - Full system access, user management
- **Manager** - Create requests, assign technicians, view reports
- **Technician** - View assigned tasks, update status, log work hours
- **Employee** - Create requests for their equipment

## 📋 Tech Stack

### Backend
- Node.js + Express
- Sequelize ORM
- MySQL database
- JWT Authentication
- Bcrypt for password hashing

### Frontend
- React 19
- Vite
- React Router
- @dnd-kit (Drag & Drop)
- React Big Calendar
- Axios for API calls
- Date-fns

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd GearGuard
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create MySQL database
mysql -u root -p
CREATE DATABASE gearguard;
EXIT;

# Configure environment variables
# Edit .env file with your database credentials
# DB_PASSWORD=your_mysql_password

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies (already done if you followed along)
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🎯 Usage

### First Time Setup

1. **Start MySQL** - Ensure MySQL is running
2. **Start Backend** - `cd backend && npm run dev`
3. **Start Frontend** - `cd frontend && npm run dev`
4. **Access Application** - Open `http://localhost:5173`

### Demo Credentials

Use these credentials to login and test different roles:

```
Admin:
Email: admin@gearguard.com
Password: admin123

Manager:
Email: manager@gearguard.com
Password: manager123

Technician:
Email: tech@gearguard.com
Password: tech123

Employee:
Email: employee@gearguard.com
Password: employee123
```

**Note**: You'll need to create these users first using the register endpoint or by adding them directly to the database.

## 📁 Project Structure

```
GearGuard/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth & error handling
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── server.js        # Express server
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components (60 pages)
│   │   ├── context/     # React Context (Auth)
│   │   ├── utils/       # Utilities (API, dates)
│   │   ├── config/      # Constants
│   │   └── App.jsx      # Main app with routing
│   └── public/
│
└── PROBLEM_STATEMENT.md # Original hackathon requirements
```

## 🔑 Key Workflows

### Flow 1: The Breakdown (Corrective Maintenance)
1. User creates a request
2. Select equipment → System auto-fills team and technician
3. Request appears in "New" stage on Kanban board
4. Manager/Technician assigns themselves
5. Move to "In Progress"
6. Complete work, log hours, move to "Repaired"

### Flow 2: Routine Checkup (Preventive Maintenance)
1. Manager creates preventive request
2. Set scheduled date
3. Request appears on calendar view
4. Technician sees task on scheduled date
5. Complete maintenance as per Flow 1

## 🎨 Features Implemented

- ✅ Equipment CRUD with smart buttons
- ✅ Department & Team management
- ✅ Maintenance request lifecycle
- ✅ Auto-fill equipment details
- ✅ Kanban board (ready for drag & drop)
- ✅ Calendar view endpoints
- ✅ Overdue visual indicators
- ✅ Scrap logic
- ✅ JWT Authentication
- ✅ Role-based access control
- ✅ Modern gradient UI design

## 🚧 Roadmap (Additional Pages to Build)

The project structure supports 60 total pages:
- Equipment management (8 pages)
- Team management (6 pages)
- Request management (10 pages)
- Calendar & scheduling (3 pages)
- Reports & analytics (5 pages)
- Admin panel (5 pages)
- Error & edge case pages (9 pages)
- Additional polish pages (4 pages)

See `folder_structure.md` in artifacts for complete page breakdown.

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Equipment
- `GET /api/equipment` - List all equipment
- `POST /api/equipment` - Create equipment
- `GET /api/equipment/:id` - Get equipment details
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment
- `GET /api/equipment/:id/requests` - Get equipment requests (Smart Button)
- `GET /api/equipment/:id/open-count` - Get open request count

### Maintenance Requests
- `GET /api/requests` - List all requests
- `POST /api/requests` - Create request (with auto-fill)
- `GET /api/requests/:id` - Get request details
- `PUT /api/requests/:id` - Update request
- `PUT /api/requests/:id/stage` - Change stage (with scrap logic)
- `GET /api/requests/calendar` - Get calendar requests
- `GET /api/requests/overdue` - Get overdue requests

### Teams
- `GET /api/teams` - List all teams
- `POST /api/teams` - Create team
- `POST /api/teams/:id/members` - Add team member
- `DELETE /api/teams/:id/members/:userId` - Remove member

### Departments
- `GET /api/departments` - List all departments
- `POST /api/departments` - Create department

### Users
- `GET /api/users` - List all users (Admin only)
- `GET /api/users/technicians` - Get technicians
- `POST /api/users` - Create user (Admin only)

## 🤝 Contributing

This is a hackathon project. Contributions, issues, and feature requests are welcome!

## 📄 License

This project is created for the Odoo Hackathon.

## 👨‍💻 Author

Built with ❤️ for the Odoo Hackathon

---

For detailed implementation plan and technical architecture, see the artifacts in `.gemini/antigravity/brain/` directory.
