function PublicRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>;
    }

    return !isAuthenticated ? children : <Navigate to="/menu-principal" replace />;
}
