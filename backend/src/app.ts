import { v4 as uuidv4 } from 'uuid';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';

import prisma from './db/client';
import Logger from './utils/logger';
import authRoutes from './routes/authRoutes';
import subjectRoutes from './routes/subjectRoutes';
import { authLimiter, apiLimiter } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorMiddleware';

// Initialize App
const app = express();

// Load OpenAPI Spec
const swaggerDocument = yaml.load(path.join(__dirname, '../openapi.yaml'));

// Request ID Middleware (Must be first)
// ... (rest of middleware)

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use((req: any, res, next) => {
    req.id = uuidv4();
    res.setHeader('X-Request-Id', req.id);
    next();
});

// Security Headers (Helmet)
app.use(helmet());

// CORS Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting
app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Logging
morgan.token('reqId', (req: any) => req.id);
morgan.token('userId', (req: any) => req.user?.userId || 'guest');

const morganFormat = ':reqId :userId :method :url :status :res[content-length] - :response-time ms';

app.use(morgan(morganFormat, {
    stream: {
        write: (message) => Logger.http(message.trim()),
    },
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);

// Health Check Endpoint (Liveness & Readiness)
app.get('/health', async (req, res) => {
    try {
        // Check DB Connection
        await prisma.$queryRaw`SELECT 1`;

        res.status(200).json({
            status: 'UP',
            db: 'CONNECTED',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    } catch (error) {
        Logger.error('Health Check Failed: DB Disconnected');
        res.status(503).json({
            status: 'DOWN',
            db: 'DISCONNECTED',
            error: 'Database unavailable'
        });
    }
});

// Basic Metrics Endpoint (Prometheus-style could be added here later)
app.get('/metrics', (req, res) => {
    const memoryUsage = process.memoryUsage();

    res.json({
        system: {
            uptime: process.uptime(),
            timestamp: Date.now(),
        },
        memory: {
            rss: Math.round(memoryUsage.rss / 1024 / 1024) + " MB",
            heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + " MB",
            heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + " MB",
        },
        load: process.cpuUsage()
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

export default app;
