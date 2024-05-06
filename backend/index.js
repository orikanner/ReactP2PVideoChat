const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(require("express").json());
const PORT = process.env.PORT || 8080;

const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/vetApp")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB Connect Error", err));

const jwt = require("jsonwebtoken");
let veterinarians = {};


io.on("connection", (socket) => {
  socket.emit("me", socket.id);
  socket.on("registerVet", (data) => {

    console.log("start registrationVet process",socket.id)
    const token = data.token; // Token sent as query parameter during socket connection
    if (!token) {
      console.log("!token");
      return;
    }
    jwt.verify(token, "123", (err, decoded) => {
      if (err) {
        console.log("err");
        return;
      }
      if (!decoded.isVet) {
        console.log("!decoded.isVet");
        return;
      }
      veterinarians[socket.id] = { available: true, user: decoded };
      socket.emit(
        "registrationSuccess",
        `Veterinarian ${decoded.username} registered and available.`
      );
    });
  });

  socket.on("unmount", () => {
    delete veterinarians[socket.id]; // Remove vet on disconnect
    socket.broadcast.emit("callEnded");
  });

  socket.on("callVet", ({signalData,name,mongoDbId}) => {
    console.log("callVet");
    let callHandled = false;
    for (let id in veterinarians) {
      if (veterinarians[id].available) {
        io.to(id).emit("callFromClient", { signalData,fromSocketId: socket.id,mongoDbId });
      }
    }
  });

  //Vet asnwer call from the User
  socket.on("answerCall", (data) => {
   
    veterinarians[socket.id].available = false; // Vet is now in a call
    io.to(data.to).emit("callAccepted", data.signal);//HANLDE THISS
  });

  socket.on("endCall", ({ id }) => {
    if (veterinarians[id]) {
      veterinarians[id].available = true; // Mark vet as available again
    }
  });

  socket.on("disconnect", () => {
    if (veterinarians[socket.id]) {
      console.log("disconnect");
    }
    delete veterinarians[socket.id];
  });
});

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);
const prescriptionRoutes = require("./routes/prescriptionRoutes");
app.use("/api/prescriptions", prescriptionRoutes);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
