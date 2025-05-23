import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
  // origin: process.env.CORS_ORIGIN,
  origin: 'https://video-hub-beta-ecru.vercel.app',
  credentials: true
}));
// app.use(cors({
//   // origin: process.env.CORS_ORIGIN,
//   origin: 'http://localhost:5173',
//   credentials: true
// }));

app.use(express.json({ limit : '16kb'}));

app.use(express.urlencoded({extended: true, limit: '16kb'}))

app.use(express.static('public'))

app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import commentRouter from './routes/comment.routes.js'
import likeRouter from './routes/like.routes.js'
import playlistRouter from './routes/playlist.routes.js'
import watchHistoryRouter from './routes/watchHistory.routes.js'


//router decleration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/watchHistory", watchHistoryRouter);


export {app}