import { z } from "zod";

const channelIdSchema = z.object({
  params: z.object({
    channelId: z.string().uuid({
      message: "Invalid UUID"
    })
  })
});

export {
  channelIdSchema
}