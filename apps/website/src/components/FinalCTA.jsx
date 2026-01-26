import React from 'react';
import Link from 'next/link';

const FinalCTA = ({ 
  title = "Ready to Excel in Your Studies?", 
  description = "Connect with our specialized tutors who make complex concepts clear and help you achieve your academic goals.",
  buttonText = "Request a Tutor",
  subject = ""
}) => {
  return (
    <section className="bg-gradient-to-br from-slate-800 to-blue-900 text-white p-6 sm:p-8 rounded-xl text-center space-y-4">
      <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
      <p className="text-base sm:text-lg max-w-2xl mx-auto text-blue-100">
        {description}
      </p>
      <Link 
        href="/request-tutor" 
        className="inline-block bg-emerald-500 text-white hover:bg-emerald-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition duration-300 shadow-lg transform hover:scale-105"
      >
        {buttonText}
      </Link>
      <p className="text-xs sm:text-sm text-slate-300 mt-2">
        Free matching service • {subject ? `${subject} specialists` : 'Expert tutors'} • Proven grade improvements
      </p>
    </section>
  );
};

export default FinalCTA;