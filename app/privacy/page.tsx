import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f5]">
      <Navbar />
      <main className="flex-1 mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-3xl font-black text-slate-900 mb-6">Política de Privacidad</h1>
        <p className="text-slate-600 leading-relaxed">
          En Capi nos comprometemos a proteger tu información personal. Los datos que recopilamos
          se utilizan exclusivamente para mejorar tu experiencia en la plataforma y facilitar la
          coordinación de eventos de voluntariado. No compartimos tu información con terceros sin
          tu consentimiento. Para más detalles, escríbenos a soporte@capi.dev.
        </p>
      </main>
      <Footer />
    </div>
  );
}
