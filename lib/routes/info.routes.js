import express from 'express';
import * as path from 'path';
import * as url from 'url';
import { networkInterfaces } from 'os';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const __filename = url.fileURLToPath(import.meta.url);

const infoRouter = express.Router();

// About page route.
infoRouter.get("/info/ip", (req, res) => {
  
    const results = Object.create(null);
    const nets = networkInterfaces();


    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
            if (net.family === familyV4Value && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }

    let ip = results["Wi-Fi"];

    if(!ip) {
        for (const name of Object.keys(results)) {
            console.log(results[name][0]);
            ip = results[name][0];
        }
    } else {
        ip = results["Wi-Fi"][0];
    }

    return res.json({
        port : process.env.SERVER_PORT,
        name : process.env.SERVER_NAME,
        ip: ip
    });
  

});

export default infoRouter;