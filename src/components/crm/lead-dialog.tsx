"use client"

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useTenant } from "@/context/tenant-context";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Loader2, UserPlus } from "lucide-react";

interface LeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadDialog({ open, onOpenChange }: LeadDialogProps) {
  const { selectedTenant } = useTenant();
  const db = useFirestore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    source: "DIRECT",
    status: "NEW"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !selectedTenant) return;

    setLoading(true);
    try {
      const tenantId = selectedTenant.id;
      await addDoc(collection(db, "tenants", tenantId, "leads"), {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      onOpenChange(false);
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        source: "DIRECT",
        status: "NEW"
      });
    } catch (error) {
      console.error("Error creating lead:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-none shadow-2xl overflow-hidden p-0">
        <div className="h-2 bg-primary w-full"></div>
        <form onSubmit={handleSubmit}>
          <DialogHeader className="p-6 pb-2">
            <div className="flex items-center gap-2 mb-2">
               <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <UserPlus className="h-5 w-5" />
               </div>
               <DialogTitle className="text-xl font-black text-slate-900 tracking-tight italic">Nuevo Lead</DialogTitle>
            </div>
            <DialogDescription className="text-slate-500 font-medium italic">
              Complete los datos básicos para iniciar el seguimiento del prospecto.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre Completo</Label>
                <Input 
                  id="name" 
                  placeholder="Ej: Juan Perez" 
                  className="bg-slate-50 border-slate-100 italic"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Empresa / Organización</Label>
                <Input 
                  id="company" 
                  placeholder="Ej: Terabound S.A." 
                  className="bg-slate-50 border-slate-100 italic"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="correo@ejemplo.com" 
                  className="bg-slate-50 border-slate-100 italic"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teléfono</Label>
                <Input 
                  id="phone" 
                  placeholder="+54 9..." 
                  className="bg-slate-50 border-slate-100 italic"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fuente del Lead</Label>
              <Select 
                value={formData.source} 
                onValueChange={(val) => setFormData({...formData, source: val})}
              >
                <SelectTrigger className="bg-slate-50 border-slate-100 italic">
                  <SelectValue placeholder="Seleccione origen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DIRECT">Directo</SelectItem>
                  <SelectItem value="WEB">Sitio Web</SelectItem>
                  <SelectItem value="REFERRAL">Referido</SelectItem>
                  <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="bg-slate-50 p-6 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="font-bold text-slate-500">
               Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="gap-2 font-black italic shadow-lg shadow-primary/20">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              CREAR PROSPECTO
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
