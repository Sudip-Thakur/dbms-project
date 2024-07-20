import { z } from "zod";

const registerSchema = z.object({
  body: z.object({
    fullname: z.string().nonempty({
      message: "Full Name is required"
    }),

    username: z.string().nonempty({
      message: "Username is required"
    }),

    email: z.string()
      .nonempty({ message: "Email is required" })
      .email("Not a valid email"),

    password: z.string().nonempty({
      message: "Password is required"
    }),
    
    bio: z.string().max(150, "Bio must be at most 150 characters").optional(),
  })
});

const loginSchema = z.object({
  body: z.object({
    username: z.string().nonempty({
      message: "username is required to login"
    }),
    password: z.string().nonempty({
      message: "password is required to login"
    })
  })
});

const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().nonempty({
      message: "Must enter your old password."
    }),
    newPassword: z.string().nonempty({
      message: "Must enter your new password."
    })
  })
});

const updateFullnameSchema = z.object({
  body: z.object({
    fullname: z.string().nonempty({
      message: "Provide new Full Name"
    })
  })
})

const bioSchema = z.object({
  body: z.object({
    bio: z.string().nonempty({
      message: "Provide new Bio"
    })
  })
})

const channelIdSchema = z.object({
  params: z.object({
    channelId: z.string().uuid({
      message: "Invalid UUID"
    })
  })
});

export { registerSchema,
  loginSchema,
  changePasswordSchema,
  updateFullnameSchema,
  bioSchema,
  channelIdSchema
};
