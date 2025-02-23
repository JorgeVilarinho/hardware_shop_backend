import express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'

const storage = multer.diskStorage({
  destination: 'public/images',
  filename: (_, file, cb) => {
    if(fs.existsSync(path.join('public/images', file.originalname))) {
      console.log('File exists')

      fs.unlink(path.join('public/images', file.originalname), (err) => {
        if (err) {
          console.error(`Error removing file: ${err}`);
          return;
        }
      
        console.log(`The file has been successfully removed.`);
      })
    }
    
    cb(null, `${file.originalname}`)
  }
})
const upload = multer({ storage })

export default (router: express.Router) => {
  router.post('/api/images/image', upload.single('uploadImage'), (req, res) => {
    res.status(200).json({ message: 'Se ha subido correctamente la imagen' })
  })
}