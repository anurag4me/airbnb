const multer = require("multer");

const randomName = (length) => {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for(let i=0; i<length; i++){
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if(file.fieldname === 'photo') {
        cb(null, "uploads/homes");
    } else if(file.fieldname === 'rule') {
        cb(null, "uploads/rules");
    } else {
        cb(new Error(`Unexpected field: ${file.fieldname}`))
    }
  },
  filename: (req, file, cb) => {
    cb(null, randomName(10) + '-' + file.originalname);
  }
})

const fileFilter = (req, file, cb) => {
  if(['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, PNG and PDF files are allowed'), false);
  }
}

const upload = multer({
  storage,
  fileFilter
});

module.exports = upload;