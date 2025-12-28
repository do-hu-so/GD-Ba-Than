
import express from 'express';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
// Note: We need to point to the correct .env path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env.local') });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// Mock the API route structure
app.get('/api/cloudinary', async (req, res) => {

    try {
        const { type, tag } = req.query;
        const resourceType = type || 'image';

        // If tag is provided and not empty/null "undefined", use tag search
        // Otherwise use general resources listing
        let result;

        if (tag && tag !== 'undefined' && tag !== 'null') {
            console.log(`[Local Server] Fetching ${resourceType}s with tag: ${tag}`);
            result = await cloudinary.api.resources_by_tag(tag, {
                resource_type: resourceType,
                max_results: 100,
                context: true,
                tags: true,
                direction: 'desc'
            });
        } else {
            console.log(`[Local Server] Fetching ALL ${resourceType}s (no tag filter)`);
            result = await cloudinary.api.resources({
                resource_type: resourceType,
                max_results: 100,
                context: true,
                tags: true,
                direction: 'desc'
            });
        }

        res.json(result);
    } catch (error) {
        console.error('[Local Server] Error:', error);
        res.status(500).json({
            error: 'Failed to fetch media',
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Local API Server running at http://localhost:${PORT}`);
    console.log(`Cloud Name properly loaded: ${!!process.env.VITE_CLOUDINARY_CLOUD_NAME}`);
    console.log(`API Key properly loaded: ${!!process.env.CLOUDINARY_API_KEY}`);
});
