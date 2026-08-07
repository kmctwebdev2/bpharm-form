import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ControlledDatePickerProps {
  name: string;
  label: string;
}

export function ControlledDatePicker({ name, label }: ControlledDatePickerProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col space-y-2 w-full">
          <Label htmlFor={name} className={error ? 'text-destructive' : ''}>
            {label}
          </Label>
          <Popover>
            {/* @ts-expect-error Shadcn Button typing issue */}
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full pl-3 text-left font-normal',
                  !field.value && 'text-muted-foreground',
                  error && 'border-destructive focus-visible:ring-destructive',
                )}
              >
                {field.value ? format(new Date(field.value), 'PPP') : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={field.onChange}
                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                // @ts-expect-error Shadcn Calendar typing issue
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {error && <p className="text-sm text-destructive">{error.message}</p>}
        </div>
      )}
    />
  );
}
