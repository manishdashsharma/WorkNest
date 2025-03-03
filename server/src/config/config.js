import dotenvFlow from 'dotenv-flow'

dotenvFlow.config()

const config ={
    ENV: process.env.ENV,
    PORT: process.env.PORT,
    SERVER_URL: process.env.SERVER_URL,
    DATABASE_URL: process.env.DATABASE_URL
}

console.log(config);

export default config;
