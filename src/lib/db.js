import fs from 'fs/promises';
import path from 'path';
import { MongoClient } from 'mongodb';

const SOURCE_DATA_DIR = path.join(process.cwd(), 'src/data');
const runtimeTmpDir = process.env.TMPDIR || process.env.TEMP || '/tmp';
const defaultDataDir = process.env.NODE_ENV === 'production'
  ? path.join(runtimeTmpDir, 'khaana-bank-trust-data')
  : SOURCE_DATA_DIR;

const DATA_DIR = process.env.DATA_DIR || defaultDataDir;
const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.MONGODB_DB || 'khaana_bank_trust';

let mongoClientPromise;

function getCollectionName(filename) {
  return filename.replace(/\.json$/i, '').replace(/[^a-zA-Z0-9]/g, '_');
}

function sanitizeDoc(doc) {
  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) return doc;
  const clone = { ...doc };
  delete clone._id;
  return clone;
}

async function getMongoDb() {
  if (!MONGODB_URI) return null;

  if (!mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI);
    mongoClientPromise = client.connect();
  }

  const client = await mongoClientPromise;
  return client.db(MONGODB_DB);
}

async function readJsonFile(filePath) {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

async function readFromSourceIfExists(filename) {
  try {
    const seedPath = path.join(SOURCE_DATA_DIR, filename);
    return await readJsonFile(seedPath);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

export async function readDB(filename) {
  const db = await getMongoDb();
  if (db) {
    const collection = db.collection(getCollectionName(filename));
    const docs = await collection.find({}, { projection: { _id: 0 } }).toArray();
    if (docs.length > 0) return docs;

    const seedData = await readFromSourceIfExists(filename);
    if (seedData.length > 0) {
      await collection.insertMany(seedData.map(sanitizeDoc));
    }
    return seedData;
  }

  const filePath = path.join(DATA_DIR, filename);
  try {
    return await readJsonFile(filePath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return await readFromSourceIfExists(filename);
    }
    throw err;
  }
}

export async function writeDB(filename, data) {
  const db = await getMongoDb();
  if (db) {
    const collection = db.collection(getCollectionName(filename));
    const docs = Array.isArray(data) ? data : [];
    await collection.deleteMany({});
    if (docs.length > 0) {
      await collection.insertMany(docs.map(sanitizeDoc));
    }
    return;
  }

  const filePath = path.join(DATA_DIR, filename);
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}
