import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

function ProtectedRoutes({ roles }) {
  const isAuthenticated = useSelector((state) => state.authSlice.user);
  // console.log(isAuthenticated?.token);
  if (isAuthenticated && isAuthenticated.token) {
    try {
      const decodedToken = jwtDecode(isAuthenticated.token);

      // Obtenir la date d'expiration du token (en millisecondes)

      const expirationTime = decodedToken.iat * 1000 + 24 * 60 * 60 * 1000; // Ajoute 1 minute

      // Comparer avec la date actuelle
      if (expirationTime < Date.now()) {
        console.log("Le token a expiré");
        toast.error(
          "La session est actuellement expirée. Veuillez vous reconnecter."
        );
        // Ajoutez ici votre logique pour gérer le token expiré
        // Par exemple, déconnectez l'utilisateur ou renvoyez-le vers la page de connexion
        return <Navigate to="/" />;
      }

      // Vérifier si l'utilisateur a le rôle nécessaire
      if (isAuthenticated?.user.role.includes(roles) == false) {
        console.log("Vous n'avez pas les autorisations requises");
        toast.error("Vous n'avez pas les autorisations requises.");
        return <Navigate to="/" />;
      }
    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
    }
  }
  return <Outlet />;
}

export default ProtectedRoutes;

// function ProtectedRoutes ({ roles })  {
//   const isAuthenticated = useSelector((state) => state.authReducer.authData);

//   console.log(isAuthenticated);
//   return isAuthenticated.roles.includes(roles) ? (
//     <Outlet />
//   ) : (
//     <Navigate to="/login" />
//   );
// }

// export default ProtectedRoutes;
