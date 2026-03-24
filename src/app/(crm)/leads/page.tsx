"use client"

import { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  RefreshCcw, 
  Archive,
  Download,
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
import { Card, CardContent } from "@/components/ui/card";
import { useTenant } from "@/context/tenant-context";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { LeadDialog } from "@/components/crm/lead-dialog";

export default function LeadsPage() {
  const db = useFirestore();
  const { selectedTenant } = useTenant();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const tenantId = selectedTenant?.id || "";

  const leadsQuery = useMemoFirebase(() => {
    if (!db || !tenantId) return null;
    return query(
      collection(db, "tenants", tenantId, "leads"),
      orderBy("createdAt", "desc")
    );
  }, [db, tenantId]);

  const { data: leads, loading } = useCollection(leadsQuery);

  const filteredLeads = leads?.filter((lead: any) => 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Leads</h1>
          <p className="text-slate-500 font-medium">Gestione sus prospectos comerciales y embudo de entrada.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Importar
          </Button>
          <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4" /> Nuevo Lead
          </Button>
        </div>
      </div>

      <LeadDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      {/* Filters Bar */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Buscar por nombre, empresa o email..." 
              className="pl-10 bg-slate-50/50 border-slate-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-slate-50/50 border-slate-100">
              <Filter className="h-4 w-4" /> Filtros Avanzados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-[250px] font-bold text-slate-700">Nombre / Empresa</TableHead>
              <TableHead className="font-bold text-slate-700">Contacto</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">Fuente</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">Estado</TableHead>
              <TableHead className="font-bold text-slate-700">Creado</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-slate-500">Cargando leads...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredLeads.length > 0 ? (
              filteredLeads.map((lead: any) => (
                <TableRow key={lead.id} className="hover:bg-slate-50/50 transition-colors border-slate-50">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{lead.name}</span>
                      <span className="text-xs text-slate-500">{lead.company}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-700">{lead.email}</span>
                      <span className="text-xs text-slate-500">{lead.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {lead.source || '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-[10px] px-2 py-0.5 font-bold uppercase",
                        lead.status === 'NEW' && "bg-blue-50 text-blue-700 border-blue-100",
                        lead.status === 'QUALIFIED' && "bg-emerald-50 text-emerald-700 border-emerald-100",
                        lead.status === 'LOST' && "bg-red-50 text-red-700 border-red-100",
                        lead.status === 'CONVERTED' && "bg-purple-50 text-purple-700 border-purple-100"
                      )}
                    >
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/leads/${lead.id}`)}>
                          <Eye className="mr-2 h-4 w-4" /> Ver Detalle
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-primary font-semibold">
                          <RefreshCcw className="mr-2 h-4 w-4" /> Convertir a Cuenta
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Archive className="mr-2 h-4 w-4" /> Archivar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center p-8">
                    <Users className="h-12 w-12 text-slate-200 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No se encontraron leads</h3>
                    <p className="text-sm text-slate-500 max-w-xs mt-1">
                      {searchTerm ? 'Revisa tus filtros de búsqueda e intenta nuevamente.' : 'Comienza a construir tu embudo creando tu primer lead.'}
                    </p>
                    {!searchTerm && <Button className="mt-6 gap-2"><Plus className="h-4 w-4" /> Nuevo Lead</Button>}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {/* Pagination Placeholder */}
        <div className="bg-slate-50/50 p-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Mostrando <strong>{filteredLeads.length}</strong> prospectos
          </p>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
