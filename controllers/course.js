const db = require('../db');


exports.createEnrollment = async(req, res, next) => {
    try {

        const { student_id, course_name } = req.body;

        const docRef = db.collection('enrollments').doc(`${student_id}-${course_name}`);

        await docRef.set({
            course_name,
            student_id,
            registration_date: new Date(Date.now())
        });

        return res.status(201).json({
            status: 'SUCCESS',
            message: 'Enrollments successful.'

        });


    } catch (err) {
        return next(err);
    }
};

exports.listEnrolments = async(req, res, next) => {
    try {
        const { student_id } = req.params;

        const coursesRef = db.collection('enrollments');

        // Create a query against the collection
        const queryRef = await coursesRef.where('student_id', '==', student_id).get();

        let enrollments = [];

        queryRef.forEach((doc) => {
            enrollments.push(doc.data())
        });
        return res.status(200).json({
            status: 'SUCCESS',
            message: 'successful.',
            enrollments

        });

    } catch (error) {
        next(error)
    }
}