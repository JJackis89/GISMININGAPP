# Real-Time PostgreSQL Integration Setup

This guide will help you set up real-time PostgreSQL integration so that manual database changes are immediately reflected in your React app.

## Backend API Setup

### 1. Install Backend Dependencies

```powershell
# Navigate to backend directory
cd C:\Users\justi\Downloads\GISMININGAPP\backend

# Install dependencies
npm install

# Optional: Install nodemon for development
npm install -g nodemon
```

### 2. Start the Backend Server

```powershell
# Start with node
npm start

# OR start with nodemon for auto-restart
npm run dev
```

The backend will run on **http://localhost:3001**

## Testing Real-Time Updates

### 1. Start Both Servers

**Terminal 1 - Backend API:**
```powershell
cd C:\Users\justi\Downloads\GISMININGAPP\backend
npm start
```

**Terminal 2 - React App:**
```powershell
cd C:\Users\justi\Downloads\GISMININGAPP
npm run dev
```

### 2. Test Database Changes

**Method 1: Through pgAdmin or Database Tool**
1. Open pgAdmin and connect to your `Concessions` database
2. Edit a record in the `mining_concessions` table:
   ```sql
   UPDATE mining_concessions 
   SET name = 'UPDATED: Test Mining Site', 
       status = 'expired'
   WHERE id = 'CON001';
   ```
3. Refresh your React app - changes should appear immediately!

**Method 2: Through Terminal**
```powershell
# Connect to PostgreSQL
psql -U postgres -d Concessions

# Make a change
UPDATE mining_concessions 
SET owner = 'New Mining Company Ltd' 
WHERE name LIKE '%Mining Concession 1%';

# Check the change
SELECT name, owner FROM mining_concessions WHERE name LIKE '%Mining Concession 1%';
```

### 3. Test Real-Time Features

1. **Dashboard Statistics**: Edit concession statuses in PostgreSQL and watch dashboard stats update
2. **Map Visualization**: Modify coordinates and see map changes
3. **Search Results**: Change names/regions and test search functionality
4. **Record Count**: Add/delete records and see counts update

## API Endpoints Available

### Data Retrieval
- `GET /api/concessions` - Get all concessions
- `GET /api/concessions/count` - Get total count
- `POST /api/concessions/search` - Search with filters

### Data Modification
- `POST /api/concessions` - Create new concession
- `PUT /api/concessions/:id` - Update existing concession
- `DELETE /api/concessions/:id` - Delete concession

### Custom Queries
- `POST /api/query` - Execute custom SQL queries

## Verifying Real-Time Connection

1. **Backend Health Check:**
   Visit http://localhost:3001/api/test-connection in your browser

2. **App Integration:**
   Open browser dev tools (F12) and check console for:
   ```
   ✅ Fetched X concessions from PostgreSQL API
   ```

3. **Database Changes:**
   - Make changes in PostgreSQL
   - Refresh your React app
   - Changes should be visible immediately

## Troubleshooting

### Backend Not Starting
- Check if PostgreSQL is running on port 5432
- Verify database credentials in `backend/server.js`
- Ensure dependencies are installed: `npm install`

### Connection Errors
- Check CORS settings (should allow localhost:5173)
- Verify PostgreSQL is accepting connections
- Check firewall settings for ports 3001 and 5432

### Data Not Updating
- Verify both servers are running
- Check browser console for API errors
- Test direct API call: http://localhost:3001/api/concessions

## Production Deployment

For production, you'll need to:
1. Deploy the backend API to a cloud service (AWS, Heroku, etc.)
2. Update the API URL in `postgresDataService.ts`
3. Set up proper environment variables for database credentials
4. Configure production CORS settings
5. Add authentication and authorization

## Security Notes

⚠️ **Important**: This setup is for development only. For production:
- Add authentication to API endpoints
- Validate and sanitize all inputs
- Use environment variables for sensitive data
- Implement proper error handling
- Add rate limiting and request validation
