/**
 * ProfileApp - Wrapper con providers para la página de perfil
 */

import { AuthProvider } from "../context/AuthContext";
import { UserProfile } from "./UserProfile";

export function ProfileApp() {
  return (
    <AuthProvider>
      <UserProfile />
    </AuthProvider>
  );
}

export default ProfileApp;
