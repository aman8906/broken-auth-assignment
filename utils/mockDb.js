const getSecretFromDB = async () => {
  // Simulate database/network delay
  await new Promise((resolve) => setTimeout(resolve, 120));

  if (!process.env.JWT_SECRET) {
    throw new Error(
      "Mock DB error: missing JWT_SECRET environment variable."
    );
  }

  return process.env.JWT_SECRET;
};

module.exports = { getSecretFromDB };
