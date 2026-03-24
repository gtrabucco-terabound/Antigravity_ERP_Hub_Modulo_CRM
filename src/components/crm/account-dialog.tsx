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
import { useTenant } from "@/context/tenant-context";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Loader2, Building2 } from "lucide-react";

interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountDialog({ open, onOpenChange }: AccountDialogProps) {
  const { selectedTenant } = useTenant();
  const db = useFirestore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    country: "",
    website: "",
    status: "ACTIVE"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !selectedTenant) return;

    setLoading(true);
    try {
      const tenantId = selectedTenant.id;
      await addDoc(collection(db, "tenants", tenantId, "accounts"), {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      onOpenChange(false);
      setFormData({
        name: "",
        industry: "",
        country: "",
        website: "",
        status: "ACTIVE"
      });
    } catch (error) {
      console.error("Error creating account:", error);
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
                  <Building2 className="h-5 w-5" />
               </div>
               <DialogTitle className="text-xl font-black text-slate-900 tracking-tight italic">Nueva Cuenta</DialogTitle>
            </div>
            <DialogDescription className="text-slate-500 font-medium italic">
              Registre una nueva organización o cliente comercial.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre de la Organización</Label>
              <Input 
                id="name" 
                placeholder="Ej: Global Tech Solutions" 
                className="bg-slate-50 border-slate-100 italic h-11"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Industria / Sector</Label>
                <Input 
                  id="industry" 
                  placeholder="Ej: Software" 
                  className="bg-slate-50 border-slate-100 italic"
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">País</Label>
                <Input 
                  id="country" 
                  placeholder="Ej: Argentina" 
                  className="bg-slate-50 border-slate-100 italic"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sitio Web (URL)</Label>
              <Input 
                id="website" 
                placeholder="https://..." 
                className="bg-slate-50 border-slate-100 italic"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter className="bg-slate-50 p-6 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="font-bold text-slate-500">
               Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="gap-2 font-black italic shadow-lg shadow-primary/20 bg-slate-900 hover:bg-slate-800">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              REGISTRAR CUENTA
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
