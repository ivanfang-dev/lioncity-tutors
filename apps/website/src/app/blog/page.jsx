"use client";

import Link from 'next/link';
import { useState } from 'react';

const blogPosts = [
    {
    slug: 'improve-primary-english-composition',
    title: '5 Signs Your Child is Struggling with English Composition (and How to Help)',
    description: 'A practical guide for parents to identify common writing weaknesses in their children and discover actionable strategies to help them improve.',
    date: 'September 15, 2025',
    directUrl: '/blog/improve-primary-english-composition',
    categories: ['English', 'PSLE', 'Parent Guide'],
  },
  {
    slug: 'psle-english',
    title: 'PSLE English Guide',
    description: 'Master PSLE English with our comprehensive guide. Learn essential skills, exam strategies, and proven techniques for success.',
    date: 'June 14, 2025',
    directUrl: '/psle-english',
    categories: ['PSLE', 'English'],
  },
  {
    slug: 'psle-math',
    title: 'PSLE Math Guide',
    description: 'Master PSLE Mathematics with our comprehensive guide. Learn essential concepts, problem-solving strategies, and exam techniques.',
    date: 'June 14, 2025',
    directUrl: '/psle-math',
    categories: ['PSLE', 'Math'],
  },
  {
    slug: 'psle-science',
    title: 'PSLE Science Guide',
    description: 'Master PSLE Science with our comprehensive guide. Learn essential concepts, practical skills, and exam strategies for success.',
    date: 'June 14, 2025',
    directUrl: '/psle-science',
    categories: ['PSLE', 'Science'],
  },
  {
    slug: 'psle-chinese',
    title: 'PSLE Chinese Guide',
    description: 'Master PSLE Chinese with our comprehensive guide. Learn essential language skills, exam strategies, and proven techniques for success.',
    date: 'June 14, 2025',
    directUrl: '/psle-chinese',
    categories: ['PSLE', 'Chinese'],
  },
  {
    slug: 'what-to-look-for-in-a-tutor',
    title: 'What to Look for in a Tutor',
    description: "Tips for choosing the right tutor for your child's needs.",
    date: 'May 25, 2025',
    directUrl: '/blog/what-to-look-for-in-a-tutor',
    categories: ['General'],
  },
  {
    slug: 'benefits-of-private-tuition',
    title: 'Benefits of Private Tuition in Singapore',
    description: 'Explore how one-on-one tutoring can improve academic results and confidence.',
    date: 'May 20, 2025',
    directUrl: '/blog/benefits-of-private-tuition',
    categories: ['General'],
  },
  {
    slug: 'psle-preparation',
    title: 'PSLE Preparation Guide 2025',
    description: 'Complete PSLE preparation guide for Singapore parents. Proven strategies, study schedules, and expert tips to help your child excel in PSLE 2025.',
    directUrl: '/blog/psle-preparation-guide',
    date: 'May 24, 2025',
    categories: ['PSLE'],
  },
  {
    slug: 'primary-school-tuition',
    title: 'Primary School Tuition',
    description: 'Discover the benefits of primary school tuition in Singapore. Learn how targeted support, foundational skill-building, and personalized guidance can help your child excel academically and gain confidence.',
    date: 'July 15, 2025',
    directUrl: '/primary-school-tuition',
    categories: ['General']
  },
  {
    slug: 'secondary-school-tuition',
    title: 'Secondary School Tuition',
    description: 'Explore how secondary school tuition can help students master challenging subjects, improve exam performance, and build strong study habits for O-Levels and beyond.',
    date: 'July 15, 2025',
    directUrl: '/secondary-school-tuition',
    categories: ['General']
  },
  {
    slug: 'jc-tuition',
    title: 'Junior College Tuition',
    description: 'Learn how junior college tuition supports students in tackling demanding A-Level subjects, developing critical thinking skills, and achieving their university aspirations.',
    date: 'July 16, 2025',
    directUrl: '/jc-tuition',
    categories: ['General']
  },
  {
    slug: 'o-level-tuition',
    title: 'O-Level Tuition',
    description: 'Find out how O-Level tuition can help students excel in their GCE O-Level exams. Get expert guidance, subject-specific strategies, and exam preparation tips to boost confidence and results.',
    date: 'July 12, 2025',
    directUrl: '/secondary-school-tuition/o-level-tuition',
    categories: ['O-Level', 'General']
  },
  {
    slug: 'n-level-tuition',
    title: 'N-Level Tuition',
    description: 'Learn how N-Level tuition supports students in mastering key subjects, improving academic performance, and preparing effectively for the GCE N-Level examinations.',
    date: 'July 11, 2025',
    directUrl: '/secondary-school-tuition/n-level-tuition',
    categories: ['N-Level', 'General']
  },
  {
    slug: 'o-level-english',
    title: 'O-Level English Guide',
    description: 'Comprehensive guide to O-Level English. Expert strategies, language skills, and proven tips to score A1 in O Level English.',
    date: 'July 7, 2025',
    directUrl: '/o-level-english',
    categories: ['O-Level', 'English']
  },
  {
    slug: 'o-level-chemistry',
    title: 'O-Level Chemistry Guide',
    description: 'Comprehensive guide to O-Level Chemistry. Master key concepts, practical skills, and exam strategies.',
    date: 'May 27, 2025',
    directUrl: '/o-level-chemistry',
    categories: ['O-Level', 'Chemistry'],
  },
  {
    slug: 'o-level-physics',
    title: 'O-Level Physics Guide',
    description: 'Master O-Level Physics with our comprehensive guide. Learn essential concepts, practical skills, and exam strategies for success.',
    date: 'June 15, 2025',
    directUrl: '/o-level-physics',
    categories: ['O-Level', 'Physics'],
  },
  {
    slug: 'o-level-biology',
    title: 'O-Level Biology Guide',
    description: 'Comprehensive guide to O-Level Biology. Master key concepts, practical skills, and exam strategies for life sciences.',
    date: 'June 16, 2025',
    directUrl: '/o-level-biology',
    categories: ['O-Level', 'Biology'],
  },
  {
    slug: 'a-level-preparation',
    title: 'A-Level Preparation Guide 2025',
    description: 'Complete A-Level preparation guide for Singapore JC students. Expert strategies, study schedules, and proven tips to excel in GCE A-Level examinations.',
    date: 'June 10, 2025',
    directUrl: '/blog/a-level-preparation-guide',
    categories: ['A-Level'],
  },
  {
    slug: 'o-level-preparation',
    title: 'O-Level Preparation Guide 2025',
    description: 'Comprehensive O-Level preparation guide for Singapore O-Level students. Master all GCE O-Level subjects with expert strategies and proven study techniques.',
    date: 'June 11, 2025',
    directUrl: '/blog/o-level-preparation-guide',
    categories: ['O-Level'],
  },
  {
    slug: 'n-level-preparation',
    title: 'N-Level Preparation Guide 2025',
    description: 'Complete N-Level preparation guide for Singapore N-Level students. Master all GCE N-Level subjects with expert strategies and proven study techniques.',
    date: 'July 11, 2025',
    directUrl: '/blog/n-level-preparation-guide',
    categories: ['N-Level'],
  },
  {
    slug: 'o-level-math',
    title: 'O-Level Math Guide',
    description: 'Master O-Level Mathematics with our comprehensive guide. Learn essential concepts, problem-solving strategies, and exam techniques.',
    date: 'June 12, 2025',
    directUrl: '/o-level-math',
    categories: ['O-Level', 'Math'],
  },
  {
    slug: 'a-level-general-paper',
    title: 'A-Level General Paper Guide',
    description: 'Comprehensive A Level General Paper guide with proven strategies to help Singapore JC students achieve A grades in GP essays and comprehension.',
    date: 'July 7, 2025',
    directUrl: '/a-level-general-paper',
    categories: ['A-Level', 'English'],
  },
  {
    slug: 'a-level-chemistry',
    title: 'A-Level Chemistry Guide',
    description: 'Comprehensive guide to A-Level Chemistry. Master key concepts, practical skills, and exam strategies.',
    date: 'June 13, 2025',
    directUrl: '/a-level-chemistry',
    categories: ['A-Level', 'Chemistry'],
  },
  {
    slug: 'a-level-math',
    title: 'A-Level Math Guide',
    description: 'Master A-Level Mathematics with our comprehensive guide. Learn essential concepts, problem-solving strategies, and exam techniques.',
    date: 'June 14, 2025',
    directUrl: '/a-level-math',
    categories: ['A-Level', 'Math'],
  },
  {
    slug: 'a-level-physics',
    title: 'A-Level Physics Guide',
    description: 'Master A-Level Physics with our comprehensive guide. Learn advanced concepts, practical skills, and exam strategies for success.',
    date: 'June 14, 2025',
    directUrl: '/a-level-physics',
    categories: ['A-Level', 'Physics'],
  },
  {
    slug: 'a-level-biology',
    title: 'A-Level Biology Guide',
    description: 'Comprehensive guide to A-Level Biology. Master advanced concepts, practical skills, and exam strategies for life sciences.',
    date: 'June 15, 2025',
    directUrl: '/a-level-biology',
    categories: ['A-Level', 'Biology'],
  },
  {
    slug: 'igcse-physics',
    title: 'IGCSE Physics Guide 2025',
    description: 'Master IGCSE Physics with our comprehensive guide. Learn essential concepts, practical skills, and exam strategies for success.',
    date: 'June 14, 2025',
    directUrl: '/igcse-physics',
    categories: ['IGCSE', 'Physics'],
  },
  {
    slug: 'igcse-chemistry',
    title: 'IGCSE Chemistry Guide 2025',
    description: 'Comprehensive guide to IGCSE Chemistry. Master key concepts, practical skills, and exam strategies.',
    date: 'June 14, 2025',
    directUrl: '/igcse-chemistry',
    categories: ['IGCSE', 'Chemistry'],
  },
  {
    slug: 'igcse-biology',
    title: 'IGCSE Biology Guide 2025',
    description: 'Master IGCSE Biology with our comprehensive guide. Learn essential concepts, practical skills, and exam strategies for life sciences.',
    date: 'June 14, 2025',
    directUrl: '/igcse-biology',
    categories: ['IGCSE', 'Biology'],
  },
  {
    slug: 'ibdp-physics',
    title: 'IBDP Physics Guide 2025',
    description: 'Master IBDP Physics with our comprehensive guide. Learn advanced concepts, practical skills, and exam strategies for success.',
    date: 'June 14, 2025',
    directUrl: '/ibdp-physics',
    categories: ['IBDP', 'Physics'],
  },
  {
    slug: 'ibdp-chemistry',
    title: 'IBDP Chemistry Guide 2025',
    description: 'Comprehensive guide to IBDP Chemistry. Master advanced concepts, practical skills, and exam strategies.',
    date: 'June 14, 2025',
    directUrl: '/ibdp-chemistry',
    categories: ['IBDP', 'Chemistry'],
  },
  {
    slug: 'ibdp-biology',
    title: 'IBDP Biology Guide 2025',
    description: 'Master IBDP Biology with our comprehensive guide. Learn advanced concepts, practical skills, and exam strategies for life sciences.',
    date: 'June 14, 2025',
    directUrl: '/ibdp-biology',
    categories: ['IBDP', 'Biology'],
  },
];

const categories = ['All', 'Parent Guide', 'PSLE', 'O-Level', 'N-Level', 'A-Level', 'English', 'Math', 'Science', 'Physics', 'Chemistry', 'Biology', 'IGCSE', 'IBDP', 'General'];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = (selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.categories.includes(selectedCategory)))
    .filter(post => !!post.directUrl);

  return (
    <>
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-4 sm:px-6 py-12 sm:py-16 max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            LionCity Tutors Blog
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Expert insights, study guides, and educational resources to help students excel in Singapore's education system
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-8 sm:py-12 max-w-6xl mx-auto">
        {/* Filter Bar */}
        <div className="mb-8 sm:mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-105' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600 text-sm">
            Showing <span className="font-semibold text-slate-900">{filteredPosts.length}</span> articles
            {selectedCategory !== 'All' && (
              <span> in <span className="font-semibold text-blue-600">{selectedCategory}</span></span>
            )}
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredPosts.map((post) => (
            <Link 
              key={post.slug} 
              href={post.directUrl}
              className="group block bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Category Badge */}
              <div className="p-4 sm:p-6 pb-0">
                <div className="flex items-center gap-2 mb-3">
                  {post.categories.slice(0, 2).map((category, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 sm:p-6 pt-0">
                {/* Title - Much smaller and more readable */}
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                  {post.title}
                </h2>
                
                {/* Description */}
                <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                  {post.description}
                </p>
                
                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">{post.date}</span>
                  <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
                    Read more
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No articles found</h3>
            <p className="text-slate-600">Try selecting a different category to see more content.</p>
          </div>
        )}
      </div>
    </main>
    </>
  );
}
