import { Link, useParams } from 'react-router-dom';
import JobDetails from '../features/jobs/components/JobDetails';

// Mock data - in real app, fetch from API
const JOBS_MOCK = [
  {
    id: 1,
    title: 'Senior Agronomist',
    description: 'We are seeking a highly skilled Senior Agronomist to join our growing team at GreenTerra Solutions. In this role, you will be responsible for developing and implementing sustainable agricultural practices that serve the Nepali marketplace and beyond.',
    job_type: 'Full-time',
    category_id: 5,
    salary_min: 85000,
    salary_max: 120000,
    currency: 'NPR',
    location: {
      id: 1,
      city: 'Pokhara',
      country: 'Nepal'
    },
    status: 'active',
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-15'),
    budget_type: 'Monthly',
    skills_required: ['Agronomy', 'Soil Science', 'Sustainability', 'Data Analysis', 'Nepali Language'],
    deadline: new Date('2024-03-15'),
    experience_level: 'Senior',
    company: {
      id: 1,
      company_name: 'GreenTerra Solutions',
      description: 'GreenTerra Solutions is a leading agricultural technology provider in Nepal, dedicated to empowering local farmers through digital transformation.',
      website: 'https://greenterra.com',
      industry: 'Agriculture',
      employee_count: '50-200 Employees',
      logo: '',
    },
    employer: {
      id: 1,
      name: 'Rajesh Sharma',
      email: 'rajesh@greenterra.com',
    },
    application_count: 24,
    rating: 4.5,
    reviews_count: 38,
    is_verified: true,
    is_urgent: false,
  },
  {
    id: 2,
    title: 'Full-Stack Developer (React/Node)',
    description: 'We are seeking a highly skilled Senior Full Stack Developer to join our growing engineering team at AstroTech Solutions. In this role, you will be responsible for designing and implementing scalable web applications that serve the Nepal marketplace and beyond.',
    job_type: 'Contract',
    category_id: 3,
    salary_min: 150000,
    salary_max: 200000,
    currency: 'NPR',
    location: {
      id: 2,
      city: 'Kathmandu',
      country: 'Nepal'
    },
    status: 'urgent',
    created_at: new Date('2024-01-14'),
    updated_at: new Date('2024-01-14'),
    budget_type: 'Project-based',
    skills_required: ['React', 'Node.js', 'TypeScript', 'AWS', 'GraphQL', 'Tailwind CSS'],
    deadline: new Date('2024-02-28'),
    experience_level: 'Senior',
    company: {
      id: 2,
      company_name: 'Nepal Digital Labs',
      description: 'AstroTech Solutions is a leading technology provider in Nepal, dedicated to empowering local businesses through digital transformation.',
      website: 'https://nepaldigital.com',
      industry: 'Technology',
      employee_count: '50-200 Employees',
      logo: '',
    },
    employer: {
      id: 2,
      name: 'Sita Poudel',
      email: 'sita@nepaldigital.com',
    },
    application_count: 12,
    rating: 4.2,
    reviews_count: 42,
    is_verified: true,
    is_urgent: true,
  },
];

function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  
  // Convert string ID to number
  const jobId = parseInt(id || '0', 10);
  const job = JOBS_MOCK.find((job) => job.id === jobId);
  
  if (!job) {
    return (
      <div className="bg-background min-h-screen pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center py-20">
          <h1 className="text-headline-lg font-bold text-on-surface">Job not found</h1>
          <p className="text-body-md text-on-surface-variant mt-2">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/jobs" className="mt-4 inline-block px-6 py-2 bg-primary text-on-primary rounded-lg font-medium">
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-20 pb-16">
      <JobDetails {...job} />
    </div>
  );
}

export default JobDetailsPage;