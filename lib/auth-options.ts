import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"


 interface LoginResponse {
  success: boolean
  message: string
  data: {
    accessToken: string
    user: {
      _id: string
      name: string
      email: string
      phone: string
      isVerified: boolean
      imageLink: string | null
      role: string
      isShopCreated: boolean
      isPaid: boolean
      employeeCount: number
      createdAt: string
      updatedAt: string
      shop: string
    }
  }
}


  interface JWT {
    id: string
    role: string
    accessToken: string
    fullResponse: LoginResponse
  }

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        })

        if (!res.ok) return null

        const data: LoginResponse = await res.json()

        if (!data.success || !data.data?.accessToken) return null

        return {
          id: data.data.user._id,
          name: data.data.user.name,
          email: data.data.user.email,
          role: data.data.user.role,
          accessToken: data.data.accessToken,
          fullResponse: data,   
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as JWT).role
        token.accessToken = (user as JWT).accessToken
        token.fullResponse = (user as JWT).fullResponse
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      session.accessToken = token.accessToken
      session.fullResponse = token.fullResponse
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
