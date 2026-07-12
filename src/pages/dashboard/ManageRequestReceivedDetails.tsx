import { useState } from 'react';

import { selectUser } from '@/features/auth/authSelectors';
import ConfirmDialog from '@/features/dashboard/components/ConfirmDialog';
import ErrorState from '@/features/dashboard/components/ErrorState';
import ServiceRequestStatusBadge from '@/features/dashboard/components/serviceRequests/ServiceRequestStatusBadge';
import { getApiErrorMessage } from '@/features/dashboard/utils/getApiErrorMessage';
import {
  useAcceptServiceRequestMutation,
  useGetServiceRequestDetailQuery,
  useRejectServiceRequestMutation,
} from '@/features/services/serviceApi';
import {
  ArrowLeft,
  Check,
  ShieldAlert,
  User,
  Wrench,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';

import NotFound from '@/components/ui/NotFound';

import { useAppSelector } from '@/hooks/useSelectore';

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
        Only the owner of this service can view requests sent to it.
      </p>
      <Link
        to="/dashboard/requests-received"
        className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg font-medium">
        <ArrowLeft size={16} />
        Back to Requests Received
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

export default function ManageRequestReceivedDetails() {
  const { id } = useParams<{ id: string }>();
  const currentUser = useAppSelector(selectUser);

  const {
    data: request,
    isLoading,
    isError,
    refetch,
  } = useGetServiceRequestDetailQuery(id ?? '', { skip: !id });
  const [acceptRequest, { isLoading: isAccepting }] =
    useAcceptServiceRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] =
    useRejectServiceRequestMutation();

  const [confirmAction, setConfirmAction] = useState<
    'accept' | 'reject' | null
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
      <NotFound
        title="Request not found"
        message="This request doesn't exist or has been removed."
        actionLabel="Back to Requests Received"
        actionTo="/dashboard/requests-received"
      />
    );
  }

  if (currentUser && request.service.user.id !== currentUser.id) {
    return <AccessDenied />;
  }

  const canRespond = request.status === 'open';
 

  const handleAccept = async () => {
    try {
      await acceptRequest(request.id).unwrap();
      toast.success('Request accepted');
      setConfirmAction(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't accept this request."));
      setConfirmAction(null);
    }
  };

  const handleReject = async () => {
    try {
      await rejectRequest(request.id).unwrap();
      toast.success('Request rejected');
      setConfirmAction(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't reject this request."));
      setConfirmAction(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/dashboard/requests-received"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
          <ArrowLeft size={16} />
          Back to Requests Received
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

      {/* Requester info */}
      <Card>
        <div className="flex items-center gap-3">
          {request.user.profile_picture ? (
            <img
              src={request.user.profile_picture}
              alt={request.user.username}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <div className="size-10 rounded-full bg-surface-container-high flex items-center justify-center text-outline">
              <User size={18} />
            </div>
          )}
          <div>
            <p className="text-body-md font-semibold text-on-surface">
              {request.user.full_name || request.user.username}
            </p>
            <p className="text-body-sm text-on-surface-variant">
              Requested this service
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
            label="Request Message"
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
      </Card>

      {/* Actions */}
      {canRespond && (
        <div className="border border-outline-variant bg-surface-container-lowest rounded-lg p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-body-md text-on-surface-variant max-w-lg">
            Accept this request to move forward with the client, or reject it if
            you're unable to take it on.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setConfirmAction('reject')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-error text-error rounded-lg font-medium hover:bg-error/10 transition-all cursor-pointer">
              <X size={16} />
              Reject
            </button>
            <button
              type="button"
              onClick={() => setConfirmAction('accept')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg font-medium hover:brightness-110 transition-all cursor-pointer">
              <Check size={16} />
              Accept
            </button>
          </div>
        </div>
      )}

      {confirmAction === 'accept' && (
        <ConfirmDialog
          title="Accept this request?"
          description={`You'll accept the request from ${
            request.user.full_name || request.user.username
          } for "${request.service.title}".`}
          confirmLabel="Accept Request"
          isConfirming={isAccepting}
          onConfirm={() => void handleAccept()}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {confirmAction === 'reject' && (
        <ConfirmDialog
          title="Reject this request?"
          description={`You'll reject the request from ${
            request.user.full_name || request.user.username
          } for "${request.service.title}". This cannot be undone.`}
          confirmLabel="Reject Request"
          isConfirming={isRejecting}
          onConfirm={() => void handleReject()}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}
