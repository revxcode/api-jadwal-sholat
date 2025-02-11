import { NextApiRequest, NextApiResponse } from 'next';
import swaggerJSDoc from 'swagger-jsdoc';

const PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'API documentation for the Next.js project',
    },
    servers: [
        {
            url: `${PUBLIC_URL}/api`,
            description: 'Development server',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./pages/api/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(swaggerSpec);
}       