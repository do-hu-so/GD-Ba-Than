import axios from 'axios';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export interface UploadResult {
    url: string;
    secureUrl: string;
    publicId: string;
    format: string;
    resourceType: 'image' | 'video';
    width?: number;
    height?: number;
    bytes: number;
    thumbnailUrl?: string;
}

export interface MediaMetadata {
    title: string;
    description?: string;
    year: number;
    uploadedBy?: string;
}

/**
 * Upload file to Cloudinary with metadata
 */
export const uploadFile = async (
    file: File,
    metadata: MediaMetadata,
    onProgress?: (progress: number) => void
): Promise<UploadResult> => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
        throw new Error('Cloudinary configuration is missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env.local');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    // Add metadata as context
    const context = `title=${metadata.title}|year=${metadata.year}`;
    formData.append('context', context);

    // Add tags for filtering
    const tags = [
        `year_${metadata.year}`,
        file.type.startsWith('video/') ? 'video' : 'image',
        CLOUDINARY_UPLOAD_PRESET // Add preset name as tag for easier filtering
    ];
    formData.append('tags', tags.join(','));

    // Determine resource type
    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

    try {
        const response = await axios.post(uploadUrl, formData, {
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(progress);
                }
            },
        });

        const data = response.data;

        // Generate thumbnail URL for videos
        let thumbnailUrl: string | undefined;
        if (resourceType === 'video') {
            // Cloudinary auto-generates video thumbnails
            thumbnailUrl = data.secure_url.replace(/\.(mp4|mov|avi|webm)$/i, '.jpg');
        }

        return {
            url: data.url,
            secureUrl: data.secure_url,
            publicId: data.public_id,
            format: data.format,
            resourceType,
            width: data.width,
            height: data.height,
            bytes: data.bytes,
            thumbnailUrl,
        };
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`Upload failed: ${error.response.data.error?.message || 'Unknown error'}`);
        }
        throw new Error('Failed to upload file to cloud storage');
    }
};

/**
 * Get media list from Cloudinary (via secure backend API)
 */
export const getCloudinaryFiles = async (type?: 'image' | 'video'): Promise<any[]> => {
    try {
        const resourceType = type || 'image';
        // We want all images, so we don't pass a specific tag
        // const tag = CLOUDINARY_UPLOAD_PRESET; 

        // Call our own API route which uses the Admin API securely
        // Note: In development with 'vercel dev', this routes to api/cloudinary.js
        // In production, it routes to the serverless function
        const url = `/api/cloudinary?type=${resourceType}`; // removed &tag=${tag}
        console.log(`Fetching from API: ${url}`);

        const response = await axios.get(url);
        return response.data.resources || [];
    } catch (error) {
        console.error('Error fetching media list from API:', error);
        return [];
    }
};

/**
 * Construct Cloudinary URL
 */
export const getCloudinaryUrl = (publicId: string, resourceType: 'image' | 'video', version?: number): string => {
    const ver = version ? `v${version}/` : '';
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/${ver}${publicId}`;
};

/**
 * Download file from URL
 */
export const downloadFile = async (url: string, filename: string): Promise<void> => {
    try {
        const response = await axios.get(url, {
            responseType: 'blob',
        });

        // Create a temporary URL for the blob
        const blob = new Blob([response.data]);
        const blobUrl = window.URL.createObjectURL(blob);

        // Create a temporary anchor element and trigger download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Error downloading file:', error);
        throw new Error('Failed to download file');
    }
};

/**
 * Delete file from Cloudinary
 * Note: This requires server-side implementation with API secret
 */
export const deleteFile = async (publicId: string, resourceType: 'image' | 'video'): Promise<void> => {
    console.warn('Delete operation requires server-side implementation with API secret');
    console.log('File to delete:', publicId, resourceType);

    // In production, you would call your backend API to delete the file
    // Example: await axios.delete(`/api/cloudinary/${resourceType}/${publicId}`);
    throw new Error('Delete functionality requires backend implementation');
};
