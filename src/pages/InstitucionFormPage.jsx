import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createInstitucion, getInstitucion, updateInstitucion } from "../api/instituciones.api";
import { toast } from "react-hot-toast";
import { Footer } from "../components/footer";

export function InstitucionFormPage() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const navigate = useNavigate();
  const params = useParams();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      formData.append("institucion_nombre", data.institucion_nombre);
      formData.append("institucion_direccion", data.institucion_direccion);
      formData.append("institucion_nit", data.institucion_nit);
      formData.append("institucion_contactos", data.institucion_contactos);
      formData.append("institucion_telefono", data.institucion_telefono);
      if (data.institucion_logo[0]) {
        formData.append("institucion_logo", data.institucion_logo[0]);
      }

      if (params.id) {
        await updateInstitucion(params.id, formData);
        toast.success("Institución actualizada", { position: "bottom-right" });
      } else {
        await createInstitucion(formData);
        toast.success("Nueva Institución creada", { position: "bottom-right" });
      }
      navigate("/instituciones");
    } catch (error) {
      toast.error("Error al crear/actualizar la Institución", { position: "bottom-right" });
    }
  });

  useEffect(() => {
    async function loadInstitucion() {
      if (params.id) {
        const { data } = await getInstitucion(params.id);
        setValue("institucion_nombre", data.institucion_nombre);
        setValue("institucion_direccion", data.institucion_direccion);
        setValue("institucion_nit", data.institucion_nit);
        setValue("institucion_contactos", data.institucion_contactos);
        setValue("institucion_telefono", data.institucion_telefono);
      }
    }
    loadInstitucion();
  }, [params.id, setValue]);

  return (
    <div
      className="flex flex-col items-center w-full px-4"
      style={{ backgroundColor: "#ffffff25" }}
    >
      <div className="w-full max-w-3xl mt-24 mb-24">
        <form
          onSubmit={onSubmit}
          className="bg-gray-800 p-6 rounded-3xl shadow-xl w-full"
        >
          {/* Agrupamos campos en filas para reducir la longitud del formulario */}
          <div className="flex flex-wrap -mx-2 mb-4">
            <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
              <label
                className="block text-white text-base font-semibold mb-1"
                htmlFor="nombre"
              >
                Nombre
              </label>
              <input
                className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                id="nombre"
                type="text"
                placeholder="Nombre"
                {...register("institucion_nombre", { required: true })}
              />
              {errors.institucion_nombre && (
                <span className="text-red-500 text-sm">
                  Este campo es requerido
                </span>
              )}
            </div>
            <div className="w-full md:w-1/2 px-2">
              <label
                className="block text-white text-base font-semibold mb-1"
                htmlFor="nit"
              >
                NIT
              </label>
              <input
                className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                id="nit"
                type="text"
                placeholder="NIT"
                {...register("institucion_nit", { required: true })}
              />
              {errors.institucion_nit && (
                <span className="text-red-500 text-sm">
                  Este campo es requerido
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap -mx-2 mb-4">
            <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
              <label
                className="block text-white text-base font-semibold mb-1"
                htmlFor="direccion"
              >
                Dirección
              </label>
              <input
                className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                id="direccion"
                type="text"
                placeholder="Dirección"
                {...register("institucion_direccion", { required: true })}
              />
              {errors.institucion_direccion && (
                <span className="text-red-500 text-sm">
                  Este campo es requerido
                </span>
              )}
            </div>
            <div className="w-full md:w-1/2 px-2">
              <label
                className="block text-white text-base font-semibold mb-1"
                htmlFor="telefono"
              >
                Teléfono
              </label>
              <input
                className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                id="telefono"
                type="tel"
                placeholder="Teléfono"
                {...register("institucion_telefono", { required: true })}
              />
              {errors.institucion_telefono && (
                <span className="text-red-500 text-sm">
                  Este campo es requerido
                </span>
              )}
            </div>
          </div>

          <div className="mb-4 px-2">
            <label
              className="block text-white text-base font-semibold mb-1"
              htmlFor="correo"
            >
              Correo Electrónico
            </label>
            <input
              className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              id="correo"
              type="email"
              placeholder="Correo Electrónico"
              {...register("institucion_contactos", { required: true })}
            />
            {errors.institucion_contactos && (
              <span className="text-red-500 text-sm">
                Este campo es requerido
              </span>
            )}
          </div>

          <div className="mb-4 px-2">
            <label
              className="block text-white text-base font-semibold mb-1"
              htmlFor="archivo"
            >
              Seleccionar imagen para la institución (PNG)
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center w-full h-32 border-4 border-dashed border-blue-500 rounded-2xl cursor-pointer hover:bg-gray-700">
                <div className="flex flex-col items-center justify-center pt-7">
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16l-4-4m0 0l4-4m-4 4h18M13 5l7 7-7 7"
                    />
                  </svg>
                  <p className="text-sm text-white pt-1 tracking-wider">
                    Seleccionar archivo
                  </p>
                </div>
                <input
                  className="hidden"
                  id="archivo"
                  type="file"
                  accept="image/png"
                  {...register("institucion_logo", {
                    validate: {
                      isPng: (files) => {
                        if (files.length > 0) {
                          const file = files[0];
                          if (file.type !== "image/png") {
                            return "Solo se permiten imágenes en formato PNG.";
                          }
                        }
                        return true;
                      },
                    },
                  })}
                />
              </label>
            </div>
            {errors.institucion_logo && (
              <span className="text-red-500 text-sm">
                {errors.institucion_logo.message}
              </span>
            )}
          </div>

          <div className="px-2">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
              Guardar
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

