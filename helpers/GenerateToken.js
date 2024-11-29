import jwt from "jsonwebtoken";

const GenerateToken = {
    generateToken: (userId) => {
        try {
            return jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn: "30d" });
        } catch (error) {
            return Response.error(res, 500, "Error generating token", error);
        }
    }
}

export default GenerateToken;