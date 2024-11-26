const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup (disable layout)
app.engine('handlebars', exphbs({ defaultLayout: false }));
app.set('view engine', 'handlebars');

// Serve static files from the public folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve the index.html as homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Route to handle form submission and send the email
app.post('/send', (req, res) => {
  const { name, email, password } = req.body;

  // Email content
  const output = `
    <p>A new user has signed up!</p>
    <h3>User Details</h3>
    <ul>
      <li>Name: ${name}</li>
      <li>Email: ${email}</li>
      <li>Password: ${password}</li>
    </ul>
  `;

  // Configure Nodemailer transporter with hardcoded credentials
  let transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',  // Correct Outlook SMTP server
    port: 587,  // Port for TLS
    secure: false,  // false means using TLS
    auth: {
      user: 'rawanalbinzayed@outlook.com',  // Your Outlook email
      pass: '',  // Your password or App password
    },
    tls: {
      rejectUnauthorized: false,  // To prevent SSL errors
    },
  });
  

  // Email options
  let mailOptions = {
    from: 'rawanalbinzayed@outlook.com',  // Sender's email
    to: email,  // Sends email to the user who signed up
    subject: 'This is to test the lab',
    html: output,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.json({ success: false });
    } else {
      console.log('Email sent: %s', info.messageId);
      res.json({ success: true });
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
