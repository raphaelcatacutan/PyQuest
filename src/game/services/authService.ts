/**
 * Simple Authentication Service
 * Manages user credentials stored in localStorage
 */

interface UserCredentials {
  username: string;
  password: string;
}

/**
 * Register a new user by storing credentials in localStorage
 * @param username - Username for the new account
 * @param password - Password for the new account
 * @returns true if registration successful, false if user already exists
 */
export const registerUser = (username: string, password: string): boolean => {
  if (!username || !password) {
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
    password,
  };

  localStorage.setItem(`user-${username}`, JSON.stringify(userCredentials));
  return true;
};

/**
 * Authenticate a user by checking credentials against localStorage
 * @param username - Username to authenticate
 * @param password - Password to check
 * @returns true if credentials are valid, false otherwise
 */
export const authenticateUser = (username: string, password: string): boolean => {
  if (!username || !password) {
    return false;
  }

  // Get user credentials from localStorage
  const storedUser = localStorage.getItem(`user-${username}`);
  
  if (!storedUser) {
    return false; // User does not exist
  }

  try {
    const userCredentials: UserCredentials = JSON.parse(storedUser);
    
    // Check password (simple comparison - in production, use bcrypt or similar)
    return userCredentials.password === password;
  } catch (error) {
    console.error("Error authenticating user:", error);
    return false;
  }
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
