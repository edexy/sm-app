const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const authCtrl = require('./controllers/auth')
const courseCtrl = require('./controllers/course')

//auth routes
router.post('/getToken', [
        check('email').not().isEmpty().trim().escape().isEmail().withMessage('Your email is not valid'),
    ],
    authCtrl.getToken);

router.post('/register',

    //validate all required user input
    [
        check('first_name').not().isEmpty().trim().escape().withMessage('First name is required'),
        check('last_name').not().isEmpty().trim().escape().withMessage('Last name is required'),
        check('dob').not().isEmpty().trim().escape().withMessage('DOB is required'),
        check('email').not().isEmpty().trim().escape().isEmail().withMessage('Your email is not valid'),
        check('password').not().isEmpty().trim().escape().withMessage('Password field is required'),
    ],

    //proceed to create user module in auth controller
    authCtrl.createUser

);

router.post('/signin', [
        check('email').not().isEmpty().trim().escape().isEmail().withMessage('Your email is not valid'),
        check('password').not().isEmpty().trim().escape().withMessage('Password field is required'),
    ],
    authCtrl.signIn);

//course routes
//auth routes
router.post('/enrol', courseCtrl.createEnrollment);
router.get('/:student_id', courseCtrl.listEnrolments);

module.exports = router;