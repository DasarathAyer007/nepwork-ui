import { useState } from 'react';

import { selectUser } from '@/features/auth/authSelectors';
import ConfirmDialog from '@/features/dashboard/components/ConfirmDialog';
import ErrorState from '@/features/dashboard/components/ErrorState';
import EditableSection from '@/features/dashboard/components/manageJob/EditableSection';
import ServiceStatusBadge from '@/features/dashboard/components/myServices/ServiceStatusBadge';
import { getApiErrorMessage } from '@/features/dashboard/utils/getApiErrorMessage';
import CategorySelector from '@/features/services/components/create/CategorySelector';
import {
  useDeleteServiceMutation,
  useGetServiceDetailQuery,
  useUpdateServiceMutation,
} from '@/features/services/serviceApi';
import {
  ArrowLeft,
  ChevronDown,
  ShieldAlert,
  Trash2,
  Upload,
  Wrench,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';

import CategoryIcon from '@/components/CategoryIcon';
import SkillsInput from '@/components/SkillsInput';
import MapComponent from '@/components/map/MapComponent';
import NotFound from '@/components/ui/NotFound';
import { DropDown, Input, TextArea } from '@/components/ui/forms';

import { useAppSelector } from '@/hooks/useSelectore';

const PRICE_TYPE_OPTIONS = [
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'hourly', label: 'Hourly Rate' },
];

const AVAILABILITY_OPTIONS: { value: string; label: string }[] = [
  { value: 'available', label: 'Available' },
  { value: 'unavailable', label: 'Unavailable' },
  { value: 'break', label: 'On Break' },
  { value: 'holiday', label: 'Holiday' },
];

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'closed', label: 'Closed' },
];

const CURRENCY_OPTIONS = ['USD', 'NPR', 'INR', 'EUR', 'GBP'].map((c) => ({
  value: c,
  label: c,
}));

type PricingDraft = { priceType: string; price: string; currency: string };
type AvailableHoursDraft = { from: string; to: string };
type LocationDraft = {
  lat: number | null;
  lng: number | null;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  radiusKm: string;
};

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24">
      <div className="size-14 rounded-full bg-error/10 text-error flex items-center justify-center mb-4">
        <ShieldAlert size={26} />
      </div>
      <h1 className="text-headline-sm font-bold text-on-surface">
        You don't have access to this page
      </h1>
      <p className="text-body-md text-on-surface-variant mt-2 max-w-sm">
        Only the owner of this service can view and manage its details.
      </p>
      <Link
        to="/dashboard/services"
        className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg font-medium">
        <ArrowLeft size={16} />
        Back to My Services
      </Link>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 md:p-6 divide-y divide-outline-variant/40">
      {children}
    </div>
  );
}

export default function ManageServiceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectUser);

  const {
    data: service,
    isLoading,
    isError,
    refetch,
  } = useGetServiceDetailQuery(id ?? '', { skip: !id });
  const [updateService] = useUpdateServiceMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDangerZoneOpen, setIsDangerZoneOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-32 bg-surface-container-high rounded-lg" />
        <div className="h-64 bg-surface-container-high rounded-lg" />
        <div className="h-64 bg-surface-container-high rounded-lg" />
      </div>
    );
  }

  if (isError || !service) {
    return isError ? (
      <ErrorState
        message="We couldn't load this service. Please try again."
        onRetry={refetch}
      />
    ) : (
      <NotFound
        title="Service not found"
        message="The service you're looking for doesn't exist or has been removed."
        actionLabel="Back to My Services"
        actionTo="/dashboard/services"
      />
    );
  }

  if (currentUser && service.user.id !== currentUser.id) {
    return <AccessDenied />;
  }

  const runSave = async (
    sectionId: string,
    body: Record<string, unknown> | FormData,
    successLabel: string
  ) => {
    setSavingId(sectionId);
    setSaveError(null);
    try {
      await updateService({ id: service.id, body }).unwrap();
      toast.success(`${successLabel} updated`);
      setActiveSection(null);
    } catch (err) {
      setSaveError(getApiErrorMessage(err));
    } finally {
      setSavingId(null);
    }
  };

  const sectionError = (sectionId: string) =>
    activeSection === sectionId ? saveError : null;

  const handleDeleteConfirmed = async () => {
    try {
      await deleteService(service.id).unwrap();
      toast.success('Service deleted');
      navigate('/dashboard/services');
    } catch (err) {
      toast.error(
        getApiErrorMessage(
          err,
          "Couldn't delete this service. Please try again."
        )
      );
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/dashboard/services"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
          <ArrowLeft size={16} />
          Back to My Services
        </Link>
        <ServiceStatusBadge status={service.status} />
      </div>

      {/* Hero: thumbnail, title, category */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-6 pb-4">
          <EditableSection<File | null>
            id="thumbnail"
            label="Thumbnail"
            activeId={activeSection}
            onActivate={setActiveSection}
            onDeactivate={() => setActiveSection(null)}
            value={null}
            isSaving={savingId === 'thumbnail'}
            error={sectionError('thumbnail')}
            isEqual={(a) => a === null}
            onSave={(file) => {
              if (!file) return;
              const formData = new FormData();
              formData.append('thumbnail', file);
              return runSave('thumbnail', formData, 'Thumbnail');
            }}
            renderDisplay={() => (
              <div className="size-24 rounded-lg overflow-hidden bg-surface-container-high border border-outline-variant/50 flex items-center justify-center text-outline shrink-0">
                {service.thumbnail ? (
                  <img
                    src={service.thumbnail}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Wrench size={28} />
                )}
              </div>
            )}
            renderEditor={({ draft, setDraft }) => (
              <div className="w-40">
                {draft ? (
                  <div className="relative size-24 rounded-lg overflow-hidden border border-outline-variant/50">
                    <img
                      src={URL.createObjectURL(draft)}
                      alt="New thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setDraft(null)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-surface-container-lowest/90 text-on-surface hover:text-error transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-1.5 size-24 rounded-lg border-2 border-dashed border-outline-variant text-on-surface-variant hover:border-primary/50 hover:bg-surface-container cursor-pointer transition-colors">
                    <Upload size={18} />
                    <span className="text-[11px] font-medium">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setDraft(e.target.files?.[0] ?? null)}
                    />
                  </label>
                )}
              </div>
            )}
          />

          <div className="flex-1 min-w-0 space-y-1">
            <EditableSection<string>
              id="title"
              label="Service Title"
              activeId={activeSection}
              onActivate={setActiveSection}
              onDeactivate={() => setActiveSection(null)}
              value={service.title}
              isSaving={savingId === 'title'}
              error={sectionError('title')}
              onSave={(title) => runSave('title', { title }, 'Title')}
              renderDisplay={(value) => (
                <h1 className="text-headline-md font-bold text-on-surface">
                  {value}
                </h1>
              )}
              renderEditor={({ draft, setDraft }) => (
                <Input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="e.g., Home Deep Cleaning"
                />
              )}
            />
          </div>
        </div>

        <EditableSection<string>
          id="category"
          label="Category"
          activeId={activeSection}
          onActivate={setActiveSection}
          onDeactivate={() => setActiveSection(null)}
          value={service.category?.id ?? ''}
          isSaving={savingId === 'category'}
          error={sectionError('category')}
          onSave={(category) => runSave('category', { category }, 'Category')}
          renderDisplay={() => (
            <div className="flex items-center gap-2 text-body-md text-on-surface">
              {service.category ? (
                <>
                  <CategoryIcon
                    iconname={service.category.icon}
                    size={18}
                    color="currentColor"
                  />
                  <span>{service.category.name}</span>
                </>
              ) : (
                <span className="text-on-surface-variant">Not set</span>
              )}
            </div>
          )}
          renderEditor={({ draft, setDraft }) => (
            <CategorySelector value={draft} onChange={setDraft} />
          )}
        />

        <EditableSection<string>
          id="status"
          label="Status"
          activeId={activeSection}
          onActivate={setActiveSection}
          onDeactivate={() => setActiveSection(null)}
          value={service.status}
          isSaving={savingId === 'status'}
          error={sectionError('status')}
          onSave={(status) => runSave('status', { status }, 'Status')}
          renderDisplay={(value) => <ServiceStatusBadge status={value} />}
          renderEditor={({ draft, setDraft }) => (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDraft(opt.value)}
                  className={`px-3 py-2 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                    draft === opt.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-outline-variant text-on-surface hover:border-primary/40'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        />

        <EditableSection<string>
          id="availability_status"
          label="Availability"
          activeId={activeSection}
          onActivate={setActiveSection}
          onDeactivate={() => setActiveSection(null)}
          value={service.availability_status}
          isSaving={savingId === 'availability_status'}
          error={sectionError('availability_status')}
          onSave={(availability_status) =>
            runSave(
              'availability_status',
              { availability_status },
              'Availability'
            )
          }
          renderDisplay={(value) => (
            <p className="text-body-md text-on-surface capitalize">
              {AVAILABILITY_OPTIONS.find((o) => o.value === value)?.label ??
                value}
            </p>
          )}
          renderEditor={({ draft, setDraft }) => (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AVAILABILITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDraft(opt.value)}
                  className={`px-3 py-2 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                    draft === opt.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-outline-variant text-on-surface hover:border-primary/40'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        />
      </Card>

      {/* Description */}
      <Card>
        <EditableSection<string>
          id="description"
          label="Description"
          activeId={activeSection}
          onActivate={setActiveSection}
          onDeactivate={() => setActiveSection(null)}
          value={service.description}
          isSaving={savingId === 'description'}
          error={sectionError('description')}
          allowEnterToSave={false}
          onSave={(description) =>
            runSave('description', { description }, 'Description')
          }
          renderDisplay={(value) => (
            <p className="text-body-md text-on-surface-variant whitespace-pre-line">
              {value || 'No description added'}
            </p>
          )}
          renderEditor={({ draft, setDraft }) => (
            <TextArea
              autoFocus
              rows={6}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          )}
        />
      </Card>

      {/* Skills & pricing */}
      <Card>
        <EditableSection<string[]>
          id="skills"
          label="Skills & Tags"
          activeId={activeSection}
          onActivate={setActiveSection}
          onDeactivate={() => setActiveSection(null)}
          value={service.skills}
          isSaving={savingId === 'skills'}
          error={sectionError('skills')}
          onSave={(skills) => runSave('skills', { skills }, 'Skills')}
          renderDisplay={(value) => (
            <div className="flex flex-wrap gap-2">
              {value.length ? (
                value.map((skill) => (
                  <span
                    key={skill}
                    className="bg-surface-container-high text-on-surface-variant px-2.5 py-1 rounded-full text-label-md">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-body-md text-on-surface-variant">
                  No skills added
                </span>
              )}
            </div>
          )}
          renderEditor={({ draft, setDraft }) => (
            <SkillsInput value={draft} onChange={setDraft} />
          )}
        />

        <EditableSection<PricingDraft>
          id="pricing"
          label="Pricing"
          activeId={activeSection}
          onActivate={setActiveSection}
          onDeactivate={() => setActiveSection(null)}
          value={{
            priceType: service.price_type,
            price: service.price ?? '',
            currency: service.currency,
          }}
          isSaving={savingId === 'pricing'}
          error={sectionError('pricing')}
          onSave={(draft) => {
            if (draft.priceType === 'fixed' && !draft.price) {
              setSaveError('Price is required for a fixed-price service.');
              return;
            }
            return runSave(
              'pricing',
              {
                price_type: draft.priceType,
                price: draft.price ? Number(draft.price) : undefined,
                currency: draft.currency,
              },
              'Pricing'
            );
          }}
          renderDisplay={(value) => (
            <p className="text-body-md text-on-surface">
              {value.price
                ? `${value.currency} ${value.price}${value.priceType === 'hourly' ? '/hr' : ''}`
                : 'Not specified'}
            </p>
          )}
          renderEditor={({ draft, setDraft }) => (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <DropDown
                options={PRICE_TYPE_OPTIONS}
                value={draft.priceType}
                onChange={(e) =>
                  setDraft({ ...draft, priceType: e.target.value })
                }
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Price"
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: e.target.value })}
              />
              <DropDown
                options={CURRENCY_OPTIONS}
                value={draft.currency}
                onChange={(e) =>
                  setDraft({ ...draft, currency: e.target.value })
                }
              />
            </div>
          )}
        />

        <EditableSection<AvailableHoursDraft>
          id="available_hours"
          label="Available Hours"
          activeId={activeSection}
          onActivate={setActiveSection}
          onDeactivate={() => setActiveSection(null)}
          value={{
            from: service.available_from ?? '',
            to: service.available_to ?? '',
          }}
          isSaving={savingId === 'available_hours'}
          error={sectionError('available_hours')}
          onSave={(draft) =>
            runSave(
              'available_hours',
              {
                available_from: draft.from || null,
                available_to: draft.to || null,
              },
              'Available hours'
            )
          }
          renderDisplay={(value) => (
            <p className="text-body-md text-on-surface">
              {value.from && value.to
                ? `${value.from} – ${value.to}`
                : 'Not specified'}
            </p>
          )}
          renderEditor={({ draft, setDraft }) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                type="time"
                value={draft.from}
                onChange={(e) => setDraft({ ...draft, from: e.target.value })}
              />
              <Input
                type="time"
                value={draft.to}
                onChange={(e) => setDraft({ ...draft, to: e.target.value })}
              />
            </div>
          )}
        />
      </Card>

      {/* Location & radius */}
      <Card>
        <EditableSection<LocationDraft>
          id="location"
          label="Location & Service Radius"
          activeId={activeSection}
          onActivate={setActiveSection}
          onDeactivate={() => setActiveSection(null)}
          value={{
            lat: service.location?.point?.lat ?? null,
            lng: service.location?.point?.lng ?? null,
            address: service.location?.address ?? '',
            city: service.location?.city ?? '',
            state: service.location?.state ?? '',
            country: service.location?.country ?? '',
            postal_code: service.location?.postal_code ?? '',
            radiusKm:
              service.radius_km != null ? String(service.radius_km) : '',
          }}
          isSaving={savingId === 'location'}
          error={sectionError('location')}
          onSave={(draft) =>
            runSave(
              'location',
              {
                location: {
                  lat: draft.lat,
                  lng: draft.lng,
                  address: draft.address,
                  city: draft.city,
                  state: draft.state,
                  country: draft.country,
                  postal_code: draft.postal_code,
                },
                radius_km: draft.radiusKm ? Number(draft.radiusKm) : undefined,
              },
              'Location'
            )
          }
          renderDisplay={(value) => (
            <div className="space-y-3">
              {value.lat != null && value.lng != null && (
                <MapComponent
                  latitude={value.lat}
                  longitude={value.lng}
                  radiusKm={value.radiusKm ? Number(value.radiusKm) : null}
                  height={180}
                  showExpandButton
                  enableRouting={false}
                  interactive={false}
                />
              )}
              <p className="text-body-md text-on-surface-variant">
                {[value.address, value.city, value.state, value.country]
                  .filter(Boolean)
                  .join(', ') || 'Remote / not specified'}
                {value.radiusKm && ` · ${value.radiusKm} km radius`}
              </p>
            </div>
          )}
          renderEditor={({ draft, setDraft }) => (
            <div className="space-y-4">
              <MapComponent
                latitude={draft.lat}
                longitude={draft.lng}
                radiusKm={draft.radiusKm ? Number(draft.radiusKm) : null}
                onSelect={(lat, lng) =>
                  setDraft({
                    ...draft,
                    lat: Number(lat.toFixed(6)),
                    lng: Number(lng.toFixed(6)),
                  })
                }
                height={220}
                showExpandButton
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  placeholder="Address"
                  value={draft.address}
                  onChange={(e) =>
                    setDraft({ ...draft, address: e.target.value })
                  }
                />
                <Input
                  placeholder="City"
                  value={draft.city}
                  onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                />
                <Input
                  placeholder="State / Province"
                  value={draft.state}
                  onChange={(e) =>
                    setDraft({ ...draft, state: e.target.value })
                  }
                />
                <Input
                  placeholder="Country"
                  value={draft.country}
                  onChange={(e) =>
                    setDraft({ ...draft, country: e.target.value })
                  }
                />
                <Input
                  placeholder="Postal Code"
                  value={draft.postal_code}
                  onChange={(e) =>
                    setDraft({ ...draft, postal_code: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-on-surface shrink-0">
                  Radius
                </span>
                <input
                  type="range"
                  min={1}
                  max={200}
                  value={draft.radiusKm || 10}
                  onChange={(e) =>
                    setDraft({ ...draft, radiusKm: e.target.value })
                  }
                  className="flex-1 accent-primary"
                />
                <Input
                  type="number"
                  min={1}
                  max={200}
                  value={draft.radiusKm}
                  onChange={(e) =>
                    setDraft({ ...draft, radiusKm: e.target.value })
                  }
                  className="w-20 text-center shrink-0"
                />
                <span className="text-sm text-on-surface-variant shrink-0">
                  km
                </span>
              </div>
            </div>
          )}
        />
      </Card>

      {/* Danger zone */}
      <div className="border border-error/30 bg-error/5 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setIsDangerZoneOpen((prev) => !prev)}
          className="w-full flex items-center justify-between gap-4 p-5 md:p-6 cursor-pointer">
          <h3 className="text-title-md font-bold text-on-surface">
            Delete this service
          </h3>
          <ChevronDown
            size={20}
            className={`text-error shrink-0 transition-transform duration-300 ${
              isDangerZoneOpen ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </button>

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isDangerZoneOpen
              ? 'grid-rows-[1fr] opacity-100'
              : 'grid-rows-[0fr] opacity-0'
          }`}>
          <div className="overflow-hidden">
            <div className="px-5 md:px-6 pb-5 md:pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-body-md text-on-surface-variant">
                Once deleted, this service listing will be removed and clients
                will no longer be able to request it. This action cannot be
                undone.
              </p>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center justify-center gap-2 shrink-0 px-4 py-2.5 border border-error text-error rounded-lg font-medium hover:bg-error/10 transition-all cursor-pointer">
                <Trash2 size={16} />
                Delete Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete this service listing?"
          description={`"${service.title}" will be permanently removed and clients will no longer be able to view or request it. This action cannot be undone.`}
          confirmLabel="Delete Service"
          isConfirming={isDeleting}
          onConfirm={() => void handleDeleteConfirmed()}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
