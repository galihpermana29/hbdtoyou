'use client';

import { createContext, useContext } from 'react';

/**
 * Published recipient experience: envelope gate, body scroll-lock, scroll-reveal.
 * Off for the creator live preview, sample viewer, and marketing pages.
 */
const WeddingTemplate1RecipientContext = createContext(false);

export function WeddingTemplate1RecipientProvider({
  recipientMode,
  children,
}: {
  recipientMode: boolean;
  children: React.ReactNode;
}) {
  return (
    <WeddingTemplate1RecipientContext.Provider value={recipientMode}>
      {children}
    </WeddingTemplate1RecipientContext.Provider>
  );
}

export function useWeddingTemplate1RecipientMode() {
  return useContext(WeddingTemplate1RecipientContext);
}
