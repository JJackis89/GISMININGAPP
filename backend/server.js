const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3001;

// Enable CORS for your React app
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server port
  credentials: true
}));

app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Concessions',
  password: 'Peekay1104',
  port: 5432,
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// API Routes

// Test connection endpoint
app.get('/api/test-connection', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      success: true, 
      message: 'PostgreSQL connection successful',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get all mining concessions
app.get('/api/concessions', async (req, res) => {
  try {
    console.log('📊 Fetching all concessions from PostgreSQL...');
    
    const query = `
      SELECT 
        id, name, size, owner, permit_type, permit_expiry_date,
        district, region, status, coordinates, phone, email, address,
        undertaking, raw_attributes, 
        ST_AsGeoJSON(geometry) as geometry_geojson,
        ST_AsText(centroid) as centroid_wkt,
        created_at, updated_at
      FROM mining_concessions 
      ORDER BY name
    `;
    
    const result = await pool.query(query);
    
    console.log(`✅ Fetched ${result.rows.length} concessions from database`);
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching concessions:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get concession count
app.get('/api/concessions/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM mining_concessions');
    res.json({
      success: true,
      data: [{ count: parseInt(result.rows[0].count) }],
      count: 1
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Search concessions with filters
app.post('/api/concessions/search', async (req, res) => {
  try {
    const { name, owner, region, status, permitType } = req.body;
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (name) {
      conditions.push(`name ILIKE $${paramIndex}`);
      params.push(`%${name}%`);
      paramIndex++;
    }
    
    if (owner) {
      conditions.push(`owner ILIKE $${paramIndex}`);
      params.push(`%${owner}%`);
      paramIndex++;
    }
    
    if (region) {
      conditions.push(`region = $${paramIndex}`);
      params.push(region);
      paramIndex++;
    }
    
    if (status) {
      conditions.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }
    
    if (permitType) {
      conditions.push(`permit_type = $${paramIndex}`);
      params.push(permitType);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    const query = `
      SELECT 
        id, name, size, owner, permit_type, permit_expiry_date,
        district, region, status, coordinates, phone, email, address,
        undertaking, raw_attributes, 
        ST_AsGeoJSON(geometry) as geometry_geojson,
        ST_AsText(centroid) as centroid_wkt,
        created_at, updated_at
      FROM mining_concessions 
      ${whereClause}
      ORDER BY name
    `;

    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Create new concession
app.post('/api/concessions', async (req, res) => {
  try {
    const concession = req.body;
    
    const query = `
      INSERT INTO mining_concessions (
        id, name, size, owner, permit_type, permit_expiry_date,
        district, region, status, coordinates, phone, email, address,
        undertaking, raw_attributes, geometry, centroid
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
        ST_GeomFromGeoJSON($16), ST_Centroid(ST_GeomFromGeoJSON($16))
      )
      RETURNING id
    `;

    const params = [
      concession.id,
      concession.name,
      concession.size,
      concession.owner,
      concession.permitType,
      concession.permitExpiryDate,
      concession.district,
      concession.region,
      concession.status,
      JSON.stringify(concession.coordinates),
      concession.contactInfo?.phone || null,
      concession.contactInfo?.email || null,
      concession.contactInfo?.address || null,
      concession.rawAttributes?.undertaking || null,
      JSON.stringify(concession.rawAttributes || {}),
      JSON.stringify({
        type: 'Polygon',
        coordinates: [concession.coordinates]
      })
    ];

    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Update concession
app.put('/api/concessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const concession = req.body;
    
    const query = `
      UPDATE mining_concessions SET
        name = $2, size = $3, owner = $4, permit_type = $5, permit_expiry_date = $6,
        district = $7, region = $8, status = $9, coordinates = $10, phone = $11, 
        email = $12, address = $13, undertaking = $14, raw_attributes = $15, 
        geometry = ST_GeomFromGeoJSON($16), centroid = ST_Centroid(ST_GeomFromGeoJSON($16)),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id
    `;

    const params = [
      id,
      concession.name,
      concession.size,
      concession.owner,
      concession.permitType,
      concession.permitExpiryDate,
      concession.district,
      concession.region,
      concession.status,
      JSON.stringify(concession.coordinates),
      concession.contactInfo?.phone || null,
      concession.contactInfo?.email || null,
      concession.contactInfo?.address || null,
      concession.rawAttributes?.undertaking || null,
      JSON.stringify(concession.rawAttributes || {}),
      JSON.stringify({
        type: 'Polygon',
        coordinates: [concession.coordinates]
      })
    ];

    const result = await pool.query(query, params);
    
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Concession not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Delete concession
app.delete('/api/concessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = 'DELETE FROM mining_concessions WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Concession not found'
      });
    }
    
    res.json({
      success: true,
      message: `Concession ${id} deleted successfully`
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Generic query endpoint for custom SQL
app.post('/api/query', async (req, res) => {
  try {
    const { query, params = [] } = req.body;
    
    // Basic security check - only allow SELECT, INSERT, UPDATE, DELETE
    const normalizedQuery = query.trim().toUpperCase();
    if (!normalizedQuery.startsWith('SELECT') && 
        !normalizedQuery.startsWith('INSERT') && 
        !normalizedQuery.startsWith('UPDATE') && 
        !normalizedQuery.startsWith('DELETE') &&
        !normalizedQuery.startsWith('WITH')) {
      return res.status(400).json({
        success: false,
        error: 'Only SELECT, INSERT, UPDATE, DELETE, and WITH queries are allowed'
      });
    }
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rowCount,
      command: result.command
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 PostgreSQL API server running on http://localhost:${port}`);
  console.log(`📍 Database: postgres@localhost:5432/Concessions`);
  console.log(`🔗 CORS enabled for: http://localhost:5173`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await pool.end();
  process.exit(0);
});
