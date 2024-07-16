import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import validateSchema from "../middlewares/schemaValidator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  updateFullnameSchema,
  bioSchema,
} from "../schemas/user.schema.js";

import {
  loginUser,
  registerUser,
  logoutUser,
  changePassword,
  currentUser,
  updateFullName,
  updateAvatar,
  updateCoverImage,
  updateBio,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(validateSchema(registerSchema), registerUser);

router.route("/login").post(validateSchema(loginSchema), loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router
  .route("/change-password")
  .post(verifyJWT, validateSchema(changePasswordSchema), changePassword);

  router.route("/current-user").get(verifyJWT, currentUser);

router
  .route("/update-fullname")
  .patch(verifyJWT, validateSchema(updateFullnameSchema), updateFullName);

  router
  .route("/update-bio")
  .patch(verifyJWT, validateSchema(bioSchema), updateBio);

router.route("/update-avatar").patch(
  verifyJWT,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  updateAvatar
);

router.route("/update-coverImage").patch(
  verifyJWT,
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  updateCoverImage
);

export default router;
