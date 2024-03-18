import { createContext, useEffect, useState } from "react";
import axios from "axios"; 

export const authContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || '');

    const login = async (inputs) => {
        try {
            const res = await axios.post("http://localhost:8800/api/auth/login", inputs);
            // Assuming the response contains user data and token
            setCurrentUser(res.data);
           
        } catch (error) {
            console.error("Login failed", error);
        }
    }

    const logout = async () => {
        try {
            await axios.post("http://localhost:8800/api/auth/logout");
            setCurrentUser(null);
        } catch (error) {
            console.error("Logout failed", error);
        }
    }

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <authContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </authContext.Provider>
    );
}
