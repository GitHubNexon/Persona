const { exec } = require('child_process');

// List of dependencies to install
const dependencies = [
  'bcrypt', 
  'cookie-parser', 
  'cors', 
  'csv-parser', 
  'dotenv', 
  'express', 
  'helmet', 
  'jsonwebtoken', 
  'moment', 
  'mongoose', 
  'multer', 
  'node-cron', 
  'nodemailer', 
  'nodemon', 
  'uuid'
];

// Join dependencies into a single string
const dependenciesString = dependencies.join(' ');

// Run the npm install command with the dependencies
exec(`npm install ${dependenciesString}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error installing dependencies: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
