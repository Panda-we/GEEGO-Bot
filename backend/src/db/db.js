const mongoose = require('mongoose');

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ Error connecting to MongoDB:', err.message);
    process.exit(1); // stop the server if DB fails to connect
  }
}

module.exports = connectToDB;
