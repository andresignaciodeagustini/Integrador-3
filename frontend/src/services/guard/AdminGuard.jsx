import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export default function AdminGuard({ children }) {
    const { user } = useUser();

    console.log("User role:", user?.role);

    if (!user || user.role !== "ADMIN_ROLE") {
        console.log("Redirecting to login");
        return <Navigate to="/" replace />;
    }

    console.log("Rendering children");

    return children;
}
