import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import validateSchema from "../middlewares/schemaValidator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { setUser } from "../middlewares/setUser.middleware.js";

import { videoIdSchema, uploadSchema, channelIdSchema } from "../schemas/video.schema.js";

import {
  uploadVideo,
  getVideo,
  deleteVideo,
  updateVideo,
  togglePublishStatus,
  getRandomVideo,
  getRecommendation,
  getSubscribedRecommendation,
  searchVideo,
  getChannelVideos
} from "../controllers/video.controller.js";

const router = Router();

router.route("/upload-video").post(
  verifyJWT,
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  validateSchema(uploadSchema),
  uploadVideo
);

router
  .route("/:videoId")
  .get(setUser,validateSchema(videoIdSchema), getVideo)
  .delete(verifyJWT, validateSchema(videoIdSchema), deleteVideo)
  .patch(
    verifyJWT,
    validateSchema(videoIdSchema),
    upload.fields([
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    updateVideo
  );

router.route("/channel/:channelId").get(validateSchema(channelIdSchema),getChannelVideos)
router
  .route("/toggle/publish/:videoId")
  .patch(verifyJWT, validateSchema(videoIdSchema), togglePublishStatus);

router.route("/random/video").get(getRandomVideo);

router.route("/recommend/recent").get(verifyJWT,getRecommendation);

router.route("/recommend/subscribed").get(verifyJWT,getSubscribedRecommendation);

router.route("/search/:searchKeyword").get(searchVideo);


export default router;
