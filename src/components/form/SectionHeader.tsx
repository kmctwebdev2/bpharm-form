import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="border-b pb-4 mb-6">
      <h3 className="text-xl font-semibold leading-none tracking-tight">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
    </div>
  );
}
