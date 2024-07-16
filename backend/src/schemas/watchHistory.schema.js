import { z } from 'zod';

const videoIdSchema = z.object({
  params: z.object({
    videoId: z.string().uuid({
      message: "Invalid UUID"
    })
  })
});

export {
  videoIdSchema
}