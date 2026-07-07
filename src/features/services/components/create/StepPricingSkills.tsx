import { Clock, Wallet } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';

import type { ServiceFormValues } from '../../serviceSchema';
import SkillsInput from '@/components/SkillsInput';
import { Label, Input, DropDown, FormSection } from '@/components/ui/forms';

const CURRENCIES = ['USD', 'NPR', 'INR', 'EUR', 'GBP'];

export default function StepPricingSkills() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<ServiceFormValues>();

  const priceType = watch('price_type');

  return (
    <div className="space-y-6">
      {/* Pricing Form Section */}
      <FormSection title="Pricing Model" description="Select how you want to bill your clients: fixed-price or hourly rates.">
        <div className="space-y-4">
          <Label>Pricing Type</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(
              [
                {
                  value: 'fixed',
                  label: 'Fixed Price',
                  desc: 'One price for the whole job.',
                  Icon: Wallet,
                },
                {
                  value: 'hourly',
                  label: 'Hourly Rate',
                  desc: 'Charge by the hour for ongoing work.',
                  Icon: Clock,
                },
              ] as const
            ).map(({ value, label, desc, Icon }) => (
              <label key={value} className="relative cursor-pointer group flex">
                <input
                  {...register('price_type')}
                  className="peer sr-only"
                  type="radio"
                  value={value}
                />
                <div className="w-full p-5 border-2 border-outline-variant/50 rounded-xl transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:border-primary/40 flex flex-col items-center text-center gap-2 group-hover:shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <Icon size={20} />
                  </div>
                  <span className="font-semibold text-sm text-on-surface">
                    {label}
                  </span>
                  <span className="text-xs text-on-surface-variant leading-relaxed">
                    {desc}
                  </span>
                </div>
              </label>
            ))}
          </div>
          {errors.price_type && (
            <p className="text-xs text-error font-medium">{errors.price_type.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-outline-variant/20">
          <div className="md:col-span-3 space-y-2">
            <Label>
              {priceType === 'hourly' ? 'Hourly Rate' : 'Fixed Price'}
            </Label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-sm font-semibold text-on-surface-variant">
                $
              </span>
              <Input
                {...register('price')}
                placeholder="0.00"
                type="number"
                step="0.01"
                className="pl-8"
              />
            </div>
            {errors.price && (
              <p className="text-xs text-error font-medium mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          <div className="md:col-span-1 space-y-2">
            <Label>Currency</Label>
            <DropDown
              {...register('currency')}
              options={CURRENCIES.map((c) => ({ label: c, value: c }))}
            />
          </div>
        </div>
      </FormSection>

      {/* Skills Form Section */}
      <FormSection title="Skills &amp; tags" description="Add up to 10 tags representing what this service covers.">
        <Controller
          control={control}
          name="skills"
          render={({ field }) => (
            <SkillsInput
              value={field.value}
              onChange={field.onChange}
              error={errors.skills?.message as string | undefined}
            />
          )}
        />
      </FormSection>
    </div>
  );
}
