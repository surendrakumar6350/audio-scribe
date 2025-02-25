const express = require("express");
const { connectToDatabase } = require("../models/db/connect");

const router = express.Router();


router.get("/ping", async (req, res) => {
    try {
        return res.status(200).json({ success: true, message: "pong!!" });
    } catch (error) {
        console.error("Error", error);
        res.status(500).json({ success: false, message: "An error occurred", error });
    }
});


module.exports = router;
