import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import validateSchema from "../middlewares/schemaValidator.middleware.js";

import {
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getPlaylist,
  getPlaylistVideos
} from "../controllers/playlist.controller.js";

import {
  createPlaylistSchema,
  updatePlaylistSchema,
  playlistIdSchema,
  addVideoScheme,
} from "../schemas/playlist.schema.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/create")
  .post(validateSchema(createPlaylistSchema), createPlaylist);
router
  .route("/update/:playlistId")
  .patch(
    validateSchema(updatePlaylistSchema),
    validateSchema(playlistIdSchema),
    updatePlaylist
  );

router
  .route("/my-playlists")
  .get(getPlaylist);

router
  .route("/delete/:playlistId")
  .delete(validateSchema(playlistIdSchema), deletePlaylist);

  router
  .route("/add/:videoId/:playlistId")
  .post(validateSchema(addVideoScheme), addVideoToPlaylist);

router
  .route("/delete/video/:videoId/:playlistId")
  .delete(validateSchema(addVideoScheme), removeVideoFromPlaylist);

router.route("/playlist-videos/:playlistId").get(validateSchema(playlistIdSchema), getPlaylistVideos)

export default router;
