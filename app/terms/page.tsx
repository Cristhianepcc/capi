import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f5]">
      <Navbar />
      <main className="flex-1 mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-3xl font-black text-slate-900 mb-6">Términos y Condiciones</h1>
        <p className="text-slate-600 leading-relaxed">
          Estos términos y condiciones regulan el uso de la plataforma Capi. Al acceder y utilizar
          nuestros servicios, aceptas cumplir con las políticas aquí descritas. Nos reservamos el
          derecho de actualizar estos términos en cualquier momento. Para consultas, contacta a
          nuestro equipo en soporte@capi.dev.
        </p>
      </main>
      <Footer />
    </div>
  );
}
