const multer = require('multer');
const path = require('path');
const fs = require('fs');

const generateStorage = (name) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const folderPath = path.join('public/uploads', name);

            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }



            cb(null, folderPath);
        },

        filename: (req, file, cb) => {
            const ext = file.mimetype.split('/')[1];
            cb(null, `admin-${file.fieldname}-${Date.now()}.${ext}`);
        },
    });

    return multer({ storage: storage });
};

module.exports = generateStorage;