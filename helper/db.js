const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect(
        'mongodb://dbUser:dbPassword1@ds249623.mlab.com:49623/getir-case-study',
        {useNewUrlParser: true, useUnifiedTopology: true});

    mongoose.connection.on('open', () => {
        console.log("MongoDB Connected...");
    });

    mongoose.connection.on('error', (err) => {
        console.log("MongoDB Error => ", err);
    });
};
