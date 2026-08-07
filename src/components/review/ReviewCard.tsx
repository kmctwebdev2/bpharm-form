import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';

interface ReviewCardProps {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
  emptyMessage?: string;
  isEmpty?: boolean;
}

export function ReviewCard({ title, onEdit, children, emptyMessage, isEmpty }: ReviewCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
        <CardTitle className="text-xl">{title}</CardTitle>
        <Button variant="outline" size="sm" onClick={onEdit} className="h-8">
          <Edit2 className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        {isEmpty ? (
          <p className="text-sm text-muted-foreground italic">
            {emptyMessage || 'No details provided.'}
          </p>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
