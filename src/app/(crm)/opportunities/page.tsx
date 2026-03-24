"use client"

import { useState } from "react";
import { 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  LayoutGrid,
  List as ListIcon,
  DollarSign,
  Calendar,
  TrendingUp,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTenant } from "@/context/tenant-context";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { OpportunityDialog } from "@/components/crm/opportunity-dialog";

type ViewMode = "table" | "pipeline";

export default function OpportunitiesPage() {
  const db = useFirestore();
  const { selectedTenant } = useTenant();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const tenantId = selectedTenant?.id || "";

  const opportunitiesQuery = useMemoFirebase(() => {
    if (!db || !tenantId) return null;
    return query(
      collection(db, "tenants", tenantId, "opportunities"),
      orderBy("expectedCloseDate", "asc")
    );
  }, [db, tenantId]);

  const { data: opportunities, loading } = useCollection(opportunitiesQuery);

  const filteredOpportunities = opportunities?.filter((opp: any) => 
    opp.title?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const STAGES = ["PROSPECTING", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Oportunidades</h1>
          <p className="text-slate-500 font-medium">Gestione su pipeline de ventas y proyecciones de ingresos.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <Button 
              variant={viewMode === "table" ? "secondary" : "ghost"} 
              size="sm" 
              className={cn("h-7 px-3 gap-1", viewMode === "table" && "bg-white shadow-sm border-slate-200")}
              onClick={() => setViewMode("table")}
            >
              <ListIcon className="h-3.5 w-3.5" /> Tabla
            </Button>
            <Button 
              variant={viewMode === "pipeline" ? "secondary" : "ghost"} 
              size="sm" 
              className={cn("h-7 px-3 gap-1", viewMode === "pipeline" && "bg-white shadow-sm border-slate-200")}
              onClick={() => setViewMode("pipeline")}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Pipeline
            </Button>
          </div>
          <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4" /> Nueva
          </Button>
        </div>
      </div>

      <OpportunityDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      {/* Filters Bar */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Buscar por título de oportunidad..." 
              className="pl-10 bg-slate-50/50 border-slate-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-slate-50/50 border-slate-100">
              <Filter className="h-4 w-4" /> Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content View */}
      {viewMode === "table" ? (
        <Card className="border-none shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="w-[300px] font-bold text-slate-700">Oportunidad / Cuenta</TableHead>
                <TableHead className="font-bold text-slate-700">Etapa</TableHead>
                <TableHead className="font-bold text-slate-700">Valor Est.</TableHead>
                <TableHead className="font-bold text-slate-700 text-center">Prob.</TableHead>
                <TableHead className="font-bold text-slate-700">Cierre Esp.</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary inline-block mr-2" />
                    Cargando pipeline...
                  </TableCell>
                </TableRow>
              ) : filteredOpportunities.length > 0 ? (
                filteredOpportunities.map((opp: any) => (
                  <TableRow key={opp.id} className="hover:bg-slate-50/50 border-slate-50 group">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-tight">{opp.title}</span>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500">
                          <Building2 className="h-3 w-3" />
                          <span>{opp.accountName || 'Cuenta Asociada'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-600 border-slate-200">
                        {opp.stage}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-slate-900">
                      {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD' }).format(opp.value || 0)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-bold text-slate-700">{opp.probability || 0}%</span>
                        <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${opp.probability || 0}%` }} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {opp.expectedCloseDate ? new Date(opp.expectedCloseDate).toLocaleDateString() : '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/opportunities/${opp.id}`)}><Eye className="mr-2 h-4 w-4" /> Detalle</DropdownMenuItem>
                          <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-emerald-600 font-bold"><TrendingUp className="mr-2 h-4 w-4" /> Marcar Ganada</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center text-slate-500">No se encontraron oportunidades.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide min-h-[600px]">
          {STAGES.slice(0, 5).map((stage) => {
            const stageOpps = filteredOpportunities.filter((o: any) => o.stage === stage);
            return (
              <div key={stage} className="flex-none w-72 space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{stage}</h3>
                    <Badge variant="secondary" className="h-5 min-w-5 flex items-center justify-center p-0 rounded-full text-[10px] font-black">
                      {stageOpps.length}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {stageOpps.map((opp: any) => (
                    <Card key={opp.id} className="border-none shadow-sm hover:shadow-md cursor-pointer transition-all border border-transparent hover:border-primary/20" onClick={() => router.push(`/opportunities/${opp.id}`)}>
                      <CardContent className="p-4 space-y-3">
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">{opp.title}</h4>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Building2 className="h-3 w-3" />
                            <span>{opp.accountName || 'Cuenta Asociada'}</span>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-sm font-bold text-primary">
                              {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(opp.value || 0)}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                              <Calendar className="h-3 w-3" />
                              {opp.expectedCloseDate ? new Date(opp.expectedCloseDate).toLocaleDateString() : '-'}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="ghost" onClick={() => setIsDialogOpen(true)} className="w-full border-2 border-dashed border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-400 text-xs h-10">
                    <Plus className="h-3.5 w-3.5 mr-1" /> Añadir
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
