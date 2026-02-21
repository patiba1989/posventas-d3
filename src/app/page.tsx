import { WizardContainer } from "@/components/posventa"
import { Header } from "@/components/ui/Header"
import Image from "next/image"
import imagenFondo from "../../public/imagen_fondo.jpg"

export default function HomePage() {
  return (
    <main className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Panel izquierdo - Imagen fija */}
      <div className="hidden lg:block relative">
        <div className="fixed top-0 left-0 w-1/2 h-screen">
          <Image
            src={imagenFondo}
            alt="Grupo Daer"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#434E72]/80 to-[#434E72]/40" />

          {/* Contenido sobre la imagen */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
            <div className="text-center">
              <h1 className="text-3xl xl:text-4xl font-bold mb-4 drop-shadow-lg">
                Grupo Daer
              </h1>
              <div className="w-16 h-1 bg-white mx-auto mb-4"></div>
              <p className="text-lg xl:text-xl font-light leading-relaxed drop-shadow">
                Construimos espacios que transforman vidas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="min-h-screen bg-[#f5f5f5]">
        <Header />

        <div className="py-6 px-4 md:px-6 lg:px-8 xl:px-10">
          {/* Descripción del formulario */}
          <div className="mb-6">
            <p className="text-[#666]">
              Complete el formulario para registrar su solicitud de servicio
            </p>
            <p className="text-sm text-[#888] mt-1 italic">
              Por favor, lea el manual del propietario antes de realizar una solicitud de posventa.
            </p>
          </div>

          {/* Card del formulario */}
          <div className="bg-white rounded-lg shadow-sm border border-[#ddd] p-5 md:p-6 lg:p-8">
            <WizardContainer />
          </div>

          {/* Footer */}
          <footer className="mt-6 text-center">
            <p className="text-sm text-[#999]">
              © {new Date().getFullYear()} Grupo Daer - Todos los derechos reservados
            </p>
          </footer>
        </div>
      </div>
    </main>
  )
}
