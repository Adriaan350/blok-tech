require('dotenv').config();

// const { MongoClient } = require('mongodb');
const uri = process.env.ATLAS_URI;
// const client = new MongoClient(uri);

const connectie = async (mongoose) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndmodify: false,
      useCreateIndex: true
    });
    console.log('Connectie werkt');
  } catch (err) {
    console.log('Connectie werkt niet');
  }
};

module.exports = connectie;

// async function run() {
//   try {
//     await client.connect();
//     const database = client.db('sample_mflix');
//     const collection = database.collection('movies');
//     // Query for a movie that has the title 'Back to the Future'
//     const query = { title: 'Back to the Future' };
//     const movie = await collection.findOne(query);
//     console.log(movie);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
