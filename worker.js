import { writeFile } from 'fs';
import { promisify } from 'util';
import Queue from 'bull/lib/queue';
import imgThumbnail from 'image-thumbnail';
import mongoDBCore from 'mongodb/lib/core';
import dbClient from './utils/db';
import Mailer from './utils/mailer';

// Promisify the writeFile function
const writeFileAsync = promisify(writeFile);

// Create two separate queues for thumbnail generation and email sending
const fileQueue = new Queue('Thumbnail Generation');
const userQueue = new Queue('Email Sending');

/**
 * Generates a thumbnail of an image with the specified width size.
 * @param {String} filePath The path to the original image file.
 * @param {number} size The width of the thumbnail.
 * @returns {Promise<void>}
 */
const generateThumbnail = async (filePath, size) => {
  // Generate the thumbnail with the specified size
  const buffer = await imgThumbnail(filePath, { width: size });
  console.log(`Generating thumbnail for file: ${filePath}, size: ${size}`);
  // Write the thumbnail to disk
  return writeFileAsync(`${filePath}_${size}`, buffer);
};

// Process jobs in the file queue
fileQueue.process(async (job, done) => {
  // Extract fileId and userId from job data
  const fileId = job.data.fileId || null;
  const userId = job.data.userId || null;

  // Validate the presence of fileId and userId
  if (!fileId) {
    throw new Error('Missing fileId');
  }
  if (!userId) {
    throw new Error('Missing userId');
  }

  console.log('Processing file:', job.data.name || '');

  // Retrieve the file from the database
  const file = await (await dbClient.filesCollection()).findOne({
    _id: new mongoDBCore.BSON.ObjectId(fileId),
    userId: new mongoDBCore.BSON.ObjectId(userId),
  });

  // Ensure the file exists
  if (!file) {
    throw new Error('File not found');
  }

  // Define thumbnail sizes
  const sizes = [500, 250, 100];

  // Generate thumbnails for each size
  Promise.all(sizes.map((size) => generateThumbnail(file.localPath, size)))
    .then(() => {
      done();
    });
});

// Process jobs in the user queue
userQueue.process(async (job, done) => {
  // Extract userId from job data
  const userId = job.data.userId || null;

  // Validate the presence of userId
  if (!userId) {
    throw new Error('Missing userId');
  }

  // Retrieve the user from the database
  const user = await (await dbClient.usersCollection()).findOne({
    _id: new mongoDBCore.BSON.ObjectId(userId),
  });

  // Ensure the user exists
  if (!user) {
    throw new Error('User not found');
  }

  console.log(`Sending welcome email to ${user.email}`);

  // Send welcome email to the user
  try {
    const mailSubject = 'Welcome to ALX-Files_Manager by B3zaleel';
    const mailContent = `<div><h3>Hello ${user.email},</h3>
      <p>Welcome to ALX-Files_Manager, a simple file management API built with Node.js by Bezaleel Olakunori.
      We hope it meets your needs.</p></div>`;
    // Send email
    Mailer.sendMail(Mailer.buildMessage(user.email, mailSubject, mailContent));
    done();
  } catch (err) {
    done(err);
  }
});
