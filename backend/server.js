const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');

const app = express();
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/files', async (_, res) => {
    try {
        const files = await prisma.file.findMany({
            select: {
                id: true,
                title: true,
                size: true,
            },
        });

        const filesInfo = files.map(file => ({
            id: file.id,
            title: file.title,
        }));

        res.status(200).json(filesInfo);
    } catch (error) {
        console.error('Error getting files:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/files/upload', upload.single('file'), async (req, res) => {
    try {
        const { originalname, mimetype, buffer } = req.file;
        console.log(req.file);

        const savedFile = await prisma.file.create({
            data: {
                title: originalname,
                mimetype,
                size: buffer.length,
                file: buffer.toString('base64'),
                extension: originalname.split('.').pop(),
            },
        });

        res.status(200).json({ message: 'File uploaded successfully', fileId: savedFile.id });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/files/download/:id', async (req, res) => {
    try {
        const fileId = parseInt(req.params.id);

        const file = await prisma.file.findUnique({
            where: { id: fileId },
        });

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Convert the base64 string back to a buffer
        const buffer = Buffer.from(file.file, 'base64');

        // Set the appropriate response headers
        res.set('Content-Disposition', `attachment; filename="${file.title}"`);
        res.set('Content-Type', file.mimetype);

        res.send(buffer);
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/files/:id', async (req, res) => {
    try {
        const fileId = parseInt(req.params.id);

        const existingFile = await prisma.file.findUnique({
            where: { id: fileId },
        });

        if (!existingFile) {
            return res.status(404).json({ error: 'File not found' });
        }

        await prisma.file.delete({
            where: { id: fileId },
        });

        res.status(200).json({ message: 'File deleted successfully', fileId });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
