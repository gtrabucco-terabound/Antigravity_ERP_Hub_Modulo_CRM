"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Building2, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Trophy,
  Plus,
  ArrowRight,
  Clock,
  ChevronRight,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTenant } from "@/context/tenant-context";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const db = useFirestore();
  const { selectedTenant } = useTenant();
  const router = useRouter();
  
  const tenantId = selectedTenant?.id || "";

  // Queries for Dashboard Data
  const leadsQuery = useMemoFirebase(() => {
    if (!db || !tenantId) return null;
    return query(collection(db, "tenants", tenantId, "leads"));
  }, [db, tenantId]);

  const accountsQuery = useMemoFirebase(() => {
    if (!db || !tenantId) return null;
    return query(collection(db, "tenants", tenantId, "accounts"));
  }, [db, tenantId]);

  const opportunitiesQuery = useMemoFirebase(() => {
    if (!db || !tenantId) return null;
    return query(collection(db, "tenants", tenantId, "opportunities"));
  }, [db, tenantId]);

  const activityQuery = useMemoFirebase(() => {
    if (!db || !tenantId) return null;
    return query(
      collection(db, "tenants", tenantId, "events"),
      orderBy("timestamp", "desc"),
      limit(5)
    );
  }, [db, tenantId]);

  const { data: leads, loading: loadingLeads } = useCollection(leadsQuery);
  const { data: accounts, loading: loadingAccounts } = useCollection(accountsQuery);
  const { data: opportunities, loading: loadingOpportunities } = useCollection(opportunitiesQuery);
  const { data: activities, loading: loadingActivities } = useCollection(activityQuery);

  const loading = loadingLeads || loadingAccounts || loadingOpportunities;

  // Stats Calculations
  const activeLeads = leads?.filter((l: any) => l.status !== "LOST" && l.status !== "CONVERTED") || [];
  const qualifiedLeads = leads?.filter((l: any) => l.status === "QUALIFIED") || [];
  const activeAccounts = accounts?.filter((a: any) => a.status === "ACTIVE") || [];
  const openOpportunities = opportunities?.filter((o: any) => o.stage !== "WON" && o.stage !== "LOST") || [];
  const wonOpportunities = opportunities?.filter((o: any) => o.stage === "WON") || [];
  const pipelineValue = openOpportunities.reduce((sum: number, o: any) => sum + (o.value || 0), 0);

  const stats = [
    { title: "Leads Activos", value: activeLeads.length, icon: Users, color: "text-blue-500", bg: "bg-blue-50", href: "/leads?status=active" },
    { title: "Leads Calificados", value: qualifiedLeads.length, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50", href: "/leads?status=qualified" },
    { title: "Cuentas Activas", value: activeAccounts.length, icon: Building2, color: "text-purple-500", bg: "bg-purple-50", href: "/accounts?status=active" },
    { title: "Oportunidades", value: openOpportunities.length, icon: Briefcase, color: "text-orange-500", bg: "bg-orange-50", href: "/opportunities" },
    { title: "Valor Pipeline", value: new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD' }).format(pipelineValue), icon: DollarSign, color: "text-slate-700", bg: "bg-slate-100", href: "/opportunities" },
    { title: "Ganadas (Mes)", value: wonOpportunities.length, icon: Trophy, color: "text-yellow-600", bg: "bg-yellow-50", href: "/opportunities?stage=won" },
  ];

  const pipelineStages = [
    { name: "Lead", count: leads?.filter((l: any) => l.status === "NEW").length || 0, color: "bg-slate-200" },
    { name: "Qualified", count: qualifiedLeads.length, color: "bg-blue-200" },
    { name: "Proposal", count: opportunities?.filter((o: any) => o.stage === "PROPOSAL").length || 0, color: "bg-indigo-200" },
    { name: "Negotiation", count: opportunities?.filter((o: any) => o.stage === "NEGOTIATION").length || 0, color: "bg-purple-200" },
    { name: "Won", count: wonOpportunities.length, color: "bg-emerald-200" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-slate-500 font-medium">Cargando Dashboard CRM...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">CRM Dashboard</h1>
          <p className="text-slate-500 font-medium">Visión comercial ejecutiva para {selectedTenant?.name}.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={() => router.push('/leads')}>
            <Plus className="h-4 w-4" /> Nuevo Lead
          </Button>
          <Button className="gap-2" onClick={() => router.push('/opportunities')}>
            <Plus className="h-4 w-4" /> Nueva Oportunidad
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(stat.href)}>
            <CardContent className="p-6">
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-4", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <p className="text-xs font-semibold text-slate-500 uppercase mt-1 tracking-wider">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline Visual */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="border-b bg-slate-50/50">
          <CardTitle className="text-lg font-bold">Pipeline Comercial</CardTitle>
          <CardDescription>Resumen de flujo desde Lead hasta Cierre Ganado.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center w-full gap-2 h-24">
            {pipelineStages.map((stage, i) => (
              <div key={i} className="flex-1 flex flex-col h-full group cursor-pointer" onClick={() => router.push(`/opportunities`)}>
                <div className={cn(
                  "flex-1 rounded-lg flex items-center justify-center transition-all group-hover:opacity-80 relative overflow-hidden",
                  stage.color
                )}>
                  <span className="text-2xl font-black text-slate-900/20 absolute -right-2 -bottom-2 rotate-12">{i + 1}</span>
                  <div className="text-center z-10">
                    <div className="text-xl font-bold text-slate-900">{stage.count}</div>
                    <div className="text-[10px] font-bold uppercase tracking-tighter text-slate-600">{stage.name}</div>
                  </div>
                </div>
                {i < pipelineStages.length - 1 && (
                  <div className="h-px bg-slate-100 flex-none self-center mx-1" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Leads */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Leads Recientes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/leads" className="text-primary gap-1">Ver todos <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {leads && leads.length > 0 ? (
              <div className="space-y-4">
                {leads.slice(0, 5).map((lead: any) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group cursor-pointer" onClick={() => router.push(`/leads/${lead.id}`)}>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold">
                        {lead.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{lead.name}</p>
                        <p className="text-xs text-slate-500">{lead.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-[10px]">{lead.status}</Badge>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed">
                <p className="text-sm text-slate-500">No hay leads registrados aún.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Actividad Reciente</CardTitle>
            <CardDescription>Eventos del ecosistema CRM.</CardDescription>
          </CardHeader>
          <CardContent>
            {activities && activities.length > 0 ? (
              <div className="space-y-6">
                {activities.map((activity: any) => (
                  <div key={activity.id} className="flex gap-4 relative">
                    <div className="h-full w-px bg-slate-100 absolute left-[15px] top-8" />
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 z-10">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-semibold text-slate-900">{activity.type}</p>
                      <p className="text-xs text-slate-500 mt-1">{activity.message || `Evento registrado en el sistema.`}</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">
                        {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Recientemente'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed">
                <p className="text-sm text-slate-500">Sin actividad reciente registrada.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
