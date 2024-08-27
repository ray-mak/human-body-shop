export {}

export type Roles = "admin" | "user"

declare global {
  interface CustomJwtSession {
    metadata: {
      role?: Roles
    }
  }
}
