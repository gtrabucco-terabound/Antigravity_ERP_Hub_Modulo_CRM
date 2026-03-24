"use client"

import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  Calendar,
  MoreVertical,
  Edit,
  Plus,
  Trash2,
  Clock,
  ExternalLink,
  MessageSquare,
  Target,
  History,
  MapPin
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

export default function ContactDetailPage() {
  const { contactId } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const { selectedTenant } = useTenant();
  
  const tenantId = selectedTenant?.id || "";
  
  const contactRef = db && tenantId && contactId 
    ? doc(db, "tenants", tenantId, "contacts", contactId as string) 
    : null;
    
  const { data: contact, loading } = useDocument(contactRef);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center p-12">
        <h2 className="text-xl font-bold text-slate-900">Contacto no encontrado</h2>
        <Button className="mt-6" onClick={() => router.push("/contacts")}>Volver a Contactos</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Navigation & Header Actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2 -ml-2 text-slate-500 hover:text-slate-900" onClick={() => router.push("/contacts")}>
          <ChevronLeft className="h-4 w-4" /> Volver a Contactos
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" /> Editar
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Crear Oportunidad
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1 border-none shadow-sm overflow-hidden bg-white">
          <div className="h-24 bg-slate-900 relative">
             <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                <div className="h-20 w-20 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-slate-600 text-2xl font-black shadow-lg">
                   {contact.name?.charAt(0)}
                </div>
             </div>
          </div>
          <CardContent className="pt-14 pb-8 text-center space-y-4">
             <div>
                <CardTitle className="text-2xl font-black text-slate-900 leading-tight">{contact.name}</CardTitle>
                <p className="text-sm font-bold text-primary uppercase tracking-tighter mt-1">{contact.position || 'Cargo no especificado'}</p>
             </div>
             <div className="flex flex-col gap-2 pt-4">
                <Button variant="secondary" className="w-full justify-start gap-3 h-11 border border-slate-100">
                   <Mail className="h-4 w-4 text-slate-400" />
                   <span className="text-xs font-semibold text-slate-700 truncate">{contact.email}</span>
                </Button>
                <Button variant="secondary" className="w-full justify-start gap-3 h-11 border border-slate-100">
                   <Phone className="h-4 w-4 text-slate-400" />
                   <span className="text-xs font-semibold text-slate-700">{contact.phone || '-'}</span>
                </Button>
             </div>
             <Separator className="bg-slate-50" />
             <div className="flex justify-center gap-1">
                <Badge variant="outline" className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 border-slate-200">CONTACTO DIRECTO</Badge>
             </div>
          </CardContent>
        </Card>

        {/* Main Info Area */}
        <div className="lg:col-span-2 space-y-6">
           <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                 <CardTitle className="text-base font-bold text-slate-900 italic flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" /> Organización Vinculada
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                 {contact.accountId ? (
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-primary/20 hover:bg-slate-50/50 transition-all cursor-pointer group" onClick={() => router.push(`/accounts/${contact.accountId}`)}>
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-slate-900 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                             <Building2 className="h-6 w-6" />
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-900 tracking-tight">Nombre de la Cuenta</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ID: {contact.accountId.slice(0, 8)}</p>
                          </div>
                       </div>
                       <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                 ) : (
                    <div className="text-center py-4 space-y-3">
                       <p className="text-sm text-slate-500 italic">Este contacto no está vinculado a ninguna cuenta.</p>
                       <Button variant="outline" size="sm" className="font-bold border-dashed border-slate-200">Vincular a Cuenta</Button>
                    </div>
                 )}
              </CardContent>
           </Card>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm">
                 <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">Oportunidades Relacionadas</CardTitle>
                 </CardHeader>
                 <CardContent className="h-32 flex flex-col items-center justify-center text-center">
                    <Target className="h-8 w-8 text-slate-100 mb-2" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Sin oportunidades activas</p>
                 </CardContent>
              </Card>
              
              <Card className="border-none shadow-sm">
                 <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">Actividad Reciente</CardTitle>
                 </CardHeader>
                 <CardContent className="h-32 flex flex-col items-center justify-center text-center">
                    <History className="h-8 w-8 text-slate-100 mb-2" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Sin movimientos registrados</p>
                 </CardContent>
              </Card>
           </div>
           
           <Card className="border-none shadow-sm h-full">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
                 <CardTitle className="text-base font-bold text-slate-900 italic">Notas</CardTitle>
                 <Button variant="ghost" size="sm" className="h-8 text-primary font-bold"><Plus className="h-3.5 w-3.5 mr-1" /> Nueva</Button>
              </CardHeader>
              <CardContent className="p-8 text-center text-slate-400 text-sm">
                 Escriba notas sobre interacciones o preferencias del contacto.
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
