
# Express Authentication App

This is a simple Express application for user authentication, using MongoDB for data storage and Nodemailer for sending authentication codes via email.

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Routes](#routes)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project aims to create a basic Express application for user authentication, with MongoDB as the database and Nodemailer for sending authentication codes via email.

## Prerequisites

Before you begin, make sure you have Node.js and npm installed on your machine.

## Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    ```

2. Install dependencies:

    ```bash
    npm install

## Usage

To use the application, follow these steps:

1. Configure MongoDB connection in `app.js`.
2. Set up Nodemailer by providing the appropriate Gmail email and password in `app.js`.
3. Run the application:

    ```bash
    npm start
    ```

The application will be accessible at [http://localhost:8000](http://localhost:8000).

## Dependencies

The following npm packages are used in this project:

- Express
- Body-parser
- Mongoose
- Express-session
- Path
- Nodemailer

## Configuration

In `app.js`, set up the MongoDB connection and configure Nodemailer with your Gmail email and password.

```javascript
// MongoDB connection
mongoose.connect('mongodb+srv://<username>:<password>@<your-mongodb-url>', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'your-gmail-email@gmail.com',
    pass: 'your-gmail-password',
  },
});
