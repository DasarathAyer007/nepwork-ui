import { Controller, useFormContext } from "react-hook-form";
import { Wallet, Clock } from "lucide-react";
import type { ServiceFormValues } from "../../serviceSchema";
import SkillsInput from "./SkillsInput";

const CURRENCIES = ["USD", "NPR", "INR", "EUR", "GBP"];

export default function StepPricingSkills() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<ServiceFormValues>();

  const priceType = watch("price_type");

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-md p-md md:p-lg shadow-sm space-y-lg">
      <div className="space-y-xs">
        <label className="font-headline-sm text-headline-sm block text-on-surface">
          Pricing type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {(
            [
              { value: "fixed", label: "Fixed Price", desc: "One price for the whole job.", Icon: Wallet },
              { value: "hourly", label: "Hourly Rate", desc: "Charge by the hour for ongoing work.", Icon: Clock },
            ] as const
          ).map(({ value, label, desc, Icon }) => (
            <label key={value} className="relative cursor-pointer group">
              <input
                {...register("price_type")}
                className="peer sr-only"
                type="radio"
                value={value}
              />
              <div className="h-full p-md border-2 border-outline-variant rounded-xl transition-all peer-checked:border-primary peer-checked:bg-primary/10 hover:border-primary/50 flex flex-col items-center text-center gap-xs">
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary mb-xs">
                  <Icon size={22} />
                </div>
                <span className="font-headline-sm text-headline-sm text-on-surface">{label}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">{desc}</span>
              </div>
            </label>
          ))}
        </div>
        {errors.price_type && (
          <p className="text-body-sm text-error">{errors.price_type.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-md items-start">
        <label className="block">
          <span className="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">
            {priceType === "HOURLY" ? "Hourly Rate" : "Fixed Price"}
          </span>
          <div className="relative flex items-center">
            <span className="absolute left-md font-headline-md text-on-surface-variant">$</span>
            <input
              {...register("price")}
              className="w-full pl-xl pr-md py-md rounded-lg border border-outline font-headline-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="0.00"
              type="number"
              step="0.01"
            />
          </div>
          {errors.price && (
            <p className="text-body-sm text-error mt-1">{errors.price.message}</p>
          )}
        </label>

        <label className="block">
          <span className="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">
            Currency
          </span>
          <select
            {...register("currency")}
            className="px-md py-md rounded-lg border border-outline-variant bg-surface-container-low font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

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
    </section>
  );
}