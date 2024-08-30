import { z } from "zod";

export const SignUpValidation = z.object({
    username: z.string().min(2 , {message : 'Too Short'}),
    email: z.string().email(),
    password: z.string().min(8 , {message : 'Password must be atleast 8 characters'}),
  });   

export const SignInValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8 , {message : 'Password must be atleast 8 characters'}),
  });   

export const PostValidation = z.object({
    caption : z.string().min(5).max(2200),
    file : z.custom<File[]>(),
    location : z.string().min(2).max(100),
    tags : z.string()
  });  

export const UserValidation = z.object({
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    bio: z.string().max(2200, { message: "Bio must be at most 160 characters." }),
    file: z.any(),
  });

