const express = require("express");
const { jwtDecode } = require("jwt-decode");
const { connectToDatabase } = require("../models/db/connect");
const axios = require('axios');
const accounts = require("../models/accounts");
const messages = require("../models/messages")
require('dotenv').config();
const router = express.Router();


router.post("/signup", async (req, res) => {
    try {
        let data = req.body;
        if (!data || !data.credential) {
            return res.status(500).json({
                sucess: false,
                message: "Bad Request",
            });
        }
        const decoded = jwtDecode(data.credential);
        data = decoded;

        connectToDatabase();
        const find = await accounts.findOne({ email: data.email });
        if (find && find._id) {
            return res.status(200).json({ success: true, token: find._id });
        } else {
            let imageUrl = data.picture;
            let base64;

            try {
                const res = await axios.get(imageUrl, {
                    responseType: "arraybuffer",
                });
                const buffer = Buffer.from(res.data, "binary");
                const base64Image = buffer.toString("base64");
                base64 = `data:image/jpeg;base64,${base64Image}`;
            } catch (err) {
                console.error(err);
            }
            const response = new accounts({
                ...data,
                picture: base64,
            });
            const saveduser = await response.save();

            return res.status(200).json({ success: true, token: saveduser._id });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            sucess: false,
            message: "Bad Request",
        });
    }
})

router.post("/getAccount", async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "User ID (_id) is required",
            });
        }

        await connectToDatabase();
        const user = await accounts.findById(_id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

router.post('/upload-audio', async (req, res) => {
    try {
        const { userId, name, audioBase64, transcription, title } = req.body;

        // Validation
        if (!userId || !name || !audioBase64 || !title) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        await connectToDatabase();
        // Create a new Audio document
        const newAudio = new messages({
            userId,
            name,
            audioBase64,
            transcription: transcription || '', // Default empty if not provided
            title,
        });

        // Save to database
        await newAudio.save();

        res.status(201).json({ message: 'Audio uploaded successfully', audioId: newAudio._id });
    } catch (error) {
        console.error('Error saving audio:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/audio/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        await connectToDatabase();
        const audioFiles = await messages.find({ userId }, { audioBase64: 0 }).sort({ uploadedAt: -1 }).limit(20);

        if (!audioFiles.length) {
            return res.status(404).json({ error: 'No audio files found for this user' });
        }

        res.json(audioFiles);
    } catch (error) {
        console.error('Error fetching audio:', error);
        res.status(500).json({ error: 'Internal server error', message: error });
    }
});



module.exports = router;
