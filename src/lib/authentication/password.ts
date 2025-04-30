import { createHash, randomBytes } from "crypto";

/**
 * Generates a salt for password hashing
 * @returns A random string to use as salt
 */
export function generateSalt(): string {
  return randomBytes(16).toString("hex");
}

/**
 * Hashes a password with a salt using SHA-256
 * @param password - The plain text password
 * @param salt - The salt to use in hashing
 * @returns The hashed password
 */
export function hashPassword(password: string, salt: string): string {
  return createHash("sha256")
    .update(password + salt)
    .digest("hex");
}

/**
 * Creates a salted and hashed password
 * @param password - The plain text password to hash
 * @returns An object containing the salt and hash
 */
export function saltAndHashPassword(password: string): { salt: string; hash: string } {
  const salt = generateSalt();
  const hash = hashPassword(password, salt);
  return { salt, hash };
}

/**
 * Verifies a password against a stored hash and salt
 * @param password - The plain text password to verify
 * @param storedHash - The stored password hash
 * @param storedSalt - The stored salt used for hashing
 * @returns Boolean indicating whether the password is valid
 */
export function verifyPassword(password: string, storedHash: string, storedSalt: string): boolean {
  const hash = hashPassword(password, storedSalt);
  return hash === storedHash;
} 