'use client';

import { usePathname } from 'next/navigation';

// The marketing chrome (navbar, footer, floating WhatsApp button) wraps every public page but
// must stay off the ops console, which is an internal tool with its own header and no marketing
// surface. Chrome is passed in as rendered props so Footer/Whatsapp remain server components —
// only this route check runs on the client.
export default function SiteChrome({ navbar, footer, whatsapp, children }) {
  const pathname = usePathname();

  if (pathname?.startsWith('/ops')) return <>{children}</>;

  return (
    <>
      {navbar}
      <main>{children}</main>
      {footer}
      {whatsapp}
    </>
  );
}
