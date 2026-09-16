const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'adminpassword123';

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      admin.role = 'admin';
      admin.isApproved = true;
      admin.isActive = true;
      admin.password = adminPassword;
      await admin.save();
      console.log('Admin account updated successfully!');
    } else {
      admin = await User.create({
        name: 'সিস্টেম অ্যাডমিন',
        email: adminEmail,
        password: adminPassword,
        phone: '01700000000',
        role: 'admin',
        isApproved: true,
        isActive: true,
        address: 'ঢাকা, বাংলাদেশ'
      });
      console.log('New Admin account created successfully!');
    }

    console.log('-----------------------------------');
    console.log('ADMIN LOGIN CREDENTIALS:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('-----------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
