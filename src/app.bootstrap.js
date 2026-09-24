import express from 'express';
import connectionDB from './DB/connectionDB.js';
import userRouter from './modules/users/user.router.js';
import noteRouter from './modules/notes/note.router.js';

const bootstrap = async () => {
    const app = express();
    const port = 3000;

    app.use(express.json());

    await connectionDB();

    app.use('/users', userRouter);
    app.use('/notes', noteRouter);

    app.use((req, res) => {
        res.status(404).json({ 
            message: `Url: ${req.originalUrl} with method: ${req.method} Not Found`,
            statusCode: 404
        });
    });

    app.listen(port, () => {
        console.log(`Express app listening on port ${port}!`);
    });
};

export default bootstrap;