import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@localpup.com"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
          return {
            id: "1",
            email: ADMIN_EMAIL,
            name: "Admin",
            role: "admin"
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60 // 24 hours
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  callbacks: {
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: { session: any, token: any }) {
      if (session.user) {
        session.user.role = token.role
      }
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }