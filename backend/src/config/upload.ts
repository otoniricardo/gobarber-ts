import multer, { StorageEngine } from 'multer';
import { resolve } from 'path';
import crypto from 'crypto';

const tmpFolder = resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 's3' | 'disk';

  tmpFolder: string;
  uploadsFolder: string;

  multer: {
    storage: StorageEngine;
  };

  config: {
    aws: {
      bucket: 'app-gobarber-otoniricardo';
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder,
  uploadsFolder: resolve(tmpFolder, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname}`;
        return callback(null, fileName);
      },
    }),
  },

  config: {
    aws: {
      bucket: 'app-gobarber-otoniricardo',
    },
  },
} as IUploadConfig;
