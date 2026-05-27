import { jwtVerify, SignJWT } from 'jose';
import { compare, hash } from 'bcryptjs';
import { d as db, e as sessions, u as users } from './index_ThQEX7AB.mjs';
import { and, eq, gt } from 'drizzle-orm';

const getJwtSecret = () => {
  {
    console.warn(
      "⚠️  JWT_SECRET no definido, usando valor por defecto (NO USAR EN PRODUCCIÓN)"
    );
    return "yishaq-secret-key-change-in-production-2024";
  }
};
const JWT_SECRET = new TextEncoder().encode(getJwtSecret());
const SESSION_DURATION_DAYS = parseInt(
  "7"
);
const BCRYPT_ROUNDS = 12;
async function hashPassword(password) {
  return hash(password, BCRYPT_ROUNDS);
}
async function verifyPassword(password, hashedPassword) {
  return compare(password, hashedPassword);
}
async function createToken(payload) {
  return new SignJWT({ ...payload }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(`${SESSION_DURATION_DAYS}d`).sign(JWT_SECRET);
}
async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}
async function createSession(userId, role) {
  const sessionId = crypto.randomUUID();
  const expiresAt = /* @__PURE__ */ new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);
  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
    createdAt: /* @__PURE__ */ new Date()
  });
  const token = await createToken({ userId, sessionId, role });
  return token;
}
async function invalidateSession(sessionId) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}
async function register(email, password, firstName, lastName) {
  try {
    const [existingUser] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    if (existingUser) {
      return { success: false, error: "El email ya está registrado" };
    }
    if (password.length < 8) {
      return {
        success: false,
        error: "La contraseña debe tener al menos 8 caracteres"
      };
    }
    const userId = crypto.randomUUID();
    const passwordHash = await hashPassword(password);
    await db.insert(users).values({
      id: userId,
      email: email.toLowerCase(),
      passwordHash,
      firstName,
      lastName,
      role: "client",
      isActive: true,
      emailVerified: false,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    const token = await createSession(userId, "client");
    return {
      success: true,
      user: {
        id: userId,
        email: email.toLowerCase(),
        firstName,
        lastName,
        role: "client"
      },
      token
    };
  } catch (error) {
    console.error("Error en registro:", error);
    return { success: false, error: "Error al crear la cuenta" };
  }
}
async function login(email, password) {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    if (!user) {
      return { success: false, error: "Credenciales incorrectas" };
    }
    if (!user.isActive) {
      return { success: false, error: "Cuenta desactivada" };
    }
    const validPassword = await verifyPassword(password, user.passwordHash);
    if (!validPassword) {
      return { success: false, error: "Credenciales incorrectas" };
    }
    const token = await createSession(user.id, user.role);
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token
    };
  } catch (error) {
    console.error("Error en login:", error);
    return { success: false, error: "Error al iniciar sesión" };
  }
}
async function logout(token) {
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
async function validateSession(token) {
  try {
    const payload = await verifyToken(token);
    if (!payload) {
      return null;
    }
    const [session] = await db.select().from(sessions).where(
      and(
        eq(sessions.id, payload.sessionId),
        gt(sessions.expiresAt, /* @__PURE__ */ new Date())
      )
    );
    if (!session) {
      return null;
    }
    const [user] = await db.select().from(users).where(eq(users.id, payload.userId));
    if (!user || !user.isActive) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone,
      address: user.address,
      city: user.city,
      postalCode: user.postalCode,
      country: user.country
    };
  } catch {
    return null;
  }
}
async function requireAuth(token) {
  if (!token) {
    throw new Error("No autenticado");
  }
  const user = await validateSession(token);
  if (!user) {
    throw new Error("Sesión inválida o expirada");
  }
  return user;
}
async function requireAdmin(token) {
  const user = await requireAuth(token);
  if (user.role !== "admin") {
    throw new Error("Acceso denegado: se requiere rol de administrador");
  }
  return user;
}
function getTokenFromCookie(cookieHeader) {
  if (!cookieHeader) return void 0;
  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {});
  return cookies["auth_token"];
}
function createAuthCookie(token) {
  const expires = /* @__PURE__ */ new Date();
  expires.setDate(expires.getDate() + SESSION_DURATION_DAYS);
  const secureFlag = "; Secure" ;
  return `auth_token=${token}; Path=/; HttpOnly; SameSite=Strict${secureFlag}; Expires=${expires.toUTCString()}`;
}
function createLogoutCookie() {
  const secureFlag = "; Secure" ;
  return `auth_token=; Path=/; HttpOnly; SameSite=Strict${secureFlag}; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export { logout as a, createLogoutCookie as b, createAuthCookie as c, requireAdmin as d, requireAuth as e, getTokenFromCookie as g, login as l, register as r, validateSession as v };
