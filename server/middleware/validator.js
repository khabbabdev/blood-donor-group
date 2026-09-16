const { body, validationResult } = require('express-validator');

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map(err => err.msg);
    return res.status(400).json({
      success: false,
      error: extractedErrors[0], // Return the first error message
      errors: extractedErrors
    });
  }
  next();
};

const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

// Register validation rules
const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required'),
  body('bloodGroup')
    .if(body('role').equals('donor'))
    .notEmpty().withMessage('Blood group is required for donors')
    .isIn(validBloodGroups).withMessage('Invalid blood group'),
  validate
];

// Login validation rules
const loginRules = [
  body('identifier')
    .trim()
    .notEmpty().withMessage('Please provide an email or phone number'),
  body('password')
    .notEmpty().withMessage('Please provide a password'),
  validate
];

// Blood Request validation rules
const bloodRequestRules = [
  body('patientName')
    .trim()
    .notEmpty().withMessage('Patient name is required'),
  body('bloodGroup')
    .notEmpty().withMessage('Blood group is required')
    .isIn(validBloodGroups).withMessage('Invalid blood group'),
  body('hospital')
    .trim()
    .notEmpty().withMessage('Hospital name is required'),
  body('contactNumber')
    .trim()
    .notEmpty().withMessage('Contact number is required'),
  body('unitsNeeded')
    .optional()
    .isInt({ min: 1 }).withMessage('Units needed must be at least 1'),
  validate
];

// Contact form validation rules
const contactRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  validate
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  bloodRequestRules,
  contactRules
};
