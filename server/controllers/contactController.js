const Contact = require('../models/Contact');
const { ErrorResponse } = require('../middleware/errorHandler');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return next(new ErrorResponse('Please fill in all fields', 400));
    }

    const contact = await Contact.create({ name, email, subject, message });

    // Send email notification to admin
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || 'sk.khabbab50@gmail.com';

    // Only attempt to send email if SMTP is configured
    const isRealSMTP = process.env.SMTP_USER &&
                      process.env.SMTP_USER !== 'your_email@gmail.com' &&
                      process.env.SMTP_PASS &&
                      process.env.SMTP_PASS !== 'your_app_password';

    if (isRealSMTP) {
      try {
        await sendEmail({
          to: adminEmail,
          subject: `[Contact Form] ${subject} - ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #e11d48;">নতুন যোগাযোগ বার্তা</h2>
              <p><strong>প্রেরক:</strong> ${name} (${email})</p>
              <p><strong>বিষয়:</strong> ${subject}</p>
              <hr style="border: 1px solid #eee;" />
              <p><strong>বার্তা:</strong></p>
              <p style="background: #f9fafb; padding: 15px; border-radius: 8px;">${message.replace(/\n/g, '<br/>')}</p>
            </div>
          `
        });
      } catch (emailErr) {
        console.error('Contact email notification failed:', emailErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
exports.getAllContacts = async (req, res, next) => {
  try {
    const { isRead, page = 1, limit = 20 } = req.query;

    const query = {};
    if (isRead !== undefined) query.isRead = isRead === 'true';

    const startIndex = (page - 1) * limit;
    const total = await Contact.countDocuments(query);

    const contacts = await Contact.find(query)
      .sort('-createdAt')
      .skip(startIndex)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      contacts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a contact message as read
// @route   PUT /api/contact/:id/read
// @access  Private/Admin
exports.markContactAsRead = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return next(new ErrorResponse('Contact message not found', 404));
    }

    contact.isRead = true;
    await contact.save();

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      contact
    });
  } catch (error) {
    next(error);
  }
};
