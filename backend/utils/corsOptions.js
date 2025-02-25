const corsOptions = {
    origin: ["http://localhost:3000", "https://audio-scribe-sigma.vercel.app", "http://audio-scribe-sigma.vercel.app"],
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
    optionsSuccessStatus: 200,
};

module.exports = { corsOptions }