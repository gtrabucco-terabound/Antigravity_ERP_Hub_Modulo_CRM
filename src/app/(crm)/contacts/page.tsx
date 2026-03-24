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
  Building2,
  Mail,
  Phone,
  Briefcase,
  Loader2
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
import { ContactDialog } from "@/components/crm/contact-dialog";

export default function ContactsPage() {
  const db = useFirestore();
  const { selectedTenant } = useTenant();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const tenantId = selectedTenant?.id || "";

  const contactsQuery = useMemoFirebase(() => {
    if (!db || !tenantId) return null;
    return query(
      collection(db, "tenants", tenantId, "contacts"),
      orderBy("name", "asc")
    );
  }, [db, tenantId]);

  const { data: contacts, loading } = useCollection(contactsQuery);

  const filteredContacts = contacts?.filter((contact: any) => 
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.position?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Contactos</h1>
          <p className="text-slate-500 font-medium">Gestione las personas clave asociadas a sus cuentas comerciales.</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4" /> Nuevo Contacto
          </Button>
        </div>
      </div>

      <ContactDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      {/* Filters Bar */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Buscar por nombre, cargo o email..." 
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
              <TableHead className="w-[300px] font-bold text-slate-700">Nombre</TableHead>
              <TableHead className="font-bold text-slate-700">Cuenta</TableHead>
              <TableHead className="font-bold text-slate-700">Cargo / Posición</TableHead>
              <TableHead className="font-bold text-slate-700">Email & Tel</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-slate-500">Cargando contactos...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredContacts.length > 0 ? (
              filteredContacts.map((contact: any) => (
                <TableRow key={contact.id} className="hover:bg-slate-50/50 transition-colors border-slate-50 group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200 shadow-sm font-bold group-hover:bg-white group-hover:text-primary group-hover:border-primary/20 transition-all">
                        {contact.name?.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900 leading-tight">{contact.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary cursor-pointer transition-colors" onClick={() => contact.accountId && router.push(`/accounts/${contact.accountId}`)}>
                      <Building2 className="h-3 w-3 text-slate-400" />
                      {contact.accountId ? 'Cuenta Asociada' : '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <Briefcase className="h-3 w-3 text-slate-400" />
                      {contact.position || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Mail className="h-3 w-3 shrink-0" />
                        {contact.email || '-'}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Phone className="h-3 w-3 shrink-0" />
                        {contact.phone || '-'}
                      </div>
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
                        <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/contacts/${contact.id}`)}>
                          <Eye className="mr-2 h-4 w-4" /> Ver Detalle
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => contact.accountId && router.push(`/accounts/${contact.accountId}`)}>
                          <Building2 className="mr-2 h-4 w-4" /> Ir a Cuenta
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                           <Plus className="mr-2 h-4 w-4" /> Crear Oportunidad
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center p-8">
                    <Users className="h-12 w-12 text-slate-200 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">Sin contactos registrados</h3>
                    <p className="text-sm text-slate-500 max-w-xs mt-1">
                      {searchTerm ? 'Prueba con otros términos de búsqueda.' : 'Los contactos son personas reales detrás de tus cuentas. Agrega el primero.'}
                    </p>
                    {!searchTerm && <Button className="mt-6 gap-2" onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4" /> Nuevo Contacto</Button>}
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
