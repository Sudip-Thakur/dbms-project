import {z} from 'zod'

const videoIdSchema = z.object({
  params: z.object({
    videoId: z.string().uuid({
      message: "Invalid UUID"
    })
  })
});

const commentIdSchema = z.object({
  params: z.object({
    commentId: z.string().uuid({
      message: "Invalid UUID"
    })
  })
});

const contentSchema = z.object({
  body:z.object({
    content: z.string().nonempty({
      message: "Content is required"
    })
  })
})
export {
  videoIdSchema,
  commentIdSchema,
  contentSchema
}
