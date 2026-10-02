require("dotenv").config();
const express = require("express"), cors = require("cors"), path = require("path"), rateLimit = require("express-rate-limit");
const app = express();
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
// Limits each visitor to 20 questions per minute, protecting your AI API credit
app.use("/api/chat", rateLimit({ windowMs: 60000, max: 20, message: { error: "Too many questions. Please wait a minute and try again." } }));
app.use("/api/chat", require("./routes/chat"));
// Serves the frontend too, so one URL works for the whole app (useful for deployment)
app.use(express.static(path.join(__dirname, "../frontend")));
app.listen(process.env.PORT || 3000, () => console.log("ManakSetu running on port " + (process.env.PORT || 3000)));
