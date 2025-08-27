'use client';

import NavigationBar from '@/components/ui/navbar';
import { Typography, Button } from 'antd';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const { Title, Text } = Typography;

interface JobPosition {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  type: string;
  tallyFormUrl: string;
}

const jobPositions: JobPosition[] = [
  {
    id: 'internship-opportunity',
    title: 'Internship Opportunity 2025',
    description:
      "We're looking for passionate interns to join our team and gain valuable industry experience.",
    requirements: [
      'Currently enrolled in a relevant degree program',
      'Basic knowledge of design or development tools',
      'Eager to learn and grow in a fast-paced environment',
    ],
    location: '100% remote',
    type: 'Internship',
    tallyFormUrl: 'https://tally.so/r/mZB22y',
  },
];

const JobCard = ({ job }: { job: JobPosition }) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
      className="border border-gray-200 rounded-lg p-6 mb-6 bg-white hover:border-[#E34013] transition-all cursor-pointer"
      onClick={() => window.open(job.tallyFormUrl, '_blank')}>
      <div className="flex justify-between items-start mb-4">
        <Title level={4} className="m-0">
          {job.title}
        </Title>
        <Button type="text" className="flex items-center">
          <span className="mr-2">Apply</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 17L17 7M17 7H7M17 7V17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>
      <Text className="block mb-4 text-gray-600">{job.description}</Text>
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
          <svg
            className="w-4 h-4 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 7V12L15 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {job.type}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
          <svg
            className="w-4 h-4 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {job.location}
        </span>
      </div>
    </motion.div>
  );
};

const CareerPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="mb-16 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10">
            <Title level={1} className="text-5xl font-bold mb-6">
              Join our world-class team <br />
              of creators <span className="font-serif italic">&</span> dreamers
            </Title>
            <Text className="text-lg max-w-2xl mx-auto block mb-8">
              Our philosophy is simple — hire a team of diverse, passionate
              people and foster a culture that empowers you to do your best
              work.
            </Text>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10">
              <svg
                width="60"
                height="60"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <circle
                  cx="50"
                  cy="50"
                  r="50"
                  fill="#E34013"
                  fillOpacity="0.2"
                />
              </svg>
            </div>
            <div className="absolute bottom-10 right-10">
              <svg
                width="80"
                height="80"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <rect
                  width="100"
                  height="100"
                  rx="20"
                  fill="#E34013"
                  fillOpacity="0.1"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <div className="grid grid-cols-1 gap-2">
            {jobPositions.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </motion.div>

        {/* No Positions Section */}
        {/* <div className="mt-16 text-center p-8 bg-white rounded-lg border border-gray-200">
          <Title level={4}>Don't see a position that fits?</Title>
          <Text className="block mb-6">We're always looking for talented people to join our team. Send us your resume and we'll keep it on file.</Text>
          <Button 
            type="primary" 
            size="large" 
            className="bg-[#E34013] hover:bg-[#c23611]"
            onClick={() => window.open('https://tally.so/r/general-application', '_blank')}
          >
            Send General Application
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default CareerPage;
