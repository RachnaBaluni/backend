const express = require("express");
const connectDB = require("./Database/connectDB");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  "https://api.utennisa.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // allow
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Use the SAME config for all requests
app.use(cors(corsOptions));

const PlayerRouter = require("./Route/Player.route.js");
const MemberRouter = require("./Route/Member.route.js");
const EventRouter = require("./Route/Event.route.js");
const MainEventRouter = require("./Route/MainEvent.route.js");
const AdminRouter = require("./Route/Admin.route.js");
const TeamRouter = require("./Route/Team.route.js");
const NissanDrawsRouter = require("./Route/Nissan_Draws.route.js");
const TournamentDetailRouter = require("./Route/TournamentDetail.route.js");
const PricesBenifitRouter = require("./Route/PricesBenifit.route.js");
const VenueRouter = require("./Route/Venue.route.js");

//Player APIs
app.use("/api/player/", PlayerRouter);

//Event APIs
app.use("/api/events/", EventRouter);
app.use("/api/main-events/", MainEventRouter);

//Event APIs
app.use("/api/tournament-details/", TournamentDetailRouter);
app.use("/api/prices-benifit/", PricesBenifitRouter);
app.use("/api/venue/", VenueRouter);

// Admin APIs
app.use("/api/admin/", AdminRouter);

app.use("/api/member/", MemberRouter);
app.use("/api/team/", TeamRouter);
app.use("/api/nissan-draws/", NissanDrawsRouter);

// Starting the Server
// Starting the Server
const PORT = process.env.PORT || process.env.PORT_NUMBER || 3002;

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
    console.log("Loaded allowedOrigins:", allowedOrigins);
  });
});

// Global error handler for debugging
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack || err);
  res
    .status(500)
    .json({ error: "Internal Server Error", details: err.message });
});
