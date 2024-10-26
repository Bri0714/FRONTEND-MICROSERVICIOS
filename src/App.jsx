// App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { InstitucionFormPage } from "./pages/InstitucionFormPage";
import { InstitucionesPage } from "./pages/InstitucionesPage";
import { Toaster } from "react-hot-toast";
import { AdministracionColegios } from "./pages/AdministracionInstitucion";
import { MenuPrincipal } from "./pages/MenuPrincipal";

// Componente que envuelve las rutas que necesitan el Navigation
function WithNavigation({ children }) {
  return (
    <>
      <Navigation />
      {/* Eliminamos 'container mx-auto' para evitar limitar el ancho */}
      <div>{children}</div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* Eliminamos 'container mx-auto' aquí también */}
      <Routes>
        {/* Ruta para el menú principal */}
        <Route path="/" element={<Navigate to="/menu-principal" />} />
        <Route path="/menu-principal" element={<MenuPrincipal />} />

        {/* Rutas que incluyen el Navigation */}
        <Route
          path="/instituciones"
          element={
            <WithNavigation>
              <InstitucionesPage />
            </WithNavigation>
          }
        />
        <Route
          path="/instituciones/:id"
          element={
            <WithNavigation>
              <InstitucionFormPage />
            </WithNavigation>
          }
        />
        <Route
          path="/instituciones-create"
          element={
            <WithNavigation>
              <InstitucionFormPage />
            </WithNavigation>
          }
        />
        <Route
          path="/administrar-colegios"
          element={
            <WithNavigation>
              <AdministracionColegios />
            </WithNavigation>
          }
        />

        {/* Otras rutas sin Navigation */}
        {/* Puedes agregar otras rutas aquí que no necesiten el Navigation */}
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
