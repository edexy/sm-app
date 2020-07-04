const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const { validationResult } = require('express-validator');

const db = require('../db');


exports.getToken = async(req, res, next) => {
    try {
        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Registration failed',
                status: 'Failed',
                errors: errors.array()
            });
        }

        const { email } = req.body;
        const token = '1234'
        await sendToken(email, token);

        const docRef = db.collection('tokens').doc(email);

        await docRef.set({
            email,
            token

        });
        return res.status(201).json({
            status: 'SUCCESS',
            message: `Verification token has been sent to ${email}`,

        });

    } catch (err) {
        return next(err);
    }
};


exports.createUser = async(req, res, next) => {
    try {
        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Registration failed',
                status: 'Failed',
                errors: errors.array()
            });
        }

        const { first_name, last_name, email, password, dob, gender, username } = req.body;

        // generate bcrypt salt
        const salt = await bcrypt.genSalt(10);
        // hash password
        const hashedPassword = await bcrypt.hash(password, salt);

        const docRef = db.collection('users').doc('email');

        await docRef.set({
            password: hashedPassword,
            first_name,
            last_name,
            email,
            username,
            dob,
            gender
        });

        return res.status(201).json({
            status: 'SUCCESS',
            message: 'Registration successful.'

        });


    } catch (err) {
        return next(err);
    }
};

exports.signIn = async(req, res, next) => {

    try {
        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

        if (!errors.isEmpty()) {
            return res.status(400).json({
                data: {
                    message: 'validation error',
                    status: 1,
                    errors: errors.array()
                }
            });
        }

        const { email, password } = req.body;

        const usersRef = db.collection('users');

        // Create a query against the collection
        const queryRef = await usersRef.where('email', '==', email).get();

        queryRef.forEach(async(doc) => {
            const user = await doc.data();

            if (!user) {
                //account doesn't exist
                return res.status(401).json({
                    message: 'authentication error',
                    status: 'failed',
                });
            }

            // compare password
            bcrypt.compare(password, user.password, async(err, result) => {
                //password matches
                if (result === true) {
                    //remove password field from the returned user
                    delete user.password;
                    return res.status(200).json({
                        status: 'success',
                        message: 'Login successful.',
                        user
                    });

                } else {
                    //password didn't match
                    return res.status(400).json({
                        message: 'authentication error',
                        status: "failed"

                    });
                }
            });

        });


    } catch (error) {
        next(error);
    }
};


const sendToken = async(email, token) => {

    let testAccount = await nodemailer.createTestAccount();


    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"SM-API" <smapi@example.com>', // sender address
        to: email,
        subject: "Registration Token",
        html: `<b>Please use the token below for your registration<br>${token}</b>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}