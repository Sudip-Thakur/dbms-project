import { z } from 'zod';

const uploadSchema = z.object({
  body: z.object({
    title: z.string().nonempty({
      message : "Must provide a title. "
    }),
    description : z.string().optional(),
    isPublished : z.string().nonempty({
      message: "Decide if the video is private or public"
    })
  })
});

const videoIdSchema = z.object({
  params: z.object({
    videoId: z.string().uuid({
      message: "Invalid UUID"
    })
  })
});

export {
  uploadSchema,
  videoIdSchema
}