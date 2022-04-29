import { createContext } from "react";

export const AccountContext = createContext(null);

// This is the context file in react js. createContext is used to set an environment variable for the appliucation. 
// When the context changes the rest of the application re renders. Web3 applications work with Accounts.
// Therefore, these account context can be used to pass down the user information as a prop. and drive the UI of the application
