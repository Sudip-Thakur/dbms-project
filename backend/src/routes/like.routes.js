import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import validateSchema from "../middlewares/schemaValidator.middleware.js";

import { videoIdSchema } from "../schemas/like.schema.js";

import { 
  toggleVideoLike,
  getLikedVideo
} from '../controllers/like.controller.js'

const router = Router()
router.use(verifyJWT)

router.route("/:videoId").post(validateSchema(videoIdSchema), toggleVideoLike)
router.route("/likedVideo").get(getLikedVideo)

export default router;
