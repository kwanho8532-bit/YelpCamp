const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

cloudinary.config({}) // CLOUDINARY_URL은 자동으로 읽음

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'yelp-Study',
        allowedFormats: ['jpeg', 'jpg', 'png']
    }
})

module.exports = storage