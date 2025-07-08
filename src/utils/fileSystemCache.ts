import fs from 'fs';
import path from 'path';

// Define the base directory for JSON data storage
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');

// Ensure the data directory exists
function ensureDataDirectory(): void {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (error) {
      console.error(`Failed to create data directory: ${error}`);
      throw error;
    }
  }
}

/**
 * Save data to a JSON file
 * @param filename The name of the file (without .json extension)
 * @param data The data to save
 */
export function saveToFile(filename: string, data: any): void {
  ensureDataDirectory();
  const filePath = path.join(DATA_DIR, `${filename}.json`);

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Failed to write to file ${filePath}: ${error}`);
    throw error;
  }
}

/**
 * Read data from a JSON file
 * @param filename The name of the file (without .json extension)
 * @returns The parsed data or null if the file doesn't exist
 */
export function readFromFile<T>(filename: string): T | null {
  ensureDataDirectory();
  const filePath = path.join(DATA_DIR, `${filename}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Failed to read from file ${filePath}: ${error}`);
    return null;
  }
}

/**
 * Check if a file exists
 * @param filename The name of the file (without .json extension)
 * @returns Whether the file exists
 */
export function fileExists(filename: string): boolean {
  ensureDataDirectory();
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  return fs.existsSync(filePath);
}

/**
 * Delete a file
 * @param filename The name of the file (without .json extension)
 */
export function deleteFile(filename: string): void {
  ensureDataDirectory();
  const filePath = path.join(DATA_DIR, `${filename}.json`);

  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error(`Failed to delete file ${filePath}: ${error}`);
      throw error;
    }
  }
}

/**
 * List all files in the data directory
 * @returns Array of filenames (without .json extension)
 */
export function listFiles(): string[] {
  ensureDataDirectory();

  try {
    return fs.readdirSync(DATA_DIR)
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch (error) {
    console.error(`Failed to list files in ${DATA_DIR}: ${error}`);
    return [];
  }
} 