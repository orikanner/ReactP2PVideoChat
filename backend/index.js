const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const JWTSECRET = require("./JWTSecret");

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

mongoose
  .connect("mongodb://localhost:27017/vetApp")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB Connect Error", err));

let veterinarians = {};

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("registerVet", (data) => {
    const token = data.token;
    if (!token) return;

    jwt.verify(token, JWTSECRET, (err, decoded) => {
      if (err) return;
      if (!decoded.isVet) return;

      veterinarians[socket.id] = { available: true, user: decoded };
      socket.emit(
        "registrationSuccess",
        `Veterinarian ${decoded.username} registered and available.`
      );
    });
  });

  socket.on("unmount", () => {
    delete veterinarians[socket.id];
    socket.broadcast.emit("callEnded");
  });

  socket.on("callVet", ({ signalData, name, mongoDbId }) => {
    let callHandled = false;
    for (let id in veterinarians) {
      if (veterinarians[id].available) {
        io.to(id).emit("callFromClient", {
          signalData,
          fromSocketId: socket.id,
          mongoDbId,
        });
        callHandled = true;
        break;
      }
    }
    if (!callHandled) {
      socket.emit("noVetsAvailable", "No veterinarians are currently available.");
    }
  });

  socket.on("answerCall", (data) => {
    if (veterinarians[socket.id]) {
      veterinarians[socket.id].available = false;
      io.to(data.to).emit("callAccepted", data.signal);
    }
  });

  socket.on("endCall", ({ id }) => {
    if (veterinarians[id]) {
      veterinarians[id].available = true;
    }
  });

  socket.on("disconnect", () => {
    delete veterinarians[socket.id];
  });
});

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const prescriptionRoutes = require("./routes/prescriptionRoutes");
app.use("/api/prescriptions", prescriptionRoutes);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
