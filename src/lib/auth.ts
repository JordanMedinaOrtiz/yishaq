/**
 * Librería de Autenticación para YISHAQ
 * Maneja JWT, sesiones, hashing y verificación de roles
 */

import { SignJWT, jwtVerify } from "jose";
import { hash, compare } from "bcryptjs";
import { db, users, sessions } from "../db";
import { eq, and, gt } from "drizzle-orm";
import type { User } from "../db/schema";

// ============================================
// CONFIGURACIÓN (Variables de Entorno)
// ============================================

/**
 * IMPORTANTE: Las variables con prefijo PUBLIC_ se exponen al cliente.
 * JWT_SECRET NO tiene ese prefijo, por lo que solo está disponible en el servidor.
 * Esto es seguro porque auth.ts solo se ejecuta en el backend (API routes).
 */

// Clave secreta para JWT - Solo disponible en el servidor
const getJwtSecret = () => {
  const secret = import.meta.env.JWT_SECRET;
  if (!secret) {
    console.warn(
      "⚠️  JWT_SECRET no definido, usando valor por defecto (NO USAR EN PRODUCCIÓN)"
    );
    return "yishaq-secret-key-change-in-production-2024";
  }
  return secret;
};

const JWT_SECRET = new TextEncoder().encode(getJwtSecret());

// Duración de sesión desde variable de entorno
const SESSION_DURATION_DAYS = parseInt(
  import.meta.env.SESSION_DURATION_DAYS || "7"
);
const BCRYPT_ROUNDS = 12;

// Detectar si estamos en producción
const isProduction =
  import.meta.env.PROD || import.meta.env.NODE_ENV === "production";

// ============================================
// TIPOS
// ============================================

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "client";
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  token?: string;
  error?: string;
}

export interface TokenPayload {
  userId: string;
  sessionId: string;
  role: "admin" | "client";
}

// ============================================
// FUNCIONES DE HASHING
// ============================================

export async function hashPassword(password: string): Promise<string> {
  return hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

// ============================================
// FUNCIONES DE JWT
// ============================================

export async function createToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_DAYS}d`)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

// ============================================
// FUNCIONES DE SESIÓN
// ============================================

export async function createSession(
  userId: string,
  role: "admin" | "client"
): Promise<string> {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  // Guardar sesión en BD
  db.insert(sessions)
    .values({
      id: sessionId,
      userId,
      expiresAt,
      createdAt: new Date(),
    })
    .run();

  // Crear token JWT
  const token = await createToken({ userId, sessionId, role });
  return token;
}

export async function invalidateSession(sessionId: string): Promise<void> {
  db.delete(sessions).where(eq(sessions.id, sessionId)).run();
}

export async function invalidateAllUserSessions(userId: string): Promise<void> {
  db.delete(sessions).where(eq(sessions.userId, userId)).run();
}

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

export async function register(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<AuthResult> {
  try {
    // Verificar si el email ya existe
    const existingUser = db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .get();

    if (existingUser) {
      return { success: false, error: "El email ya está registrado" };
    }

    // Validar contraseña
    if (password.length < 8) {
      return {
        success: false,
        error: "La contraseña debe tener al menos 8 caracteres",
      };
    }

    // Crear usuario
    const userId = crypto.randomUUID();
    const passwordHash = await hashPassword(password);

    db.insert(users)
      .values({
        id: userId,
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        role: "client",
        isActive: true,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .run();

    // Crear sesión
    const token = await createSession(userId, "client");

    return {
      success: true,
      user: {
        id: userId,
        email: email.toLowerCase(),
        firstName,
        lastName,
        role: "client",
      },
      token,
    };
  } catch (error) {
    console.error("Error en registro:", error);
    return { success: false, error: "Error al crear la cuenta" };
  }
}

export async function login(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    // Buscar usuario
    const user = db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .get();

    if (!user) {
      return { success: false, error: "Credenciales incorrectas" };
    }

    if (!user.isActive) {
      return { success: false, error: "Cuenta desactivada" };
    }

    // Verificar contraseña
    const validPassword = await verifyPassword(password, user.passwordHash);

    if (!validPassword) {
      return { success: false, error: "Credenciales incorrectas" };
    }

    // Crear sesión
    const token = await createSession(user.id, user.role as "admin" | "client");

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role as "admin" | "client",
      },
      token,
    };
  } catch (error) {
    console.error("Error en login:", error);
    return { success: false, error: "Error al iniciar sesión" };
  }
}

export async function logout(token: string): Promise<boolean> {
  try {
    const payload = await verifyToken(token);
    if (payload?.sessionId) {
      await invalidateSession(payload.sessionId);
    }
    return true;
  } catch {
    return false;
  }
}

// ============================================
// FUNCIONES DE VERIFICACIÓN
// ============================================

export async function validateSession(token: string): Promise<AuthUser | null> {
  try {
    const payload = await verifyToken(token);

    if (!payload) {
      return null;
    }

    // Verificar que la sesión exista y no haya expirado
    const session = db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.id, payload.sessionId),
          gt(sessions.expiresAt, new Date())
        )
      )
      .get();

    if (!session) {
      return null;
    }

    // Obtener usuario
    const user = db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .get();

    if (!user || !user.isActive) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as "admin" | "client",
      phone: user.phone,
      address: user.address,
      city: user.city,
      postalCode: user.postalCode,
      country: user.country,
    };
  } catch {
    return null;
  }
}

export async function isAdmin(token: string): Promise<boolean> {
  const user = await validateSession(token);
  return user?.role === "admin";
}

export async function requireAuth(
  token: string | undefined
): Promise<AuthUser> {
  if (!token) {
    throw new Error("No autenticado");
  }

  const user = await validateSession(token);

  if (!user) {
    throw new Error("Sesión inválida o expirada");
  }

  return user;
}

export async function requireAdmin(
  token: string | undefined
): Promise<AuthUser> {
  const user = await requireAuth(token);

  if (user.role !== "admin") {
    throw new Error("Acceso denegado: se requiere rol de administrador");
  }

  return user;
}

// ============================================
// HELPERS PARA COOKIES
// ============================================

export function getTokenFromCookie(
  cookieHeader: string | null
): string | undefined {
  if (!cookieHeader) return undefined;

  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return cookies["auth_token"];
}

export function createAuthCookie(token: string): string {
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_DURATION_DAYS);

  // En producción, agregar Secure para HTTPS
  const secureFlag = isProduction ? "; Secure" : "";

  return `auth_token=${token}; Path=/; HttpOnly; SameSite=Strict${secureFlag}; Expires=${expires.toUTCString()}`;
}

export function createLogoutCookie(): string {
  const secureFlag = isProduction ? "; Secure" : "";
  return `auth_token=; Path=/; HttpOnly; SameSite=Strict${secureFlag}; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
