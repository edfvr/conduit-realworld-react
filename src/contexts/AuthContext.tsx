import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { AuthContextType, User } from "../Types/AuthContextType";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode; // ReactNode allows any valid React children to be passed
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  // Use useEffect to chekc if token is present or not
  useEffect(() => {
    if (token) {
      // update localStorage with token if token is present
      localStorage.setItem("token", token);
      fetchUser();
    } else {
      // remove token if it is null
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  /**
   * Fetches user data from the RealWorld API
   *  using the current token stored in state.
   */
  const fetchUser = async () => {
    try {
      const response = await fetch("https://api.realworld.io/api/user", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        setToken(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setToken(null);
    }
  };

  /**
   * Initiates a login attempt for the user
   *   with the provided email and password.
   * @param email The user's email
   * @param password The user's password
   */
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("https://api.realworld.io/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: { email, password } }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.user.token);
        setUser(data.user);
      } else {
        const errorData = await response.json();
        // Check if there are errors for "email or password"
        if (errorData.errors && errorData.errors["email or password"]) {
          // if password is wrong
          if (errorData.errors["email or password"].includes("is invalid")) {
            throw new Error("Wrong email/password combination");
          }
        }
        // Email can't be found
        throw new Error("Email not found. Sign up first");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  /**
   * Registers a new user with the RealWorld API
   *  using provided username, email, and password.
   * @param username The username of the new user.
   * @param email The email address of the new user.
   * @param password The password of the new user.
   */
  const signup = async (username: string, email: string, password: string) => {
    try {
      // Send a POST request to the RealWorld API to create a new user
      const response = await fetch("https://api.realworld.io/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: { username, email, password } }),
      });

      //If the HTTP response is successful, parse the response body and set state
      if (response.ok) {
        const data = await response.json();
        setToken(data.user.token);
        setUser(data.user);
      } else {
        const errorData = await response.json();
        // Check if there are any errors in the response
        if (errorData.errors) {
          if (
            // 1. Check if the email has already been taken
            errorData.errors.email &&
            errorData.errors.email.includes("has already been taken")
          ) {
            throw new Error("Email already exists. Try logging in");
          }
          if (
            // 2. Check if the username has already been taken
            errorData.errors.username &&
            errorData.errors.username.includes("has already been taken")
          ) {
            throw new Error(
              "Username already exists. Please choose a different username"
            );
          }
          throw new Error(
            "Sign up failed: " + JSON.stringify(errorData.errors)
          );
        }
        throw new Error("Sign up failed");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  /**
   * Logs out the current user
   *  by clearing both token and user states.
   */
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        isAuthenticated: !!token,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access the authentication context.
 * Throws an error if used outside of the AuthProvider.
 * @returns The authentication context
 *  containing user data and authentication methods.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
