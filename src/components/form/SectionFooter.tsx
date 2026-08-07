import React, { ReactNode } from 'react';

interface SectionFooterProps {
  children: ReactNode;
}

export function SectionFooter({ children }: SectionFooterProps) {
  return <div className="mt-8 border-t pt-6">{children}</div>;
}
