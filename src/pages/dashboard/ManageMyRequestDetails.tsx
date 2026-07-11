import { useState } from 'react';

import { selectUser } from '@/features/auth/authSelectors';
import ConfirmDialog from '@/features/dashboard/components/ConfirmDialog';
import ErrorState from '@/features/dashboard/components/ErrorState';
import ServiceRequestStatusBadge from '@/features/dashboard/components/serviceRequests/ServiceRequestStatusBadge';
import { getApiErrorMessage } from '@/features/dashboard/utils/getApiErrorMessage';
import {
  useCancelServiceRequestMutation,
  useDeleteServiceRequestMutation,
  useGetServiceRequestDetailQuery,
} from '@/features/services/serviceApi';
import {
  AlertTriangle,
  ArrowLeft,
  ShieldAlert,
  Trash2,
  User,
  Wrench,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useAppSelector } from '@/hooks/useSelectore';

const NON_CANCELLABLE_STATUSES = new Set([
  'in_progress',
  'completed',
  'rejected',
  'cancelled',
]);

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24">
      <div className="size-14 rounded-full bg-error/10 text-error flex items-center justify-center mb-4">
        <AlertTriangle size={26} />
      </div>
      <h1 className="text-headline-sm font-bold text-on-surface">
        Request not found
      </h1>
      <p className="text-body-md text-on-surface-variant mt-2">
        This request doesn't exist or has been removed.
      </p>
      <Link
        to="/dashboard/my-requests"
        className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg font-medium">
        <ArrowLeft size={16} />
        Back to My Requests
      </Link>
    </div>
  );
}

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
        Only the person who sent this request can view it here.
      </p>
      <Link
        to="/dashboard/my-requests"
        className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg font-medium">
        <ArrowLeft size={16} />
        Back to My Requests
      </Link>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 md:p-6 space-y-4">
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-label-md font-semibold uppercase tracking-wide text-on-surface-variant">
        {label}
      </h4>
      <div className="mt-1 text-body-md text-on-surface">{value}</div>
    </div>
  );
}

export default function ManageMyRequestDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectUser);

  const {
    data: request,
    isLoading,
    isError,
    refetch,
  } = useGetServiceRequestDetailQuery(id ?? '', { skip: !id });
  const [cancelRequest, { isLoading: isCancelling }] =
    useCancelServiceRequestMutation();
  const [deleteRequest, { isLoading: isDeleting }] =
    useDeleteServiceRequestMutation();

  const [confirmAction, setConfirmAction] = useState<
    'cancel' | 'delete' | null
  >(null);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-32 bg-surface-container-high rounded-lg" />
        <div className="h-48 bg-surface-container-high rounded-lg" />
      </div>
    );
  }

  if (isError || !request) {
    return isError ? (
      <ErrorState
        message="We couldn't load this request. Please try again."
        onRetry={refetch}
      />
    ) : (
      <NotFound />
    );
  }

  if (currentUser && request.user.id !== currentUser.id) {
    return <AccessDenied />;
  }

  const canCancel = !NON_CANCELLABLE_STATUSES.has(request.status);

  const handleCancel = async () => {
    try {
      await cancelRequest(request.id).unwrap();
      toast.success('Request cancelled');
      setConfirmAction(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't cancel this request."));
      setConfirmAction(null);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRequest(request.id).unwrap();
      toast.success('Request deleted');
      navigate('/dashboard/my-requests');
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't delete this request."));
      setConfirmAction(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/dashboard/my-requests"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
          <ArrowLeft size={16} />
          Back to My Requests
        </Link>
        <ServiceRequestStatusBadge status={request.status} />
      </div>

      {/* Service info */}
      <Card>
        <Link
          to={`/services/${request.service.id}`}
          className="flex items-center gap-4 group">
          <div className="size-16 rounded-lg overflow-hidden shrink-0 bg-surface-container-high flex items-center justify-center text-outline">
            {request.service.thumbnail ? (
              <img
                src={request.service.thumbnail}
                alt={request.service.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Wrench size={24} />
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">
              {request.service.title}
            </h1>
            <p className="text-body-sm text-on-surface-variant mt-0.5">
              View service listing
            </p>
          </div>
        </Link>
      </Card>

      {/* Provider info */}
      <Card>
        <div className="flex items-center gap-3">
          {request.service.user.profile_picture ? (
            <img
              src={request.service.user.profile_picture}
              alt={request.service.user.username}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <div className="size-10 rounded-full bg-surface-container-high flex items-center justify-center text-outline">
              <User size={18} />
            </div>
          )}
          <div>
            <p className="text-body-md font-semibold text-on-surface">
              {request.service.user.full_name || request.service.user.username}
            </p>
            <p className="text-body-sm text-on-surface-variant">
              Service provider
            </p>
          </div>
        </div>
      </Card>

      {/* Request details */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Requested On"
            value={new Date(request.created_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          />
          <Field
            label="Priority"
            value={<span className="capitalize">{request.priority}</span>}
          />
          <Field
            label="Budget"
            value={
              request.budget
                ? `${request.currency} ${request.budget}`
                : 'Not specified'
            }
          />
          <Field
            label="Negotiable"
            value={request.is_negotiable ? 'Yes' : 'No'}
          />
          <Field
            label="Preferred Date"
            value={
              request.preferred_date
                ? new Date(request.preferred_date).toLocaleDateString()
                : 'Not specified'
            }
          />
          <Field
            label="Estimated Duration"
            value={
              request.estimated_duration_hours != null
                ? `${request.estimated_duration_hours} hours`
                : 'Not specified'
            }
          />
        </div>

        <div className="border-t border-outline-variant/40 pt-4">
          <Field
            label="Your Message"
            value={
              request.request_message ? (
                <p className="whitespace-pre-line text-on-surface-variant">
                  {request.request_message}
                </p>
              ) : (
                'No message added'
              )
            }
          />
        </div>

        {request.response_message && (
          <div className="border-t border-outline-variant/40 pt-4">
            <Field
              label="Provider Response"
              value={
                <p className="whitespace-pre-line text-on-surface-variant">
                  {request.response_message}
                </p>
              }
            />
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="border border-outline-variant bg-surface-container-lowest rounded-lg p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-body-md text-on-surface-variant max-w-lg">
          {canCancel
            ? 'You can cancel this request until the provider starts working on it, or remove it entirely.'
            : 'This request is already in progress or completed and can no longer be cancelled — but you can still remove it from your list.'}
        </p>
        <div className="flex items-center gap-2 shrink-0">
          {canCancel && (
            <button
              type="button"
              onClick={() => setConfirmAction('cancel')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-outline-variant text-on-surface rounded-lg font-medium hover:bg-surface-container transition-all cursor-pointer">
              <XCircle size={16} />
              Cancel Request
            </button>
          )}
          <button
            type="button"
            onClick={() => setConfirmAction('delete')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-error text-error rounded-lg font-medium hover:bg-error/10 transition-all cursor-pointer">
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {confirmAction === 'cancel' && (
        <ConfirmDialog
          title="Cancel this request?"
          description={`Your request for "${request.service.title}" will be cancelled and the provider notified. This cannot be undone.`}
          confirmLabel="Cancel Request"
          isConfirming={isCancelling}
          onConfirm={() => void handleCancel()}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {confirmAction === 'delete' && (
        <ConfirmDialog
          title="Delete this request?"
          description={`Your request for "${request.service.title}" will be permanently removed from your requests. This action cannot be undone.`}
          confirmLabel="Delete Request"
          isConfirming={isDeleting}
          onConfirm={() => void handleDelete()}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}
