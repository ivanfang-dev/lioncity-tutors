import Link from 'next/link';
import { guidesData } from '@/data/guidesData';
import { Button } from '@/components/ui/button';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';
import GuideSchema from '@/components/seo/GuideSchema';

export const metadata = {
  title: 'Parent & Student Exam Guides | LionCity Tutors Singapore',
  description: 'Your central hub for all our comprehensive exam guides. Find in-depth resources for PSLE, O-Level, A-Level, and parenting strategies.',
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'Parent & Student Exam Guides | LionCity Tutors',
    description: 'The ultimate resource library for Singaporean parents and students navigating PSLE, O-Levels, and A-Levels.',
    url: 'https://www.lioncitytutors.com/guides',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/guides',
  },
};

// Helper to filter guides by level
const getGuidesByLevel = (level) => guidesData.filter(guide => guide.level === level);

const GuideCard = ({ guide }) => (
  <Link href={guide.href} className="block group">
    <div className="bg-white p-6 rounded-lg border h-full shadow-sm hover:shadow-lg hover:-translate-y-1 transition-transform duration-300">
      <div className="text-3xl mb-4">{guide.icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-red-500 transition-colors">
        {guide.title}
      </h3>
      <p className="text-gray-600">
        {guide.description}
      </p>
    </div>
  </Link>
);

const GuideSection = ({ title, level, sectionDescription }) => {
  const guides = getGuidesByLevel(level);
  return (
    <section className="mb-16">
      <div className="mb-8">
        <h2 className="section-title text-primary border-b-4 border-red-200 pb-2 inline-block">
          {title}
        </h2>
        {sectionDescription && <p className="text-gray-600 mt-3 text-lg">{sectionDescription}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {guides.map(guide => (
          <GuideCard key={guide.title} guide={guide} />
        ))}
      </div>
    </section>
  );
};

export default function GuidesHubPage() {
  return (
    <>
      <GuideSchema
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Exam Guides', url: '/guides' },
        ]}
        collection={{
          url: '/guides',
          name: 'Parent & Student Exam Guides',
          description: 'Your central hub for all our comprehensive exam guides. Find in-depth resources for PSLE, O-Level, A-Level, and parenting strategies.',
        }}
      />
      <main className="bg-gray-50">
        {/* Hero Section */}
        <div className="text-center py-16 px-4 bg-white">
          <h1 className="page-title text-primary mb-4">
            Parent & Student Resource Hub
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Welcome to your resource library. We've created these in-depth guides to help you navigate Singapore's education system with clarity and confidence.
          </p>
        </div>

        {/* Guides Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* NEW: Parenting & Strategy Section */}
          <GuideSection 
            title="Parenting & Strategy Guides" 
            level="Parenting & Strategy"
            sectionDescription="Expert advice on supporting your child's learning journey, from diagnosing issues to managing well-being."
          />
          
          <GuideSection 
            title="PSLE Guides" 
            level="PSLE"
            sectionDescription="Comprehensive syllabus breakdowns and preparation strategies for the Primary School Leaving Examination."
          />

          <GuideSection 
            title="GCE O-Level Guides" 
            level="O-Level"
            sectionDescription="In-depth resources to help students master subjects and excel in the O-Level examinations."
          />
          <GuideSection 
            title="GCE A-Level Guides" 
            level="A-Level"
            sectionDescription="Advanced guides for Junior College students aiming for top scores in the A-Level examinations."
          />
        </div>

         {/* Final CTA Section */}
        <section className="text-center py-16 px-4 bg-red-500">
             <h2 className="section-title text-white">Ready to Turn Knowledge into Results?</h2>
             <p className="text-red-100 mt-4 mb-8 max-w-2xl mx-auto">
                Our guides give you the strategy. Our expert tutors provide the personalized coaching to make it happen. Let's build your child's confidence and grades together.
             </p>
             <Link href="/request-tutor">
                <Button size="lg" className="bg-white text-red-500 font-bold text-lg px-8 py-6 hover:bg-gray-100 shadow-lg">
                    Request a Specialist Tutor
                </Button>
            </Link>
        </section>
      </main>
    </>
  );
}