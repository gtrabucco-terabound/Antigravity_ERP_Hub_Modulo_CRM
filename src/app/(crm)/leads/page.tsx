import { Users } from "lucide-react";

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Gestión de Leads</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm transition-colors hover:bg-primary/90 shadow-sm">
          Nuevo Lead
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-16 text-center flex flex-col items-center justify-center">
          <Users className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">No hay leads registrados</h3>
          <p className="text-sm text-slate-500 max-w-sm mb-6">Comienza a construir tu embudo de ventas creando tu primer Lead.</p>
        </div>
      </div>
    </div>
  );
}
