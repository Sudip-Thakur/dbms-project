import { z } from 'zod'

const createPlaylistSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional()
  })
})

const updatePlaylistSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional()
  })
})

const playlistIdSchema = z.object({
  params: z.object({
    playlistId: z.string().uuid({
      message: "Must be an UUID"
    })
  })
})

const  addVideoScheme = z.object({
  params : z.object({
    playlistId: z.string().uuid({
      message: "playlist Must be an UUID"
    }),
    videoId: z.string().uuid({
      message: "video Must be an UUID"
    })
  })
}) 



export {
  createPlaylistSchema,
  updatePlaylistSchema,
  playlistIdSchema,
  addVideoScheme
}