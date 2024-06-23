import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import validateSchema from "../middlewares/schemaValidator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { uploadVideo } from "../controllers/video.controller.js";

const router = Router();

router.route("/upload-video").get(verifyJWT, uploadVideo)

export default router;
