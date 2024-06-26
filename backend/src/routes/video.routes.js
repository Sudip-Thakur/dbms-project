import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import validateSchema from "../middlewares/schemaValidator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { 
  uploadSchema,
  videoIdSchema,
} from "../schemas/video.schema.js"

import { 
  uploadVideo,
  getVideo,
  deleteVideo
} from "../controllers/video.controller.js";

const router = Router();

router.route("/upload-video").post(verifyJWT,upload.fields(
  [{
    name: 'video',
    maxCount: 1
  },
  {
    name: 'thumbnail',
    maxCount: 1
  }
  ]
), validateSchema(uploadSchema), uploadVideo)

router
  .route("/:videoId")
  .get(validateSchema(videoIdSchema), getVideo)
  .delete(verifyJWT, validateSchema(videoIdSchema), deleteVideo)


export default router;
