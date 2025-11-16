
'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Country,
  E164Number,
  formatIncompletePhoneNumber,
  getCountryCallingCode,
  parsePhoneNumber,
} from 'libphonenumber-js';
import RPNInput, {
  type CountryProps,
  type PhoneInputProps as RPNInputProps,
} from 'react-phone-number-input/react-hook-form';
import 'react-phone-number-input/style.css';
import Flag from 'react-phone-number-input/flags';
import { cn } from '@/lib/utils';
import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import { Input, type InputProps } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { ScrollArea } from './scroll-area';
import { Control, FieldValues, Path, PathValue } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';

type PhoneInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
> = Omit<React.ComponentPropsWithoutRef<'input'>, 'onChange' | 'value'> & {
  control: Control<TFieldValues>;
  name: TName;
  defaultValue?: PathValue<TFieldValues, TName>;
  label?: string;
  description?: string;
};

const PhoneInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>({
  name,
  control,
  label,
  description,
  ...props
}: PhoneInputProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <RPNInput
              name={field.name}
              control={control}
              inputComponent={InputComponent}
              countrySelectComponent={CountrySelector}
              rules={{
                validate: (value) => {
                  if (!value) return true;
                  const phoneNumber = parsePhoneNumber(value);
                  return !!phoneNumber?.isValid();
                },
              }}
              {...props}
              className={cn(
                'flex',
                error && 'rounded-md border border-destructive'
              )}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};


const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      className={cn("rounded-none rounded-r-lg border-l-0", className)}
      {...props}
      ref={ref}
    />
  )
);
InputComponent.displayName = "InputComponent";


const CountrySelector = ({
  disabled,
  value,
  onChange,
  options,
}: CountryProps) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (country: Country) => {
    onChange(country);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={'outline'}
          className={cn('flex gap-1 rounded-r-none pl-3 pr-1')}
          disabled={disabled}
        >
          <Flag country={value} countryName={value} />
          <ChevronsUpDown
            className={cn(
              '-mr-2 h-4 w-4 opacity-50',
              disabled ? 'hidden' : 'opacity-100'
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <ScrollArea className="h-52">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {options
                  .filter((option) => option.value)
                  .map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleSelect(option.value as Country)}
                      value={`${option.label} +${getCountryCallingCode(option.value as Country)}`}
                      className="flex items-center gap-2"
                    >
                      <Flag country={option.value as Country} countryName={option.label} />
                      <span className="flex-1">{option.label}</span>
                      <span>+{getCountryCallingCode(option.value as Country)}</span>
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          value === option.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};


export { PhoneInput };
