
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { type, tag } = req.query;
        const resourceType = type || 'image';
        const searchTag = tag || process.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        // Use Search API for more flexibility (supports tags, types, sorting)
        // OR use Admin API resources_by_tag

        console.log(`Fetching ${resourceType}s with tag: ${searchTag}`);

        const result = await cloudinary.api.resources_by_tag(searchTag, {
            resource_type: resourceType,
            max_results: 100,
            context: true, // Get metadata (title, year)
            tags: true,
            direction: 'desc' // Newest first
        });

        return res.status(200).json(result);
    } catch (error) {
        console.error('Cloudinary API Error:', error);
        return res.status(500).json({
            error: 'Failed to fetch media',
            details: error.message
        });
    }
}
