'use client';

import { createContext, useContext } from 'react';

/**
 * Whether the invitation around a section is Sealed.
 *
 * Sealed is how a guest is sent an invitation: the envelope closed, and nothing
 * below it reached until they open it. It is one property of the template
 * rather than a second copy of it, because it is the only thing separating the
 * invitation a guest opens from the Site Preview beside the form.
 *
 * A section reads it here rather than being handed it, because the sections
 * that care are several levels down and the ones in between have no opinion.
 * `WeddingTemplate1` is the only thing that sets it.
 */
const SealedContext = createContext(false);

export function SealedProvider({
  sealed,
  children,
}: {
  sealed: boolean;
  children: React.ReactNode;
}) {
  return (
    <SealedContext.Provider value={sealed}>{children}</SealedContext.Provider>
  );
}

export function useSealed() {
  return useContext(SealedContext);
}
