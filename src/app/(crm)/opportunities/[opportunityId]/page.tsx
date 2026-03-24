"use client"

import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Target, 
  Building2, 
  User, 
  DollarSign, 
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Clock,
  ExternalLink,
  TrendingUp,
  History,
  Briefcase,
  FileText,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTenant } from "@/context/tenant-context";
import { useFirestore, useDocument } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";

export default function OpportunityDetailPage() {
  const { opportunityId } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const { selectedTenant } = useTenant();
  
  const tenantId = selectedTenant?.id || "";
  
  const opportunityRef = db && tenantId && opportunityId 
    ? doc(db, "tenants", tenantId, "opportunities", opportunityId as string) 
    : null;
    
  const { data: opp, loading } = useDocument(opportunityRef);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!opp) {
    return (
      <div className="text-center p-12">
        <h2 className="text-xl font-bold text-slate-900">Oportunidad no encontrada</h2>
        <Button className="mt-6" onClick={() => router.push("/opportunities")}>Volver a Oportunidades</Button>
      </div>
    );
  }

  const STAGES = ["PROSPECTING", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Navigation & Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <Button variant="ghost" className="gap-2 -ml-2 text-slate-500 hover:text-slate-900 mb-2" onClick={() => router.push("/opportunities")}>
            <ChevronLeft className="h-4 w-4" /> Pipeline de Ventas
          </Button>
          <div className="flex items-center gap-4 flex-wrap">
             <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{opp.title}</h1>
             <Badge variant="outline" className="bg-slate-900 text-white font-black px-3 py-1 text-[10px] italic tracking-tighter shadow-lg shadow-black/10">
                STG: {opp.stage}
             </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-emerald-100 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold shrink-0">
            <CheckCircle2 className="h-4 w-4" /> Marcar Ganada
          </Button>
          <Button variant="outline" className="gap-2 border-slate-200 font-bold shrink-0">
            <Edit className="h-4 w-4" /> Editar
          </Button>
        </div>
      </div>

      {/* Stepper Pipeline placeholder */}
      <Card className="border-none shadow-sm overflow-hidden bg-slate-50/50 p-1">
         <div className="flex items-center justify-between overflow-x-auto gap-2">
            {STAGES.slice(0, 5).map((stage, idx) => {
               const isActive = opp.stage === stage;
               const isCompleted = STAGES.indexOf(opp.stage) > idx;
               return (
                  <div key={stage} className={cn(
                     "flex-1 min-w-[120px] py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all border",
                     isActive ? "bg-white shadow-sm border-primary/20 text-primary" : 
                     isCompleted ? "bg-emerald-50 border-emerald-100 text-emerald-700 opacity-60" : 
                     "bg-transparent border-transparent text-slate-400"
                  )}>
                     <span className="text-[10px] font-black italic tracking-tighter">{idx + 1}. {stage}</span>
                     {isCompleted && <CheckCircle2 className="h-3 w-3" />}
                  </div>
               );
            })}
         </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Financials & Relations */}
        <div className="lg:col-span-2 space-y-6">
           <Card className="border-none shadow-sm">
              <CardHeader>
                 <CardTitle className="text-xl font-bold text-slate-900 italic">Resumen Comercial</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                 <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-2 relative overflow-hidden">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest relative z-10">Valor Estimado</p>
                    <div className="text-4xl font-black italic tracking-tighter relative z-10">
                       {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD' }).format(opp.value || 0)}
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10">
                       <DollarSign className="h-24 w-24" />
                    </div>
                 </div>
                 
                 <div className="p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Probabilidad de Cierre</p>
                       <div className="flex items-end gap-2 mt-1">
                          <span className="text-3xl font-black text-slate-900">{opp.probability || 0}%</span>
                          <TrendingUp className="h-6 w-6 text-primary mb-1" />
                       </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full mt-4 overflow-hidden">
                       <div className="h-full bg-primary" style={{ width: `${opp.probability || 0}%` }}></div>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm hover:border-primary/20 border border-transparent transition-all cursor-pointer group" onClick={() => opp.accountId && router.push(`/accounts/${opp.accountId}`)}>
                 <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cuenta Vinculada</CardTitle>
                 </CardHeader>
                 <CardContent className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <Building2 className="h-5 w-5" />
                       </div>
                       <span className="font-bold text-slate-900 leading-tight">Nombre de la Cuenta</span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                 </CardContent>
              </Card>

              <Card className="border-none shadow-sm border border-transparent">
                 <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contacto Principal</CardTitle>
                 </CardHeader>
                 <CardContent className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                          <User className="h-5 w-5" />
                       </div>
                       <span className="font-bold text-slate-900 leading-tight">Asignar Contacto</span>
                    </div>
                    <Plus className="h-4 w-4 text-primary cursor-pointer hover:scale-110 transition-transform" />
                 </CardContent>
              </Card>
           </div>
        </div>

        {/* Right Column: Deadlines & History */}
        <div className="space-y-6">
           <Card className="border-none shadow-sm bg-slate-50/50">
              <CardHeader className="pb-2">
                 <CardTitle className="text-xs font-black text-slate-500 uppercase tracking-widest">Fechas Críticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                 <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex flex-col items-center justify-center shadow-sm">
                       <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Cierre Estimado</p>
                       <p className="text-sm font-black text-slate-900">{opp.expectedCloseDate ? new Date(opp.expectedCloseDate).toLocaleDateString() : 'Pendiente'}</p>
                    </div>
                 </div>
                 <Separator className="bg-slate-100 opacity-50" />
                 <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex flex-col items-center justify-center shadow-sm">
                       <Clock className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Creada en</p>
                       <p className="text-sm font-bold text-slate-700">{opp.createdAt ? new Date(opp.createdAt).toLocaleDateString() : '-'}</p>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-slate-50/30">
                 <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">Observaciones</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                 <textarea 
                    className="w-full h-40 p-4 text-sm border-none bg-transparent focus:ring-0 resize-none italic text-slate-600" 
                    placeholder="Agregue detalles técnicos o estratégicos de la oportunidad..."
                    defaultValue={opp.observations || ""}
                 />
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
