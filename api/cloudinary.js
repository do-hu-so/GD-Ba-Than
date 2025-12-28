
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

        let result;

        // If tag is provided and is a valid string, user matches tag
        if (tag && tag !== 'undefined' && tag !== 'null') {
            console.log(`Fetching ${resourceType}s with tag: ${tag}`);
            result = await cloudinary.api.resources_by_tag(tag, {
                resource_type: resourceType,
                max_results: 100,
                context: true,
                tags: true,
                direction: 'desc'
            });
        } else {
            // Otherwise fetch ALL resources
            console.log(`Fetching ALL ${resourceType}s (no tag filter)`);
            result = await cloudinary.api.resources({
                resource_type: resourceType,
                max_results: 100,
                context: true,
                tags: true,
                direction: 'desc'
            });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error('Cloudinary API Error:', error);
        return res.status(500).json({
            error: 'Failed to fetch media',
            details: error.message
        });
    }
}
