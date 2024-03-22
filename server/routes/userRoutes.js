const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const multer = require('multer');
const User = require('../models/user');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const crypto = require('crypto')
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        const now = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, now + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});



router.post('/v1/register',

body('email').isEmail().withMessage('Enter a valid email address'),
body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const message = errors.array()[0].msg;
            return res.status(400).json({ message });
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: 'User successfully registered' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/v1/login',

body('email').isEmail().withMessage('Enter a valid email address'),
body('password').isLength({ min: 6 }).withMessage('Enter a valid password'),
  
async (req, res) => {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const message = errors.array()[0].msg;
            return res.status(400).json({ message });
        }

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const payload = { id: user.id, name: user.name, email: user.email };
       const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '60h' }); 
        const refreshToken = crypto.randomBytes(40).toString('hex');
        user.refreshToken = refreshToken;
        await user.save();
        res.json({ token, refreshToken });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/v1/token', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh Token is required' });
    
    try {
        const user = await User.findOne({ refreshToken });
        if (!user) return res.status(403).json({ message: 'Refresh token is not found!' });
       
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: 'Refresh token is not valid' });
            const payload = { id: user.id, name: user.name, email: user.email };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '60h' });
            res.json({ token });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/v1/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar
    });
});


router.put('/v1/profile',
passport.authenticate('jwt', { session: false }),
upload.single('avatar'),
 [
        body('name').not().isEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('A valid email is required'),
], async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const message = errors.array()[0].msg;
            return res.status(400).json({ message });
        }
        const { name, email } = req.body;
        let updateData = { name, email };

        if (req.file) {
            updateData.avatar = req.file.path;
        }

        const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
        
        res.json({name, email,avatar:user.avatar});
        
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
