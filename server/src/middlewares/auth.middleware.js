import jwt from "jsonwebtoken"
import User from "../model/user.model.js";

export const validateToken = async (req, res, next) => {
    try {
        const token = req.cookies.tokenStorer;
        // console.log("Auth Middleware: Token received from cookie:", token);

        if (!token) {
            // console.log("Auth Middleware: No token found in cookie.");
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SESSION_SECRET);
            // console.log("Auth Middleware: Token decoded successfully:", decoded);
        } catch (jwtError) {
            // console.log("Auth Middleware: JWT verification failed:", jwtError.message);
            return res.status(401).json({
                success: false,
                message: "Invalid token or token expired"
            });
        }

        if (!decoded || !decoded.userId) {
            // console.log("Auth Middleware: Decoded token is missing userId.");
            return res.status(401).json({
                success: false,
                message: "Invalid token payload"
            });
        }

        const user = await User.findById(decoded.userId);

        // console.log("User from decoded",user);

        if (!user) {
            // console.log("Auth Middleware: User not found from token ID:", decoded.userId);
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // console.log("Auth Middleware: Token validation successful for user:", user.email);
        req.user = {
            ...user._doc,
            id: decoded.userId,
            authMethod: decoded.authMethod // now available!
       };

        // req.user = user;
        next();
    } catch (error) {
        // console.log("Auth Middleware: General error in validateToken middleware: ", error.message);
        res.status(401).json({
            success: false,
            message: "Authentication failed"
        });
    }
}