# 🚀 Quick Start Guide - GearGuard

This guide will get your application running in **5 minutes**!

---

## Option 1: Quick Start with SQLite (Recommended for Testing)

**No MySQL password needed!** Perfect for hackathon demo.

### Step 1: Setup Backend
```bash
cd backend

# The .env file should have this line:
# USE_SQLITE=true

# Install SQLite dependency
npm install sqlite3

# Start the server
npm run dev
```

✅ Backend will run on `http://localhost:5000`
✅ Database file `database.sqlite` will be created automatically

### Step 2: Setup Frontend
```bash
cd frontend
npm run dev
```

✅ Frontend will run on `http://localhost:5173`

### Step 3: Create First User

**Option A: Using Browser (Postman/Thunder Client)**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@gearguard.com",
  "password": "admin123",
  "role": "admin"
}
```

**Option B: Using PowerShell**
```powershell
$body = @{
    name = "Admin User"
    email = "admin@gearguard.com"
    password = "admin123"
    role = "admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

### Step 4: Login

Go to `http://localhost:5173` and login with:
- Email: `admin@gearguard.com`
- Password: `admin123`

---

## Option 2: Using MySQL (Production Setup)

### Step 1: Configure MySQL

**A. Create Database**
```bash
mysql -u root -p
# Enter your MySQL password

CREATE DATABASE gearguard;
EXIT;
```

**B. Edit `.env` file**

Open `backend\.env` and change these lines:
```
USE_SQLITE=false
DB_PASSWORD=your_actual_mysql_password
```

### Step 2: Start Backend
```bash
cd backend
npm run dev
```

### Step 3: Continue with Steps 2-4 from Option 1 above

---

## Troubleshooting

### MySQL Password Error

If you see `Access denied for user 'root'@'localhost' (using password: NO)`:

1. **Switch to SQLite** (easiest):
   - Edit `backend\.env`
   - Change `USE_SQLITE=false` to `USE_SQLITE=true`
   - Restart: `npm run dev`

2. **Fix MySQL password**:
   - Edit `backend\.env`
   - Add your password: `DB_PASSWORD=yourpassword`

3. **Create dedicated MySQL user**:
   ```sql
   CREATE USER 'gearguard'@'localhost' IDENTIFIED BY 'GearGuard2024!';
   GRANT ALL PRIVILEGES ON gearguard.* TO 'gearguard'@'localhost';
   FLUSH PRIVILEGES;
   ```
   Then update `.env`:
   ```
   DB_USER=gearguard
   DB_PASSWORD=GearGuard2024!
   ```

### Port Already in Use

If backend fails with "port already in use":
```bash
# Find the process
netstat -ano | findstr :5000

# Kill it (replace PID with actual number)
taskkill /PID <PID> /F
```

### Frontend Not Loading

- Make sure backend is running first
- Check `frontend\.env` has: `VITE_API_URL=http://localhost:5000/api`
- Clear browser cache and reload

---

## Next Steps After Login

1. **Create Demo Data**:
   - Create a department: `POST /api/departments`
   - Create a team: `POST /api/teams`
   - Create equipment: `POST /api/equipment`
   - Create a request: `POST /api/requests`

2. **Test Features**:
   - Dashboard shows stats
   - Auto-fill works when creating requests
   - Smart buttons show request counts

3. **Build Remaining Pages**:
   - Kanban board with drag & drop
   - Equipment CRUD pages
   - Calendar view
   - Reports

---

## Quick Commands Reference

```bash
# Backend
cd backend
npm run dev          # Start development server
npm start            # Start production server

# Frontend  
cd frontend
npm run dev          # Start development server
npm run build        # Build for production

# Database
# SQLite: Just set USE_SQLITE=true in .env
# MySQL: Ensure DB_PASSWORD is set in .env
```

---

## Demo Workflow

1. ✅ Start backend (SQLite mode)
2. ✅ Start frontend
3. ✅ Register admin user via API
4. ✅ Login to web app
5. ✅ View dashboard
6. 🚧 Build Kanban board (next priority!)
7. 🚧 Build equipment pages
8. 🚧 Build calendar view

**For hackathon demo: SQLite is perfect!** You can switch to MySQL later for production.
