import withAuth from "next-auth/middleware"
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default withAuth(
  function middleware (req) {
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (
          req.nextUrl.pathname.startsWith('/dashboard') &&
          token === null
        ) {
          return false
        }
        return true
      }
    }
  }
)

export const config = { matcher: ["/dashboard/", "/dashboard/:path*"] };