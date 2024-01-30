const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();
const port = process.env.PORT || 8000;

// Add body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Set up session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));

// Connect to MongoDB
mongoose.connect('MongoDBlink', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((e) => {
  console.error('Failed to connect to MongoDB:', e);
});

// Define the user schema
const logInSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: String,
  authCode: String,
});

// Create the user model
const LogInCollection = mongoose.model('LogInCollection', logInSchema);

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'YOUER_GMAIL_ACCOUNT',
    pass: 'GMAIL_PASSWORD', // You get this form app password in Gamil
  },
});

// Verify transporter
transporter.verify(function (error, success) {
  if (error) {
    console.error('Error verifying Nodemailer transporter:', error);
  } else {
    console.log('Nodemailer transporter is ready to send emails');
  }
});

// Set up template and public paths
const templatePath = path.join(__dirname, '../templates');
const publicPath = path.join(__dirname, '../public');
app.set('view engine', 'hbs');
app.set('views', templatePath);
app.use(express.static(publicPath));

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next(); // Continue to the next middleware or route handler
  } else {
    return res.redirect('/'); // Redirect to login if the user is not authenticated
  }
};

// Login form submission
app.post('/login', async (req, res) => {
  console.log('Received login request');
  console.log('Form data:', req.body);

  // Check if the user is already authenticated
  if (req.session.user) {
    return res.redirect('/home');
  }

  // Destructure name and authCode from req.body
  const { name, authCode } = req.body;

  try {
    console.log('Querying database with parameters:', { name, authCode });
    const user = await LogInCollection.findOne({ name, authCode });
    console.log('User found in database:', user);

    if (user) {
      // Store user information in the session
      req.session.user = user;

      console.log('Successful login');

      // Successful login, redirect to '/home'
      return res.redirect('/home');
    } else {
      console.log('Failed login');

      // Failed login, render the login page with an error message
      return res.render('login', { error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error in database query:', error);
    return res.send('An error occurred during login');
  }
});
app.get('/signup', (req, res) => {
  res.render('signup');
});
// Sign up form submission
app.post('/signup', async (req, res) => {
  const { name, password, email } = req.body;

  try {
    const existingUser = await LogInCollection.findOne({ name });

    if (existingUser) {
      return res.send('User with the same name already exists');
    } else {
      const authCode = generateAuthCode();
      await sendAuthCodeEmail(email, authCode);

      const newUser = new LogInCollection({
        name,
        password,
        email,
        authCode,
      });

      await newUser.save();

      res.render('auth', { email });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.send('An error occurred during signup');
  }
});

// Home route (authenticated)
app.get('/home', isAuthenticated, (req, res) => {
  res.render('home');
});

// Login route
app.get('/', (req, res) => {
  res.render('login', { error: '' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Helper function to generate authentication code
function generateAuthCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper function to send authentication code via email
async function sendAuthCodeEmail(email, authCode) {
  const mailOptions = {
    from: 'your-gmail-email@gmail.com',
    to: email,
    subject: 'Authentication Code',
    text: `Your authentication code: ${authCode}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
