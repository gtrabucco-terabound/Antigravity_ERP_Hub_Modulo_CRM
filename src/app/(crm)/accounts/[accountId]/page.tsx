"use client"

import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar,
  MoreVertical,
  Edit,
  Plus,
  Trash2,
  Clock,
  Briefcase,
  ExternalLink,
  Users,
  Target,
  History,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export default function AccountDetailPage() {
  const { accountId } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const { selectedTenant } = useTenant();
  
  const tenantId = selectedTenant?.id || "";
  
  const accountRef = db && tenantId && accountId 
    ? doc(db, "tenants", tenantId, "accounts", accountId as string) 
    : null;
    
  const { data: account, loading } = useDocument(accountRef);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="text-center p-12">
        <h2 className="text-xl font-bold text-slate-900">Cuenta no encontrada</h2>
        <Button className="mt-6" onClick={() => router.push("/accounts")}>Volver a Cuentas</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Navigation & Header Actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2 -ml-2 text-slate-500 hover:text-slate-900" onClick={() => router.push("/accounts")}>
          <ChevronLeft className="h-4 w-4" /> Volver a Cuentas
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-slate-200">
            <Edit className="h-4 w-4" /> Editar Cuenta
          </Button>
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" /> Nueva Oportunidad
          </Button>
        </div>
      </div>

      {/* Hero Profile Section */}
      <div className="relative">
         <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="h-24 w-24 rounded-2xl bg-slate-900 flex items-center justify-center text-primary border-4 border-white shadow-xl flex-shrink-0">
               <Building2 className="h-12 w-12" />
            </div>
            <div className="space-y-2 flex-grow">
               <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{account.name}</h1>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 uppercase font-black px-3 py-1 text-[10px]">CLIENTE ACTIVO</Badge>
               </div>
               <div className="flex items-center gap-6 text-slate-500 font-medium text-sm">
                  <div className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-slate-300" /> {account.industry || 'Industria no especificada'}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-slate-300" /> {account.country || 'Ubicación no disponible'}</div>
                  <div className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-slate-300" /> {account.website || '-'}</div>
               </div>
            </div>
            
            <div className="flex md:flex-col gap-3 justify-end items-end w-full md:w-auto">
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor de Vida (LTV)</p>
                  <p className="text-2xl font-black text-slate-900 tracking-tight">$ 0.00</p>
               </div>
            </div>
         </div>
      </div>

      {/* Detailed Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-100/50 p-1 border border-slate-200 rounded-xl overflow-x-auto w-full justify-start md:w-auto">
          <TabsTrigger value="overview" className="gap-2 px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
            <LayoutDashboard className="h-4 w-4" /> Resumen
          </TabsTrigger>
          <TabsTrigger value="contacts" className="gap-2 px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
            <Users className="h-4 w-4" /> Contactos
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="gap-2 px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
            <Target className="h-4 w-4" /> Oportunidades
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2 px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
            <History className="h-4 w-4" /> Historial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 border-none shadow-sm">
                 <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-900 italic">Información Principal</CardTitle>
                 </CardHeader>
                 <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Nombre Legal</label>
                          <p className="text-sm font-semibold text-slate-700">{account.name}</p>
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Industria / Sector</label>
                          <p className="text-sm font-semibold text-slate-700">{account.industry}</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Propietario de la Cuenta</label>
                          <div className="flex items-center gap-2 mt-1">
                             <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">UA</div>
                             <p className="text-sm font-semibold text-slate-700">Usuario Administrador</p>
                          </div>
                       </div>
                    </div>
                 </CardContent>
              </Card>

              <div className="space-y-6">
                 <Card className="border-none shadow-sm bg-gradient-to-br from-primary to-primary-foreground text-white p-6 relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                       <h3 className="text-xs font-bold uppercase tracking-widest opacity-80">Saldo de Cuenta</h3>
                       <div className="text-3xl font-black italic">$ 0.00</div>
                       <Button variant="outline" className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white font-bold h-9">Generar Resumen</Button>
                    </div>
                    <div className="absolute -right-8 -bottom-8 opacity-10">
                       <LayoutDashboard className="h-32 w-32" />
                    </div>
                 </Card>
              </div>
           </div>
        </TabsContent>

        <TabsContent value="contacts" className="animate-in slide-in-from-bottom-2 duration-300">
           <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                 <CardTitle className="text-lg font-bold text-slate-900">Personas de Contacto</CardTitle>
                 <Button variant="outline" size="sm" className="gap-2 font-bold"><Plus className="h-4 w-4" /> Nuevo Contacto</Button>
              </CardHeader>
              <CardContent className="p-12 text-center">
                 <Users className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                 <p className="text-sm text-slate-500">No hay contactos vinculados a esta cuenta todavía.</p>
              </CardContent>
           </Card>
        </TabsContent>
        
        <TabsContent value="opportunities" className="animate-in slide-in-from-bottom-2 duration-300">
           <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                 <CardTitle className="text-lg font-bold text-slate-900">Pipeline de Ventas</CardTitle>
                 <Button variant="outline" size="sm" className="gap-2 font-bold"><Plus className="h-4 w-4" /> Nueva</Button>
              </CardHeader>
              <CardContent className="p-12 text-center">
                 <Target className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                 <p className="text-sm text-slate-500">No se han registrado oportunidades comerciales para esta cuenta.</p>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
