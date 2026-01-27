import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import Logger from './utils/logger';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    Logger.info(`Server is running on port ${PORT}`);
});
