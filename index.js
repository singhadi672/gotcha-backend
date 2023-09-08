const express = require("express");
const app = express();
const env = require("dotenv");
env.config();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, { cors: { origin: "*" } });
const PORT = 4000;
const cors = require("cors");
const DBConnection = require("./DB/connection.db");
const quizDetailRoute = require("./Routes/quizDetail.route");
const quizRoute = require("./Routes/quiz.route");

app.use(cors());
DBConnection();

app.get("/", (req, res) => {
  res.send({ status: "running" });
});

app.use("/quizDetails", quizDetailRoute);
app.use("/quiz", quizRoute);

httpServer.listen(process.env.PORT || PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

const users = [];
let allUsersScore = [];
let room = null;
let roomSize = null;
let currentQuestion = 0;

io.on("connection", (socket) => {
  socket.on("create_room", (data) => {
    if (users.length === 0) {
      socket.emit("resource_created", { status: true });
      socket.join(data.roomId);
      room = data.roomId;
      users.push(data);
      roomSize = data.roomSize;
      io.in(room).emit("get_users", users);
    } else {
      socket.emit("resource_created", { status: false, roomId: room });
    }
  });

  socket.on("join_room", (data) => {
    if (users.length < roomSize) {
      socket.emit("room_size_max", { status: true });
      socket.join(data.roomId);
      users.push(data);
      io.in(room).emit("get_users", users);
    } else {
      socket.emit("room_size_max", { status: false });
    }
  });

  socket.on("start_multiplayer", () => {
    io.in(room).emit("set_multiplayer_playarea", { status: true });
    allUsersScore = users.map((user) => {
      return user;
    });
  });

  function triggerClearInterval(id) {
    clearInterval(id);
    io.in(room).emit("get final score");
  }

  socket.on("change_question", () => {
    const intervalID = setInterval(() => {
      if (currentQuestion === 9) {
        triggerClearInterval(intervalID);
      } else {
        currentQuestion++;
        io.in(room).emit("change_current_question", {
          questionNum: currentQuestion,
        });
      }
    }, 7000);
  });

  socket.on("final result from client", (data) => {
    allUsersScore.forEach((user) => {
      if (user.userId === data.userId) {
        user.totalScore = data.totalScore;
      }
    });
    io.in(room).emit("change view to leaderBoard", allUsersScore);
  });

  socket.on("delete_room", () => {
    io.socketsLeave(room);
    while (users.length > 0) {
      users.pop();
      allUsersScore.pop();
    }
    room = null;
    currentQuestion = 0;
  });
});
