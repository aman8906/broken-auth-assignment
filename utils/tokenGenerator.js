const jwt = require("jsonwebtoken");
const { getSecretFromDB } = require("./mockDB");

const generateToken = async (payload) => {
  try {
    const secret = await getSecretFromDB();

    if (!secret) {
      throw new Error("Token generation failed: missing secret");
    }

    const token = jwt.sign(payload, secret, {
      expiresIn: "15m",
    });

    return token;
  } catch (error) {
    // Do NOT swallow errors
    throw new Error(`Token generation error: ${error.message}`);
  }
};

module.exports = { generateToken };
