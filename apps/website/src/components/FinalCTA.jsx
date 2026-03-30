import React from 'react';
import Link from 'next/link';

const FinalCTA = ({ 
  title = "Ready to Excel in Your Studies?", 
  description = "Connect with our specialized tutors who make complex concepts clear and help you achieve your academic goals.",
  buttonText = "Request a Tutor",
  subject = ""
}) => {
  return (
    <section className="bg-gradient-to-r from-primary to-primary/90 text-white py-14 sm:py-16 px-6 sm:px-8 rounded-2xl text-center space-y-4 shadow-xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
      <p className="text-base sm:text-lg max-w-2xl mx-auto text-white/80">
        {description}
      </p>
      <Link
        href="/request-tutor"
        className="inline-block bg-[#F17720] text-white hover:bg-[#d9691c] px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        {buttonText}
      </Link>
      <p className="text-xs sm:text-sm text-white/60 mt-2">
        Free matching service • {subject ? `${subject} specialists` : 'Expert tutors'} • Proven grade improvements
      </p>
    </section>
  );
};

export default FinalCTA;