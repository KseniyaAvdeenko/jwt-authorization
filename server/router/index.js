const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware')

router.post(
    '/sign-up',
    body('email').isEmail(),
    body('password').isLength({min: 3}),
    userController.signUp
);
router.post('/sign-in', userController.signIn);
router.post('/sign-out',authMiddleware, userController.signOut);
router.get('/activation/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);

module.exports = router;