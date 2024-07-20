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


router
  .route("/channel/:channelId")
  .post(verifyJWT,validateSchema(channelIdSchema),toggleSubscription)

router.route("/channels").get(verifyJWT,getSubscribedChannel)
export default router;
