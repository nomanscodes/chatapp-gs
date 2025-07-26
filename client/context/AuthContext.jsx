import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL
axios.defaults.baseURL = backendUrl

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [authUser, setAuthUser] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [socket, setSocket] = useState(null)

    // check if user is authenticated and if so, set the user data and connect the socket 

    const checkAuth = async () => {
        try {
            const response = await axios.get('/api/auth/check-auth')

            const data = response.data;



            if (data?.success) {



                setAuthUser(data?.user)
                connectSocket(data?.user)

            } else {
                setAuthUser(null)
            }
        } catch (error) {
            console.error("Error checking authentication:", error);
            setAuthUser(null)
            toast.error(error.message);
        }
    }

    // Function to handle user login

    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials)

            if (data) {
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common['token'] = data.token;
                setToken(data.token);
                localStorage.setItem('token', data.token);
                toast.success(data.message);

                

            } else {
                toast.error("Login failed. Please try again.");
            }

        } catch (error) {
            console.error("Error during login:", error);
            toast.error("Login failed");
        }
    }

    // Function to handle user logout
    const logout = () => {
        localStorage.removeItem('token');
        setAuthUser(null);
        setToken(null);
        setOnlineUsers([]);
        axios.defaults.headers.common['token'] = null;
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
        toast.success("Logged out successfully");
    }

    // update profile 
    const updateProfile = async (payload) => {
        try {
            const { data } = await axios.put('/api/auth/update-profile', payload)
            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile updated successfully");
            } else {
                toast.error(data.message || "Profile update failed");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(error.message);
        }
    }

    // Initialize socket connection
    const connectSocket = (userData) => {
        if (!userData || socket.connected) return;

        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id
            }
        })

        newSocket.connect();
        setSocket(newSocket);

        newSocket.on('getOnlineUsers', (userId) => {
            setOnlineUsers(userId)
        });

    }

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['token'] = token;
        }
        checkAuth();
    }, []);

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        token,
        login,
        logout,
        updateProfile,
        checkAuth,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}