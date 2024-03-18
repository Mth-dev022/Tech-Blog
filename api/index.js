// index.js

const express = require('express')
const app = express()

const {router} = require('./routes/posts')
const userRoutes = require('./routes/users.js')
const authRoutes = require('./routes/auth.js')

const cors = require('cors')
const cookieParser = require('cookie-parser')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../client/public/upload')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({storage})

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

app.post('/api/upload', upload.single('file'), (req, res) => {
    const file = req.file
    res.status(200).json(file.filename)
})

app.use('/api/posts', router)
app.use('/api/auth', authRoutes)
app.use('/api/auth', authRoutes)


app.listen(8800, () => {console.log('Connected')})
