import { Briefcase } from "lucide-react";

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Gestión de Cuentas</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm transition-colors hover:bg-primary/90 shadow-sm">
          Nueva Cuenta
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-16 text-center flex flex-col items-center justify-center">
          <Briefcase className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">No hay cuentas registradas</h3>
          <p className="text-sm text-slate-500 max-w-sm mb-6">Administra tus clientes y empresas centralmente creando tu primera Cuenta.</p>
        </div>
      </div>
    </div>
  );
}
