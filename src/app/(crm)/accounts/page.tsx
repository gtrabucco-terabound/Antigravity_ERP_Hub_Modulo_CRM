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
  ExternalLink,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Briefcase,
  Users
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
import { AccountDialog } from "@/components/crm/account-dialog";

export default function AccountsPage() {
  const db = useFirestore();
  const { selectedTenant } = useTenant();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const tenantId = selectedTenant?.id || "";

  const accountsQuery = useMemoFirebase(() => {
    if (!db || !tenantId) return null;
    return query(
      collection(db, "tenants", tenantId, "accounts"),
      orderBy("createdAt", "desc")
    );
  }, [db, tenantId]);

  const { data: accounts, loading } = useCollection(accountsQuery);

  const filteredAccounts = accounts?.filter((account: any) => 
    account.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.country?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Cuentas</h1>
          <p className="text-slate-500 font-medium">Gestione sus organizaciones clientes y partners comerciales.</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4" /> Nueva Cuenta
          </Button>
        </div>
      </div>

      <AccountDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      {/* Filters Bar */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Buscar por nombre, industria o país..." 
              className="pl-10 bg-slate-50/50 border-slate-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-slate-50/50 border-slate-100">
              <Filter className="h-4 w-4" /> Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-[300px] font-bold text-slate-700">Nombre de la Cuenta</TableHead>
              <TableHead className="font-bold text-slate-700">Industria</TableHead>
              <TableHead className="font-bold text-slate-700">Ubicación</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">Estado</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">Relaciones</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-slate-500">Cargando cuentas...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredAccounts.length > 0 ? (
              filteredAccounts.map((account: any) => (
                <TableRow key={account.id} className="hover:bg-slate-50/50 transition-colors border-slate-50 group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-primary group-hover:bg-white border border-transparent group-hover:border-slate-100 shadow-sm transition-all">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-tight">{account.name}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter mt-0.5">ID: {account.id?.slice(0, 8)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Briefcase className="h-3 w-3 text-slate-400" />
                      {account.industry || 'No especificada'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {account.country || '-'}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-[10px] px-2 py-0.5 font-bold uppercase",
                        account.status === 'ACTIVE' && "bg-emerald-50 text-emerald-700 border-emerald-100",
                        account.status === 'INACTIVE' && "bg-slate-50 text-slate-700 border-slate-100",
                        account.status === 'ON_HOLD' && "bg-orange-50 text-orange-700 border-orange-100"
                      )}
                    >
                      {account.status || 'ACTIVE'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                             <div className="h-7 w-7 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-100">0</div>
                          </TooltipTrigger>
                          <TooltipContent>Contactos</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px]">
                        <DropdownMenuLabel>Gestión</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/accounts/${account.id}`)}>
                          <Eye className="mr-2 h-4 w-4" /> Ver Detalle
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" /> Editar Cuenta
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/accounts/${account.id}/contacts`)}>
                          <Users className="mr-2 h-4 w-4" /> Ver Contactos
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Plus className="mr-2 h-4 w-4" /> Nueva Oportunidad
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
                    <Building2 className="h-12 w-12 text-slate-200 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No hay cuentas todavía</h3>
                    <p className="text-sm text-slate-500 max-w-xs mt-1">
                      {searchTerm ? 'No hay coincidencias para tu búsqueda.' : 'Las cuentas son la base de tu CRM. Crea la primera para empezar.'}
                    </p>
                    {!searchTerm && <Button className="mt-6 gap-2"><Plus className="h-4 w-4" /> Nueva Cuenta</Button>}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// Minimal tooltip implementation since it might not be fully configured
function TooltipProvider({ children }: { children: React.ReactNode }) { return <>{children}</> }
function Tooltip({ children }: { children: React.ReactNode }) { return <>{children}</> }
function TooltipTrigger({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) { return <>{children}</> }
function TooltipContent({ children }: { children: React.ReactNode }) { return null }
