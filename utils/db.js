import mongodb from 'mongodb';
// eslint-disable-next-line no-unused-vars
import Collection from 'mongodb/lib/collection';
import envLoader from './env_loader';

/**
 * Manages connections and operations with MongoDB.
 */
class DBClient {
  /**
   * Initializes a new instance of the DBClient class.
   */
  constructor() {
    // Load environment variables
    envLoader();

    // Extract connection parameters from environment variables or use defaults
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    // Construct the database URL
    const dbURL = `mongodb://${host}:${port}/${database}`;

    // Create a new MongoDB client and establish a connection
    this.client = new mongodb.MongoClient(dbURL, { useUnifiedTopology: true });
    this.client.connect();
  }

  /**
   * Checks if the connection to the MongoDB server is active.
   * @returns {boolean} True if the connection is active, false otherwise.
   */
  isAlive() {
    return this.client.isConnected();
  }

  /**
   * Retrieves the number of users stored in the database.
   * @returns {Promise<Number>} A promise resolving to the number of users.
   */
  async countUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  /**
   * Retrieves the number of files stored in the database.
   * @returns {Promise<Number>} A promise resolving to the number of files.
   */
  async countFiles() {
    return this.client.db().collection('files').countDocuments();
  }

  /**
   * Retrieves a reference to the 'users' collection in the database.
   * @returns {Promise<Collection>} A promise resolving to the 'users' collection reference.
   */
  async getUsersCollection() {
    return this.client.db().collection('users');
  }

  /**
   * Retrieves a reference to the 'files' collection in the database.
   * @returns {Promise<Collection>} A promise resolving to the 'files' collection reference.
   */
  async getFilesCollection() {
    return this.client.db().collection('files');
  }
}

// Export a singleton instance of the DBClient class
export const dbClient = new DBClient();
export default dbClient;
