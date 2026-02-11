import { WizardContainer } from "@/components/posventa"
import Image from "next/image"

export default function HomePage() {
  return (
    <main className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Panel izquierdo - Imagen fija */}
      <div className="hidden lg:block relative">
        <div className="fixed top-0 left-0 w-1/2 h-screen">
          <Image
            src="https://grupodaer.com/wp-content/uploads/2022/02/daer-home.jpg"
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
        {/* Header móvil */}
        <header className="lg:hidden bg-[#434E72] py-4 shadow-md">
          <div className="px-4 flex items-center justify-center">
            <h1 className="text-xl font-semibold text-white tracking-wide">
              Grupo Daer
            </h1>
          </div>
        </header>

        <div className="py-6 px-4 md:px-6 lg:px-8 xl:px-10">
          {/* Encabezado del formulario */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#333]">
              Solicitud de Posventa
            </h2>
            <p className="text-[#666] mt-2">
              Complete el formulario para registrar su solicitud de servicio
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
