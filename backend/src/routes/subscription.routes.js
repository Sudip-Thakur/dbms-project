import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { 
  getSubscribedChannel,
  toggleSubscription 
} from "../controllers/subscription.controller.js";

import validateSchema from "../middlewares/schemaValidator.middleware.js";

import { 
  channelIdSchema
} from "../schemas/subscription.schema.js";

const router = Router()

router.use(verifyJWT)

router
  .route("/channel/:channelId")
  .post(validateSchema(channelIdSchema),toggleSubscription)

router.route("/channels").get(getSubscribedChannel)
export default router;
