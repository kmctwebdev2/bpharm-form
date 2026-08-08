import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
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
        <div className="space-y-2 w-full">
          <Label
            htmlFor={name}
            className={error ? 'text-destructive' : 'text-sm font-medium text-foreground'}
          >
            {label.includes('*') ? (
              <>
                {label.split('*')[0]} <span className="text-destructive">*</span>
                {label.split('*')[1] && (
                  <span className="block text-xs font-normal text-muted-foreground mt-1">
                    {label.split('*')[1]}
                  </span>
                )}
              </>
            ) : (
              label
            )}
          </Label>
          <Popover>
            <PopoverTrigger
              className={cn(
                "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                'border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
                'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
                'w-full pl-3 text-left font-normal h-9',
                !field.value && 'text-muted-foreground',
                error && 'border-destructive focus-visible:ring-destructive',
              )}
            >
              {field.value ? format(new Date(field.value), 'PPP') : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={field.onChange}
                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                captionLayout="dropdown"
                startMonth={new Date(1900, 0)}
                endMonth={new Date()}
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
