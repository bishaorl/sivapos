import httpRequest from '../../utils/request'

const register = async (user) => {
    // localhost:5000/api/auth/register
    const response = await httpRequest.post("/auth/register", user)
    return response.data
}

const login = async (user) => {
    // localhost:5000/api/auth/login
    const response = await httpRequest.post("/auth/login", user)
    return response.data
}

const logout = async () => {
    // localhost:5000/api/auth/logout
    const response = await httpRequest.post("/auth/logout")
    return response.data
}

const allUsers = async () => {
    // localhost:5000/api/auth/users
    const response = await httpRequest.get("/auth/users")
    return response.data
}

const updateUser = async (userId, userData) => {
    // localhost:5000/api/auth/update-user/:userId
    const response = await httpRequest.put("/auth/update-user/" + userId, userData)
    return response.data
}

const removeUser = async (userId) => {
    // localhost:5000/api/auth/remove-user/:userId
    const response = await httpRequest.delete("/auth/remove-user/" + userId)
    return response.data
}

const authService = {
    register,
    login,
    logout,
    allUsers,
    updateUser,
    removeUser
}

export default authService
