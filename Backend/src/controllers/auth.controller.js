import User from "../models/User.js"
import { upsertStreamUser } from "../lib/stream.js"
import jwt from "jsonwebtoken"


export async function signup(req, res) {

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

        const existUser = await User.findOne({ email })

        if (existUser) {
            return res.status(400).json({ message: "Email already exists, please use a different one" })
        }

        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://robohash.org/user${idx}.png`

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar
        })

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || ""
            })

            console.log(`Stream user created for ${newUser.fullName}`)
        } catch (error) {

            console.log("Error creating Stream user: ", error)

        }



        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER;
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction ? true : false,
        })

        res.status(201).json({ success: true, user: newUser })

    } catch (error) {
        console.log("Error in signup controller", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function login(req, res) {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(401).json({ message: "All fields are required" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Invalid user or password" })
        }

        const isPasswordCorrect = await user.matchPassword(password)
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid user or password" })

        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER;
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction ? true : false,
        })

        res.status(201).json({ success: true, user })

    } catch (error) {
        console.log("Error in login controller", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export function logout(req, res) {
    const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER;
    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction ? true : false,
    });
    res.status(200).json({ success: true, message: "Logout successful" })
}



export async function onboard(req, res) {
    try {
        const userId = req.user._id

        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body

        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ].filter(Boolean)
            })
        }

        const updateUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true
        }, { new: true })

        if (!updateUser) {
            return res.status(404).json({ message: "User not found" })
        }

        try {
            await upsertStreamUser({
                id: updateUser._id.toString(),
                name: updateUser.fullName,
                image: updateUser.profilePic || ""
            })
            console.log(`Stream user updated after onbording for ${updateUser.fullName}`)
        } catch (streamError) {
            console.log("Error updating stream user during onboarding:", streamError)
        }

        res.status(200).json({ success: true, user: updateUser })
    } catch (error) {
        console.error("Onboarding error: ", error)
        res.status(500).json({ message: "Internal Server Error" })
    }

}