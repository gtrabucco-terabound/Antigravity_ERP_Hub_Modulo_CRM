import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/client";

export type CRMEventType = 
  | "LeadCreated" 
  | "OpportunityCreated" 
  | "QuoteGenerated" 
  | "ContractSigned" 
  | "ServiceRequestCreated" 
  | "CustomerWorkOrderCreated"
  | "AccountCreated";

export interface EventPayload {
  event: CRMEventType;
  tenantId: string;
  entityId: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export const EventService = {
  dispatch: async (payload: EventPayload) => {
    try {
      if (!payload.tenantId) throw new Error("TenantId is required for events");
      
      // Events can be logged per tenant or globally. 
      // Following multi-tenant strictly, we log them in the tenant's space.
      const eventsRef = collection(db, `tenants/${payload.tenantId}/events`);
      
      await addDoc(eventsRef, {
        ...payload,
        serverTime: serverTimestamp()
      });
      
      console.log(`[Event Dispatched] ${payload.event} for entity ${payload.entityId}`);
    } catch (error) {
      console.error(`Failed to dispatch event ${payload.event}:`, error);
    }
  }
};
