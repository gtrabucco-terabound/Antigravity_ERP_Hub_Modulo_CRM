import { collection, addDoc, getDocs, doc, getDoc, updateDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "@/firebase/client";
import { Account } from "@/types/crm.types";
import { EventService } from "./event.service";

export const AccountService = {
  createAccount: async (tenantId: string, accountData: Omit<Account, "id" | "tenantId" | "createdAt" | "status">) => {
    if (!tenantId) throw new Error("TenantId is required");
    
    const accountsRef = collection(db, `tenants/${tenantId}/accounts`);
    
    const newAccount = {
      ...accountData,
      status: "ACTIVE",
      createdAt: Date.now()
    };

    const docRef = await addDoc(accountsRef, newAccount);
    
    await EventService.dispatch({
      event: "AccountCreated",
      tenantId,
      entityId: docRef.id,
      timestamp: Date.now(),
      metadata: { industry: newAccount.industry }
    });

    return { id: docRef.id, ...newAccount } as Account;
  },

  getAccounts: async (tenantId: string): Promise<Account[]> => {
    if (!tenantId) throw new Error("TenantId is required");
    
    const accountsRef = collection(db, `tenants/${tenantId}/accounts`);
    const q = query(accountsRef, orderBy("createdAt", "desc"));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Account));
  }
};
