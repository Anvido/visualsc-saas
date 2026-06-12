import { useLocation, Link } from "react-router-dom";
import { ArrowLeft, MessageSquare } from "lucide-react";

export default function Placeholder() {
  const location = useLocation();
  const pageName = location.pathname.split("/")[1] || "page";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border hidden lg:block">
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sidebar-primary to-sidebar-accent flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-serif font-bold text-sm">V</span>
            </div>
            <span className="text-white font-serif font-bold text-lg">VISUALSC</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <h1 className="text-2xl font-serif font-bold text-foreground">Sección</h1>
        </header>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <MessageSquare size={32} className="text-primary" />
            </div>

            <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
              Página en desarrollo
            </h2>

            <p className="text-muted-foreground mb-8">
              Esta sección está siendo construida. Sigue prompting en el chat para agregar funcionalidades a esta página.
            </p>

            <div className="space-y-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 button-primary font-semibold w-full"
              >
                <ArrowLeft size={20} />
                Volver al Dashboard
              </Link>

              <p className="text-xs text-muted-foreground pt-4">
                ¿Necesitas esta funcionalidad? Escribe en el chat para continuarla implementando.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
