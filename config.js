require('dotenv').config()

const config = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
}

for (const [key, value] of Object.entries(config)) {
  if (value === undefined) {
    throw new Error(`Define the ${key} env var.`)
  }
}

module.exports = config
