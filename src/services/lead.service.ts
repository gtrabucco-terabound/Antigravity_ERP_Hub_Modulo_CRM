import { collection, addDoc, getDocs, doc, getDoc, updateDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "@/firebase/client";
import { Lead } from "@/types/crm.types";
import { EventService } from "./event.service";

export const LeadService = {
  createLead: async (tenantId: string, leadData: Omit<Lead, "id" | "tenantId" | "createdAt" | "status">, createdBy: string) => {
    if (!tenantId) throw new Error("TenantId is required");
    
    // According to architecture, the path is tenants/{tenantId}/leads/{leadId}
    const leadsRef = collection(db, `tenants/${tenantId}/leads`);
    
    const newLead = {
      ...leadData,
      status: "NEW",
      createdAt: Date.now(),
      createdBy
    };

    const docRef = await addDoc(leadsRef, newLead);
    
    await EventService.dispatch({
      event: "LeadCreated",
      tenantId,
      entityId: docRef.id,
      timestamp: Date.now(),
      metadata: { source: newLead.source }
    });

    return { id: docRef.id, ...newLead } as Lead;
  },

  getLeads: async (tenantId: string): Promise<Lead[]> => {
    if (!tenantId) throw new Error("TenantId is required");
    
    const leadsRef = collection(db, `tenants/${tenantId}/leads`);
    const q = query(leadsRef, orderBy("createdAt", "desc"));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Lead));
  }
};
