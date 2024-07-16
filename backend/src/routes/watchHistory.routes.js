import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import validateSchema from "../middlewares/schemaValidator.middleware.js";

import {
  videoIdSchema
} from '../schemas/watchHistory.schema.js'

import {
  addToWatched,
  getWatchedVideo,
  deleteOneWatchHistory,
  clearWatchHistory
} from '../controllers/watchHistory.controller.js'
const router = Router()
router.use(verifyJWT)

router.route("/add/:videoId").post(validateSchema(videoIdSchema), addToWatched)
router.route("/").get(getWatchedVideo)
router.route("/delete/:videoId").delete(validateSchema(videoIdSchema),deleteOneWatchHistory)
router.route("/clear/history").delete(clearWatchHistory)

export default router;
