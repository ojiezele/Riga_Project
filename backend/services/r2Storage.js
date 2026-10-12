import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

// Initialize S3-compatible client for Cloudflare R2
const r2AccountId = process.env.R2_ACCOUNT_ID || '';
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID || '';
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
const r2BucketName = process.env.R2_BUCKET_NAME || 'riga-production-bucket';

let s3Client = null;

if (r2AccountId && r2AccessKeyId && r2SecretAccessKey) {
    try {
        s3Client = new S3Client({
            region: 'auto',
            endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: r2AccessKeyId,
                secretAccessKey: r2SecretAccessKey,
            },
        });
        console.log('☁️ Cloudflare R2 Storage client initialized successfully');
    } catch (err) {
        console.warn('Failed to initialize Cloudflare R2 client:', err.message);
    }
} else {
    console.log('ℹ️ Cloudflare R2 running in hybrid/mock fallback mode (set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY in env for live S3 mode)');
}

/**
 * Uploads compiled static site HTML or assets directly to Cloudflare R2
 */
export async function uploadToR2(key, body, contentType = 'text/html') {
    if (!s3Client) {
        return {
            success: true,
            storage: 'local_fallback',
            key,
            url: `/api/media/proxy?key=${encodeURIComponent(key)}`,
            timestamp: new Date().toISOString()
        };
    }

    try {
        const command = new PutObjectCommand({
            Bucket: r2BucketName,
            Key: key,
            Body: body,
            ContentType: contentType,
            CacheControl: 'public, max-age=3600, s-maxage=86400'
        });

        await s3Client.send(command);
        
        const publicDomain = process.env.R2_PUBLIC_DOMAIN;
        const fileUrl = publicDomain 
            ? `https://${publicDomain}/${key}`
            : `/api/media/proxy?key=${encodeURIComponent(key)}`;

        return {
            success: true,
            storage: 'cloudflare_r2_live',
            key,
            url: fileUrl,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('R2 Upload Error:', error);
        throw new Error(`Failed to upload to Cloudflare R2: ${error.message}`);
    }
}

export async function getObjectFromR2(key) {
    if (!s3Client) {
        throw new Error('R2 client not initialized');
    }
    const command = new GetObjectCommand({
        Bucket: r2BucketName,
        Key: key
    });
    return await s3Client.send(command);
}

/**
 * Deletes an object from Cloudflare R2
 */
export async function deleteFromR2(key) {
    if (!s3Client) return { success: true, storage: 'local_fallback' };

    try {
        const command = new DeleteObjectCommand({
            Bucket: r2BucketName,
            Key: key
        });
        await s3Client.send(command);
        return { success: true, storage: 'cloudflare_r2_live' };
    } catch (error) {
        console.error('R2 Delete Error:', error);
        return { success: false, error: error.message };
    }
}

export function isR2Live() {
    return !!s3Client;
}
