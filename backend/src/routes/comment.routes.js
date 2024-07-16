import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { 
  getVideoComments,
  addComment,
  editComment,
  deleteComment
} from "../controllers/comment.controller.js";

import { 
  videoIdSchema,
  commentIdSchema,
  contentSchema,
} from "../schemas/comment.schema.js";
import validateSchema from "../middlewares/schemaValidator.middleware.js";

const router = Router()
router.use(verifyJWT)

router
  .route("/:videoId")
  .get(validateSchema(videoIdSchema),getVideoComments)
  .post(validateSchema(videoIdSchema), validateSchema(contentSchema), addComment)
router
  .route("/edit")
  .patch(validateSchema(commentIdSchema), editComment)
router
.route("/delete")
.delete(validateSchema(commentIdSchema), deleteComment)

export default router;
