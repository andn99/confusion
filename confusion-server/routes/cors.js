import express from 'express';
import cors from 'cors';

const app = express();
export const corsDefault = cors();

const whiteList = ['http://localhost:3000', 'https://localhost:3443'];
const corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    if(whiteList.indexOf(req.header('Origin')) !== -1){
        corsOptions = {origin: true};
    }else{
        corsOptions = {origin: false};
    }
    callback(null, corsOptions);
}

export const corsWithOptions = cors(corsOptionsDelegate);