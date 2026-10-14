import jwt from "jsonwebtoken";

// Sign a new JWT when the user starts a new game
const signJWT = (imageId, mobile, userName) => {
  // Include the imageId string, mobile boolean and userName string
  return jwt.sign(
    {
      startedAt: Date.now(),
      imageId,
      mobile,
      userName,
      progress: [],
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
};

// Read the JWT and save it in the request so the controller can use it
const readJWT = (req, res, next) => {
  try {
    // Split the token from the header
    const token = req.headers.authorization?.split(" ")[1];
    // Verify and save it in the request
    req.gameToken = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return next(error);
  }
};

// Take the existing token and the ID of the character the user found and add it to the token progress
const updateJWT = (token, characterId) => {
  const updatedToken = {
    ...token,
    progress: [...token.progress, characterId],
  };
  // Sign the new token
  return jwt.sign(updatedToken, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export { signJWT, readJWT, updateJWT };
