// import NextAuth, { DefaultSession } from "next-auth"
// import { JWT } from "next-auth/jwt"
import { LoginResponse } from "./api"

declare module "next-auth" {
  interface Session {
    accessToken: string
    user: DefaultSession["user"] & {
      id: string
      role: string
    }
    fullResponse: LoginResponse
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    accessToken: string
    fullResponse: LoginResponse
  }
}
