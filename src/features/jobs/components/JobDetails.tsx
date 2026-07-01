import { 
  MapPin, 
  Star, 
  Heart, 
  Share2, 
  Building2, 
  FileText,
  Mail,
  Link as LinkIcon,
  Clock,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface JobDetailsProps {
  id: number;
  title: string;
  description: string;
  job_type: string;
  category_id: number;
  salary_min: number;
  salary_max: number;
  currency: string;
  location: {
    id: number;
    city: string;
    country: string;
  };
  status?: string;
  created_at: Date;
  budget_type: string;
  skills_required: string[];
  deadline: Date;
  experience_level: string;
  company: {
    id: number;
    company_name: string;
    description: string;
    website: string;
    industry: string;
    employee_count: string;
    logo?: string;
  };
  application_count: number;
  rating?: number;
  reviews_count?: number;
  is_verified?: boolean;
  is_urgent?: boolean;
}

function JobDetails({
  id,
  title,
  description,
  job_type,
  salary_min,
  salary_max,
  currency,
  location,
  status,
  created_at,
  deadline,
  budget_type,
  skills_required,
  experience_level,
  company,
  application_count,
  rating = 4.2,
  reviews_count = 42,
  is_verified = false,
  is_urgent = false,
}: JobDetailsProps) {
  // Format date
  const formattedDate = new Date(created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Format deadline
  const formattedDeadline = new Date(deadline).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Format salary
  const formattedSalary = `${currency} ${salary_min.toLocaleString()} - ${salary_max.toLocaleString()}`;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      {/* Hidden Job ID for reference */}
      <div className="hidden">Job ID: {id}</div>

      {/* Top Section - Job Header */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Company Logo */}
          <div className="shrink-0">
            <div className="w-20 h-20 bg-surface-container-high rounded-xl flex items-center justify-center border border-outline-variant/50">
              {company.logo ? (
                <img src={company.logo} alt={company.company_name} className="w-12 h-12 object-contain" />
              ) : (
                <Building2 className="w-10 h-10 text-primary" />
              )}
            </div>
          </div>

          {/* Job Title & Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-headline-lg font-bold text-on-surface">{title}</h1>
              {is_verified && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-label-md font-medium rounded-full">
                  Verified
                </span>
              )}
              {is_urgent && (
                <span className="px-2 py-0.5 bg-error/10 text-error text-label-md font-medium rounded-full">
                  Urgent
                </span>
              )}
              {status && (
                <span className={`px-2 py-0.5 text-label-md font-medium rounded-full ${
                  status === 'active' ? 'bg-success/10 text-success' : 
                  status === 'urgent' ? 'bg-error/10 text-error' : 
                  'bg-outline-variant/50 text-on-surface-variant'
                }`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-body-md text-on-surface-variant">
              <span className="font-medium text-primary">{company.company_name}</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              
              {/* Rating */}
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= Math.round(rating) ? 'fill-warning text-warning' : 'text-outline-variant'}
                    />
                  ))}
                </div>
                <span className="text-body-md text-on-surface-variant">
                  ({rating}) {reviews_count} reviews
                </span>
              </div>

              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              
              <div className="flex items-center gap-1">
                <MapPin size={16} className="shrink-0" />
                <span>{location.city}, {location.country}</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock size={16} className="shrink-0" />
                <span>Posted: {formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="p-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors">
              <Heart size={20} />
            </button>
            <button className="p-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Job Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8">
            <h2 className="text-headline-md font-bold text-on-surface mb-4">Job description</h2>
            <p className="text-body-md text-on-surface-variant leading-relaxed mb-6">
              {description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-surface-container rounded-lg p-4">
                <p className="text-label-md font-medium text-on-surface-variant">Job Type</p>
                <p className="text-body-md font-bold text-on-surface">{job_type}</p>
              </div>
              <div className="bg-surface-container rounded-lg p-4">
                <p className="text-label-md font-medium text-on-surface-variant">Experience Level</p>
                <p className="text-body-md font-bold text-on-surface">{experience_level}</p>
              </div>
              <div className="bg-surface-container rounded-lg p-4">
                <p className="text-label-md font-medium text-on-surface-variant">Budget Type</p>
                <p className="text-body-md font-bold text-on-surface">{budget_type}</p>
              </div>
              <div className="bg-surface-container rounded-lg p-4">
                <p className="text-label-md font-medium text-on-surface-variant">Deadline</p>
                <p className="text-body-md font-bold text-on-surface">{formattedDeadline}</p>
              </div>
            </div>

            <h3 className="text-headline-sm font-bold text-on-surface mb-3">Skills Required</h3>
            <div className="flex flex-wrap gap-2">
              {skills_required.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-body-md rounded-full border border-outline-variant/50"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* About Company */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8">
            <h2 className="text-headline-md font-bold text-on-surface mb-4">About the Company</h2>
            <p className="text-body-md text-on-surface-variant leading-relaxed mb-6">
              {company.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface-container rounded-lg p-4">
                <p className="text-label-md font-medium text-on-surface-variant">Industry</p>
                <p className="text-body-md font-bold text-on-surface">{company.industry}</p>
              </div>
              <div className="bg-surface-container rounded-lg p-4">
                <p className="text-label-md font-medium text-on-surface-variant">Company Size</p>
                <p className="text-body-md font-bold text-on-surface">{company.employee_count}</p>
              </div>
            </div>

            {company.website && (
              <div className="mt-4">
                <a 
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline text-body-md"
                >
                  <Globe size={16} />
                  Visit Website
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Apply & Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Apply Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
<<<<<<< Updated upstream
            <button 
              className="w-full py-3 bg-primary text-on-primary rounded-lg font-medium hover:brightness-110 transition-all duration-200 active:scale-95"
              onClick={() => console.log(`Applying to job ${id}`)}
            >
              Apply Now
            </button>

            <div className="mt-4 border-2 border-dashed border-outline-variant rounded-lg p-6 text-center">
              <FileText size={32} className="mx-auto text-on-surface-variant mb-2" />
              <p className="text-body-md font-medium text-on-surface">Upload Resume</p>
              <p className="text-label-md text-on-surface-variant">PDF, DOCX (Max 5MB)</p>
            </div>
=======
            
            {/* 🔥 UPDATED APPLY NOW BUTTON 🔥 */}
            <Link to={`/jobs/${id}/apply`}>
              <button
                className="w-full py-3 bg-primary text-on-primary rounded-lg font-medium hover:brightness-110 transition-all duration-200 active:scale-95"
              >
                Apply Now
              </button>
            </Link>

            {/* <div className="mt-4 border-2 border-dashed border-outline-variant rounded-lg p-6 text-center">
              <FileText
                size={32}
                className="mx-auto text-on-surface-variant mb-2"
              />
              <p className="text-body-md font-medium text-on-surface">
                Upload Resume
              </p>
              <p className="text-label-md text-on-surface-variant">
                PDF, DOCX (Max 5MB)
              </p>
            </div> */}
>>>>>>> Stashed changes

            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center text-body-md">
                <span className="text-on-surface-variant">Salary Range</span>
                <span className="font-medium text-on-surface">{formattedSalary}</span>
              </div>
              <div className="flex justify-between items-center text-body-md">
                <span className="text-on-surface-variant">Job Type</span>
                <span className="font-medium text-on-surface">{job_type}</span>
              </div>
              <div className="flex justify-between items-center text-body-md">
                <span className="text-on-surface-variant">Applications</span>
                <span className="font-medium text-on-surface">{application_count} Applicants</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-outline-variant/50">
              <p className="text-label-md font-medium text-on-surface-variant mb-3">SHARE THIS ROLE</p>
              <div className="flex gap-2">
                <button className="p-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors">
                  <LinkIcon size={18} />
                </button>
                <button className="p-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors">
                  <Mail size={18} />
                </button>
                <button className="p-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors">
                  <FileText size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Similar Jobs */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
            <h3 className="text-headline-sm font-bold text-on-surface mb-4">Similar Jobs</h3>
            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div key={item} className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center shrink-0 border border-outline-variant/50">
                    <Building2 size={20} className="text-on-surface-variant" />
                  </div>
                  <div>
                    <p className="text-body-md font-medium text-on-surface">Lead Product Designer</p>
                    <p className="text-body-md text-on-surface-variant">CloudNepal Tech</p>
                    <div className="flex items-center gap-1 text-label-md text-on-surface-variant">
                      <MapPin size={12} className="shrink-0" />
                      <span>Pokhara</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link 
              to="/jobs" 
              className="block text-center mt-4 text-body-md font-medium text-primary hover:underline"
            >
              View all similar jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;