import { useState } from 'react';

import {
  Briefcase,
  // CheckCircle,
  // ChevronDown,
  Clock,
  FileText,
  MapPin,
  Upload,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import { useApplyJobMutation } from '../jobApi';

// import { useSelector } from 'react-redux';

interface JobApplicationFormProps {
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  jobType: string;
  postedAt: string;

  employerName?: string;
  employerEmail?: string;
  employerUsername?: string;
  onCancel?: () => void;
}

function JobApplicationForm({
  jobId,
  jobTitle,
  company,
  location,
  salary,
  jobType,
  postedAt,
  employerName,
  employerEmail,
  employerUsername,
}: JobApplicationFormProps) {
  const [resume, setResume] = useState<File | null>(null);
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [applyJob, { isLoading }] = useApplyJobMutation();
  const handleSubmitApplication = async () => {
    if (!resume) {
      toast.error('Please upload your resume.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('job', jobId);
      formData.append('resume', resume);
      formData.append('years_of_experience', yearsOfExperience);
      formData.append('expected_salary', expectedSalary);
      formData.append('cover_letter', coverLetter);

      // await applyJob({
      //   id: jobId,
      //   formData,
      // }).unwrap();
      await applyJob(formData).unwrap();

      toast.success('Application submitted successfully!');

      setResume(null);
      setYearsOfExperience('');
      setExpectedSalary('');
      setCoverLetter('');
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit application.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* Top Section - Job Info Header */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8 relative">
        <div className="absolute top-6 right-6 bg-primary/10 text-primary px-3 py-1 rounded-full text-label-md font-medium">
          Applied via NepWork
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <h1 className="text-headline-lg font-bold text-on-surface mb-2">
              {jobTitle}
            </h1>
            <div className="flex items-center gap-2 text-body-md text-primary font-medium">
              {company}
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              <span className="text-on-surface-variant font-normal flex items-center gap-1">
                <MapPin size={16} /> {location}
              </span>
            </div>
            <div className="flex flex-wrap gap-6 mt-4 text-body-md text-on-surface-variant">
              <div className="flex items-center gap-1">
                <Briefcase size={16} /> {jobType}
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-on-surface">{salary}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                Posted{' '}
                {new Date(postedAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>

          {/* Employer Info */}
          <div className="bg-surface-container rounded-lg p-4 w-full md:w-64 border border-outline-variant/30">
            <p className="text-label-md font-medium text-on-surface-variant mb-2">
              EMPLOYER INFO
            </p>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">
                {(employerName || company || 'E')
                  .split(' ')
                  .map((name) => name[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <p className="text-body-md font-bold text-on-surface">
                  {employerName || company || 'Unknown Employer'}
                </p>

                <p className="text-label-md text-on-surface-variant">
                  {employerEmail || 'Employer'}
                </p>
              </div>
            </div>

            {employerUsername && (
              <Link
                to={`/profile/${employerUsername}`}
                className="block mt-3 text-body-md text-primary hover:underline">
                View Employer Profile ↗
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Application Documents */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8">
        <h2 className="text-headline-md font-bold text-on-surface mb-2 flex items-center gap-2">
          <FileText className="text-primary" size={24} /> Application Documents
        </h2>

        <p className="text-body-md text-on-surface-variant mb-6">
          Please upload your most recent resume or professional certifications.
        </p>
        <label
          className="
            border-2 border-dashed border-outline-variant rounded-lg p-8
            flex flex-col items-center justify-center
            text-center hover:border-primary/50 transition-colors
            cursor-pointer group
          ">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                setResume(file);
              }
            }}
          />

          <Upload
            className="text-on-surface-variant group-hover:text-primary transition-colors mb-2"
            size={32}
          />

          <p className="text-body-md font-medium text-on-surface">
            {resume ? resume.name : 'Resume / CV'}
          </p>

          <p className="text-label-md text-on-surface-variant">
            PDF, DOCX up to 10MB
          </p>
        </label>
      </div>
      {/* Experience & Availability */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8">
        <h2 className="text-headline-md font-bold text-on-surface mb-6 flex items-center gap-2">
          <Briefcase className="text-primary" size={24} /> Experience &
          Availability
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-body-md font-medium text-on-surface mb-2">
              Years of Relevant Experience
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                placeholder="e.g. 5"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-md px-4 py-3 text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
              <span className="absolute right-4 text-on-surface-variant text-body-md">
                Years
              </span>
            </div>
          </div>
          <div>
            <label className="block text-body-md font-medium text-on-surface mb-2">
              Expected Salary
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                placeholder="e.g. 5000"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-md px-4 py-3 text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
              <span className="absolute right-4 text-on-surface-variant text-body-md">
                NPR
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Statement */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8">
        <h2 className="text-headline-md font-bold text-on-surface mb-2 flex items-center gap-2">
          <FileText className="text-primary" size={24} /> Cover Letter
        </h2>
        <p className="text-body-md text-on-surface-variant mb-4">
          Why are you a good fit for this role?
        </p>
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          className="w-full h-40 bg-surface-container-lowest border border-outline-variant rounded-md px-4 py-3 text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none placeholder:text-on-surface-variant/50"
          placeholder="Highlight your skills, relevant projects, or service philosophy..."
        />
        <div className="text-right text-label-md text-on-surface-variant mt-2">
          Min 250 characters recommended
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2 pb-6">
        <button
          type="button"
          onClick={handleSubmitApplication}
          disabled={isLoading}
          className="flex-1 py-3 bg-primary text-on-primary rounded-lg font-medium hover:brightness-110 transition-all duration-200 active:scale-95 text-body-md disabled:opacity-50">
          {isLoading ? 'Submitting...' : 'Submit Application'}
        </button>
        <button className="flex-1 sm:flex-none sm:w-48 py-3 border border-outline-variant text-on-surface rounded-lg font-medium hover:bg-surface-container transition-all duration-200 text-body-md">
          Save as Draft
        </button>
      </div>
    </div>
  );
}

export default JobApplicationForm;
