/**
 * Simple Authentication Service
 * Manages user credentials stored in localStorage
 */

interface UserCredentials {
  username: string;
}

/**
 * Register a new user by storing username in localStorage
 * @param username - Username for the new account
 * @returns true if registration successful, false if user already exists
 */
export const registerUser = (username: string): boolean => {
  if (!username) {
    return false;
  }

  // Check if user already exists
  const existingUser = localStorage.getItem(`user-${username}`);
  if (existingUser) {
    return false; // User already exists
  }

  // Store user credentials
  const userCredentials: UserCredentials = {
    username,
  };

  localStorage.setItem(`user-${username}`, JSON.stringify(userCredentials));
  return true;
};

/**
 * Authenticate a user by checking if username exists in localStorage
 * @param username - Username to authenticate
 * @returns true if user exists, false otherwise
 */
export const authenticateUser = (username: string): boolean => {
  if (!username) {
    return false;
  }

  // Check if user exists in localStorage
  return localStorage.getItem(`user-${username}`) !== null;
};

/**
 * Check if a username already exists
 * @param username - Username to check
 * @returns true if username exists, false otherwise
 */
export const userExists = (username: string): boolean => {
  return localStorage.getItem(`user-${username}`) !== null;
};

/**
 * Get all registered usernames
 * @returns Array of all registered usernames
 */
export const getAllUsers = (): string[] => {
  const users: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("user-")) {
      const username = key.replace("user-", "");
      users.push(username);
    }
  }
  
  return users;
};

/**
 * Delete a user account and all associated data
 * @param username - Username to delete
 * @returns true if deletion successful, false otherwise
 */
export const deleteUser = (username: string): boolean => {
  try {
    localStorage.removeItem(`user-${username}`);
    localStorage.removeItem(`player-data-${username}`);
    localStorage.removeItem(`player-inventory-${username}`);
    localStorage.removeItem(`player-dungeon-${username}`);
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
};
