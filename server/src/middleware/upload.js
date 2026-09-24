import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../../uploads');

try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (e) {
  // Ignore in read-only environments
}

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/jpg',
    'image/svg+xml'
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WEBP, GIF, SVG) are allowed.'), false);
  }
};

const multerInstance = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

// Middleware wrapper that creates dataUri and optional disk backup
export const upload = {
  single: (fieldName) => {
    const singleUpload = multerInstance.single(fieldName);
    return (req, res, next) => {
      singleUpload(req, res, (err) => {
        if (err) return next(err);
        if (req.file && req.file.buffer) {
          try {
            const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            req.file.dataUri = dataUri;

            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = path.extname(req.file.originalname || '.jpg').toLowerCase();
            const filename = `mariya-${uniqueSuffix}${ext}`;
            req.file.filename = filename;

            try {
              if (fs.existsSync(uploadsDir)) {
                fs.writeFileSync(path.join(uploadsDir, filename), req.file.buffer);
              }
            } catch (diskErr) {
              // Disk write failed (e.g. serverless read-only), dataUri will be used safely
            }
          } catch (procErr) {
            console.warn('[Upload Middleware] Error preparing image:', procErr.message);
          }
        }
        next();
      });
    };
  }
};

