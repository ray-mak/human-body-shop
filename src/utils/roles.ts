import { Roles } from "../types/globals"
import { auth } from "@clerk/nextjs/server"

interface SessionClaims {
  metadata: {
    role: string
  }
}

export const checkRole = (role: Roles) => {
  const { sessionClaims } = auth()

  const isSessionClaims = (claims: any): claims is SessionClaims => {
    return (
      claims &&
      typeof claims.metadata === "object" &&
      typeof claims.metadata.role === "string"
    )
  }

  if (
    isSessionClaims(sessionClaims) &&
    sessionClaims.metadata.role === "admin"
  ) {
    return sessionClaims?.metadata.role === role
  }
}
