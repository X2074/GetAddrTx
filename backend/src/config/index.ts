import dotenv from 'dotenv';
import * as process from "process";
dotenv.config();

const config = {
    server: {
        port: Number(process.env.SERVER_PORT) || 3300,
        env: process.env.NODE_ENV || 'dev'
    },
    backend: process.env.DIMAI_BACKEND_SERVER || 'https://test1.dimai.io',
    privateKey: process.env.DIMAI_FREE_PRIVATE_KEY || '',
    web3: {
        rpc: process.env.WEB3_RPC || 'http://localhost:18545',
    },
    retry: {
        max: Number(process.env.MAX_RETRIES) || 3,
        delay: Number(process.env.RETRY_DELAY) || 10000
    }
};

export default config;
