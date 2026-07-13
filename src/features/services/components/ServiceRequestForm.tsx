import { useState } from 'react';

import { getApiErrorMessage } from '@/features/dashboard/utils/getApiErrorMessage';
import { useCreateServiceRequestMutation } from '@/features/services/serviceApi';
import { Briefcase, Clock, FileText, MapPin, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

import type { ServiceDetail } from '../types';

interface ServiceRequestFormProps {
  service: ServiceDetail;
}

function ServiceRequestForm({ service }: ServiceRequestFormProps) {
  const navigate = useNavigate();
  const [createRequest, { isLoading }] = useCreateServiceRequestMutation();

  const [attachment, setAttachment] = useState<File | null>(null);
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [requirements, setRequirements] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    if (!requirements.trim()) {
      toast.error('Please describe your requirements.');
      return;
    }

    const combinedMessage = notes.trim()
      ? `${requirements.trim()}\n\nAdditional notes: ${notes.trim()}`
      : requirements.trim();

    try {
      await createRequest({
        service: service.id,
        request_message: combinedMessage,
        currency: service.currency,
        budget: budget ? Number(budget) : undefined,
        preferred_date: deadline || null,
      }).unwrap();

      toast.success('Service request submitted successfully!');
      navigate('/dashboard/my-requests');
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't send this request."));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* Service Header */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8 relative">
        <div className="absolute top-6 right-6 bg-primary/10 text-primary px-3 py-1 rounded-full text-label-md font-medium">
          Requested via NepWork
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <h1 className="text-headline-lg font-bold text-on-surface mb-2">
              {service.title}
            </h1>

            <div className="flex items-center gap-2 text-body-md text-primary font-medium">
              {service.category?.name}

              <span className="w-1 h-1 rounded-full bg-outline-variant" />

              <span className="text-on-surface-variant font-normal flex items-center gap-1">
                <MapPin size={16} />
                {service.location?.city ?? 'Remote'}
              </span>
            </div>

            <div className="flex flex-wrap gap-6 mt-4 text-body-md text-on-surface-variant">
              <div className="flex items-center gap-1">
                <Briefcase size={16} />
                {service.price_type}
              </div>

              <div className="flex items-center gap-1">
                <span className="font-medium text-on-surface">
                  {service.currency} {service.price}
                  {service.price_type === 'hourly' && '/hr'}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Clock size={16} />
                {service.availability_status}
              </div>
            </div>
          </div>

          {/* Provider */}
          {service.user && (
            <div className="bg-surface-container rounded-lg p-4 w-full md:w-64 border border-outline-variant/30">
              <p className="text-label-md font-medium text-on-surface-variant mb-2">
                SERVICE PROVIDER
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">
                  {service.user?.username.slice(0, 2).toUpperCase()}
                </div>

                <div>
                  <p className="text-body-md font-bold text-on-surface">
                    {service.user?.username}
                  </p>
                </div>
              </div>

              <Link
                to={`/profile/${service.user?.username}`}
                className="block mt-3 text-body-md text-primary hover:underline">
                View Profile ↗
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8">
        <h2 className="text-headline-md font-bold text-on-surface mb-2 flex items-center gap-2">
          <FileText className="text-primary" size={24} />
          Project Requirements
        </h2>

        <textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          className="w-full h-40 bg-surface-container-lowest border border-outline-variant rounded-md px-4 py-3"
          placeholder="Describe your requirements..."
        />
      </div>

      {/* Upload */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8">
        <h2 className="text-headline-md font-bold text-on-surface mb-6">
          Attachments
        </h2>

        <label className="border-2 border-dashed border-outline-variant rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
          />

          <Upload size={32} className="mb-2" />

          <p>{attachment ? attachment.name : 'Upload requirements file'}</p>
        </label>

        <p className="text-label-md text-on-surface-variant mt-2">
          Note: attachments aren't sent with the request yet — this is stored
          locally for now.
        </p>
      </div>

      {/* Budget & Deadline */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8">
        <h2 className="text-headline-md font-bold text-on-surface mb-6">
          Budget & Deadline
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="number"
            placeholder="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="border border-outline-variant rounded-md px-4 py-3"
          />

          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="border border-outline-variant rounded-md px-4 py-3"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8">
        <h2 className="text-headline-md font-bold text-on-surface mb-2">
          Additional Notes
        </h2>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full h-32 border border-outline-variant rounded-md px-4 py-3"
          placeholder="Any additional instructions..."
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pb-6">
        <button
          onClick={() => void handleSubmit()}
          disabled={isLoading}
          className="flex-1 py-3 bg-primary text-on-primary rounded-lg disabled:opacity-50 cursor-pointer">
          {isLoading ? 'Sending...' : 'Send Request'}
        </button>

        <button
          type="button"
          disabled
          title="Coming soon"
          className="flex-1 py-3 border border-outline-variant rounded-lg opacity-50 cursor-not-allowed">
          Save Draft
        </button>
      </div>
    </div>
  );
}

export default ServiceRequestForm;
