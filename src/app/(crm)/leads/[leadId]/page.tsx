"use client"

import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  Calendar,
  MoreVertical,
  Edit,
  RefreshCcw,
  Trash2,
  Clock,
  User,
  ExternalLink,
  MessageSquare,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

export default function LeadDetailPage() {
  const { leadId } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const { selectedTenant } = useTenant();
  
  const tenantId = selectedTenant?.id || "";
  
  const leadRef = db && tenantId && leadId 
    ? doc(db, "tenants", tenantId, "leads", leadId as string) 
    : null;
    
  const { data: lead, loading } = useDocument(leadRef);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center p-12">
        <h2 className="text-xl font-bold text-slate-900">Lead no encontrado</h2>
        <p className="text-slate-500 mt-2">El lead que intenta ver no existe o no tiene permisos para acceder.</p>
        <Button className="mt-6" onClick={() => router.push("/leads")}>Volver a Leads</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2 -ml-2 text-slate-500 hover:text-slate-900" onClick={() => router.push("/leads")}>
          <ChevronLeft className="h-4 w-4" /> Volver a la lista
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" /> Editar
          </Button>
          <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
            <RefreshCcw className="h-4 w-4" /> Convertir
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Eliminar Lead</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-2xl font-bold text-slate-900">{lead.name}</CardTitle>
                  <Badge variant="secondary" className={cn(
                    "text-[10px] uppercase font-bold px-2 py-0.5",
                     lead.status === 'NEW' && "bg-blue-50 text-blue-700 border-blue-100",
                     lead.status === 'QUALIFIED' && "bg-emerald-50 text-emerald-700 border-emerald-100"
                  )}>
                    {lead.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-slate-500 font-medium italic">
                  <Building2 className="h-4 w-4" />
                  {lead.company}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User className="h-3 w-3" /> Información de Contacto
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <span>{lead.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-slate-400" />
                  </div>
                  <span>{lead.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                    <Globe className="h-4 w-4 text-slate-400" />
                  </div>
                  <span className="truncate">{lead.website || 'No especificado'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <RefreshCcw className="h-3 w-3" /> Origen & Clasificación
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Fuente:</span>
                  <Badge variant="outline" className="font-bold text-slate-700 border-slate-200">{lead.source}</Badge>
                </div>
                <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Owner:</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary">UA</div>
                    Usuario Asignado
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Mini-Stats */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Cronología</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500"></div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-900">Lead Creado</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden relative">
             <CardHeader className="pb-0">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score del Lead</CardTitle>
             </CardHeader>
             <CardContent className="pt-2 pb-6">
                <div className="text-4xl font-black text-white italic">85<span className="text-lg text-slate-500 font-medium ml-1">/100</span></div>
                <p className="text-[10px] text-slate-500 mt-2">Alta probabilidad de conversión basada en actividad reciente.</p>
                <div className="absolute -right-4 -bottom-4 opacity-10">
                   <TrendingUp className="h-24 w-24 text-white" />
                </div>
             </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Tabs Section placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="md:col-span-2 border-none shadow-sm">
            <CardHeader className="border-b border-slate-50 flex flex-row items-center justify-between">
               <CardTitle className="text-lg font-bold text-slate-900">Notas & Observaciones</CardTitle>
               <Button variant="ghost" size="sm" className="h-8 text-primary font-bold"><Plus className="h-3.5 w-3.5 mr-1" /> Nueva Nota</Button>
            </CardHeader>
            <CardContent className="p-0">
               <div className="p-8 text-center">
                  <FileText className="h-12 w-12 text-slate-100 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">No hay notas registradas para este lead.</p>
               </div>
            </CardContent>
         </Card>
         
         <Card className="border-none shadow-sm">
            <CardHeader className="border-b border-slate-50">
               <CardTitle className="text-lg font-bold text-slate-900 italic">Interacciones</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
               <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start gap-3 h-12 text-slate-700 font-medium">
                     <MessageSquare className="h-4 w-4 text-blue-500" /> WhatsApp Directo
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3 h-12 text-slate-700 font-medium">
                     <Mail className="h-4 w-4 text-emerald-500" /> Enviar Correo
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}

function TrendingUp(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}
