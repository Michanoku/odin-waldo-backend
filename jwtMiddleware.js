import jwt from "jsonwebtoken";


const signJWT = (imageId, userName) => {
    return jwt.sign(

    {
        startedAt: Date.now(),
        imageId,
        userName,
        progress: [],
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
    );
}

const readJWT = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
}