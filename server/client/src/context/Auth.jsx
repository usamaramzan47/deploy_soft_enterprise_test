import React, { createContext, useState, useContext } from 'react';


const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({});

    // Function to update user
    const updateUser = (userData) => {
        setUser(userData);
    };

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook for easier access to the context
export const useUser = () => useContext(UserContext);
