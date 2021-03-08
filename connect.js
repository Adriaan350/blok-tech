require('dotenv').config();
const uri = process.env.ATLAS_URI;

const connectie = async (mongoose) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    console.log('Connectie werkt');
  } catch (err) {
    console.log('Connectie werkt niet');
  }
};

module.exports = connectie;