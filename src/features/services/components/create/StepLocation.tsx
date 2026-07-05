import { Controller, useFormContext } from "react-hook-form";
import type { ServiceFormValues } from "../../serviceSchema";
import LocationPicker from "./LocationPicker";
import LocationMapDialog from "./LocationMapDialog";

export default function StepLocation() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ServiceFormValues>();

  const latitude = watch("location.latitude");
  const longitude = watch("location.longitude");
  const radiusKm = watch("radius_km");

  function handleMapSelect(lat: number, lng: number) {
    setValue("location.latitude", Number(lat.toFixed(6)), { shouldValidate: true });
    setValue("location.longitude", Number(lng.toFixed(6)), { shouldValidate: true });
  }

  return (
    <div className="space-y-md">
      <section className="bg-surface-container-lowest p-md md:p-lg rounded-lg border border-outline-variant shadow-sm">
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">
          Where do you offer this service?
        </h2>

        <div className="relative">
          <LocationPicker
            latitude={latitude}
            longitude={longitude}
            radiusKm={radiusKm}
            onSelect={handleMapSelect}
            height={280}
          />
          <LocationMapDialog
            latitude={latitude}
            longitude={longitude}
            radiusKm={radiusKm}
            onSelect={handleMapSelect}
          />
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
          Click on the map to drop a marker, or expand it for a bigger view.
        </p>
        {errors.location?.latitude && (
          <p className="text-body-sm text-error mt-1">
            {errors.location.latitude.message}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md mt-md">
          <label className="block">
            <span className="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">
              Latitude
            </span>
            <input
              value={latitude ?? ""}
              readOnly
              placeholder="Select on map"
              className="w-full px-md py-sm rounded-lg border border-outline-variant bg-surface-container-high font-body-md text-on-surface-variant"
            />
          </label>
          <label className="block">
            <span className="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">
              Longitude
            </span>
            <input
              value={longitude ?? ""}
              readOnly
              placeholder="Select on map"
              className="w-full px-md py-sm rounded-lg border border-outline-variant bg-surface-container-high font-body-md text-on-surface-variant"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md mt-md">
          <label className="block">
            <span className="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">
              City
            </span>
            <input
              {...register("location.city")}
              className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md bg-surface-container-low"
              placeholder="e.g., Nepalgunj"
            />
          </label>
          <label className="block">
            <span className="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">
              State / Province
            </span>
            <input
              {...register("location.state")}
              className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md bg-surface-container-low"
              placeholder="e.g., Lumbini"
            />
          </label>
          <label className="block">
            <span className="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">
              Country
            </span>
            <input
              {...register("location.country")}
              className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md bg-surface-container-low"
              placeholder="e.g., Nepal"
            />
          </label>
          <label className="block">
            <span className="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">
              Postal Code
            </span>
            <input
              {...register("location.postal_code")}
              className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md bg-surface-container-low"
              placeholder="e.g., 21900"
            />
          </label>
        </div>
      </section>

      <section className="bg-surface-container-lowest p-md md:p-lg rounded-lg border border-outline-variant shadow-sm">
        <div className="flex items-center justify-between mb-xs">
          <label className="font-headline-sm text-headline-sm text-on-surface">
            Service radius
          </label>
          <span className="font-body-md font-medium text-primary">{radiusKm} km</span>
        </div>
        <Controller
          control={control}
          name="radius_km"
          render={({ field }) => (
            <div className="flex items-center gap-md">
              <input
                type="range"
                min={1}
                max={200}
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="flex-1 accent-[color:var(--color-primary)]"
              />
              <input
                type="number"
                min={1}
                max={200}
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="w-20 px-sm py-sm rounded-lg border border-outline-variant text-center font-body-md bg-surface-container-low"
              />
            </div>
          )}
        />
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
          Clients within this distance from your pin can find and book this service.
        </p>
        {errors.radius_km && (
          <p className="text-body-sm text-error mt-1">{errors.radius_km.message}</p>
        )}
      </section>

      <section className="bg-surface-container-lowest p-md md:p-lg rounded-lg border border-outline-variant shadow-sm">
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">
          Available hours (optional)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <label className="block">
            <span className="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">
              Available From
            </span>
            <input
              {...register("available_from")}
              type="time"
              className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md bg-surface-container-low"
            />
          </label>
          <label className="block">
            <span className="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">
              Available To
            </span>
            <input
              {...register("available_to")}
              type="time"
              className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md bg-surface-container-low"
            />
          </label>
        </div>
      </section>

      <section className="bg-surface-container-lowest p-md md:p-lg rounded-lg border border-outline-variant shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Status</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Active services are visible to clients right away.
          </p>
        </div>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <button
              type="button"
              onClick={() => field.onChange(field.value === "active" ? "inactive" : "active")}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                field.value === "active" ? "bg-primary" : "bg-surface-container-highest"
              }`}
              aria-pressed={field.value === "active"}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-surface-container-lowest shadow-md transition-transform ${
                  field.value === "active" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          )}
        />
      </section>
    </div>
  );
}