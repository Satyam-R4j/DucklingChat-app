export function singup(req, res) {

    const { email, password, fullName } = req.body

    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

    } catch (error) {

    }

}
export function login(req, res) {

    res.send("Login route")

}
export function logout(req, res) {
    res.send("Logout route")

}