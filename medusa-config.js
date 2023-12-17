const dotenv = require("dotenv");

let ENV_FILE_NAME = ""
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production"
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging"
    break;
  case "test":
    ENV_FILE_NAME = ".env.test"
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env"
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME })
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS = process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001"

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000"

const DATABASE_URL = process.env.DATABASE_URL || "postgres://localhost/medusa-starter-default"

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `medusa-file-s3`,
    options: {
      s3_url: process.env.S3_URL,
      bucket: process.env.S3_BUCKET,
      region: process.env.S3_REGION
    },
  },
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  },
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
      },
    },
  },
]

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
}

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
}
