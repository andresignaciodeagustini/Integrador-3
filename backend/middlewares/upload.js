const multer = require('multer');
const path = require ('path');
const crypto = require ('crypto');

const storage = multer.diskStorage({
    destination: 'public/images/products',
    filename: (req,file, cb) =>{
        crypto.randomBytes(16,(error, buffer) => {
            if(error) return cb(error)
            const filename = buffer.toString('hex') + path.extname(file.originalname)


            cb(null,filename)    

                })
    }

})

const upload = multer ({ storage }).single("image");

module.exports = upload;