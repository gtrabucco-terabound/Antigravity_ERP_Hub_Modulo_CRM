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
import { Loader2, Target } from "lucide-react";

interface OpportunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId?: string;
}

export function OpportunityDialog({ open, onOpenChange, accountId }: OpportunityDialogProps) {
  const { selectedTenant } = useTenant();
  const db = useFirestore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    value: 0,
    probability: 10,
    stage: "PROSPECTING",
    expectedCloseDate: "",
    accountId: accountId || ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !selectedTenant) return;

    setLoading(true);
    try {
      const tenantId = selectedTenant.id;
      await addDoc(collection(db, "tenants", tenantId, "opportunities"), {
        ...formData,
        value: Number(formData.value),
        probability: Number(formData.probability),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      onOpenChange(false);
      setFormData({
        title: "",
        value: 0,
        probability: 10,
        stage: "PROSPECTING",
        expectedCloseDate: "",
        accountId: accountId || ""
      });
    } catch (error) {
      console.error("Error creating opportunity:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-none shadow-2xl overflow-hidden p-0">
        <div className="h-2 bg-slate-900 w-full text-white"></div>
        <form onSubmit={handleSubmit}>
          <DialogHeader className="p-6 pb-2">
            <div className="flex items-center gap-2 mb-2">
               <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
                  <Target className="h-5 w-5" />
               </div>
               <DialogTitle className="text-xl font-black text-slate-900 tracking-tight italic">Nueva Oportunidad</DialogTitle>
            </div>
            <DialogDescription className="text-slate-500 font-medium italic">
              Registre un nuevo negocio potencial en su pipeline.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Título de la Oportunidad</Label>
              <Input 
                id="title" 
                placeholder="Ej: Renovación Licencias 2026" 
                className="bg-slate-50 border-slate-100 italic"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Estimado (USD)</Label>
                <Input 
                  id="value" 
                  type="number" 
                  className="bg-slate-50 border-slate-100 italic font-bold"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cierre Estimado</Label>
                <Input 
                  id="date" 
                  type="date"
                  className="bg-slate-50 border-slate-100 italic"
                  value={formData.expectedCloseDate}
                  onChange={(e) => setFormData({...formData, expectedCloseDate: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Etapa Initial</Label>
                <Select 
                  value={formData.stage} 
                  onValueChange={(val) => setFormData({...formData, stage: val})}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-100 italic">
                    <SelectValue placeholder="Seleccione etapa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PROSPECTING">Prospección</SelectItem>
                    <SelectItem value="QUALIFIED">Calificado</SelectItem>
                    <SelectItem value="PROPOSAL">Propuesta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prob" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Probabilidad (%)</Label>
                <Input 
                  id="prob" 
                  type="number" 
                  max="100"
                  min="0"
                  className="bg-slate-50 border-slate-100 italic font-bold"
                  value={formData.probability}
                  onChange={(e) => setFormData({...formData, probability: Number(e.target.value)})}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="bg-slate-50 p-6 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="font-bold text-slate-500">
               Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="gap-2 font-black italic shadow-lg shadow-black/10 bg-slate-900 hover:bg-slate-800">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              INICIAR OPORTUNIDAD
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
