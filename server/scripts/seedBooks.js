const mongoose = require('mongoose');
const Product = require('../models/Product');
const sampleBooks = require('../data/sampleBooks');

mongoose.connect("mongodb+srv://kanugulajyothsna:0muCVSEV9VnmhtUv@cluster0.tkstb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log('MongoDB connected for seeding'))
  .catch((error) => console.log('MongoDB connection error:', error));

const seedBooks = async () => {
  try {
    // Clear existing books
    await Product.deleteMany({});
    console.log('Cleared existing books');

    // Insert sample books
    const insertedBooks = await Product.insertMany(sampleBooks);
    console.log('Sample books seeded successfully:', insertedBooks.length, 'books added');
  } catch (error) {
    console.error('Error seeding books:', error);
  } finally {
    mongoose.disconnect();
  }
};

// Run the seed function
seedBooks(); 