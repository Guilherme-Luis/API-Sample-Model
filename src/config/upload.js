import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `uploads/files`);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = crypto.randomUUID() + ext;
        cb(null, name);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = [
        `application/pdf`,
        `text/plain`,
        `application/msword`,
        `application/vnd.openxmlformats-officedocument.wordprocessingml.document`,
        `image/jpeg`,
        `image/png`,
        `image/gif`,
        `image/jpg`
    ];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Tipo de arquivo não permitido`));
    }
};

export default multer ({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});