import React, { useEffect } from 'react';
import { Teacher } from '../../types';
import { Hero } from '../Hero';
import { TrustBar } from '../TrustBar';
import { Concept } from '../Concept';
import { MentorCarousel } from '../MentorCarousel';
import { Testimonials } from '../Testimonials';
import { HowItWorks } from '../HowItWorks';
import { Mission } from '../Mission';
import { SignupCTA } from '../SignupCTA';

interface HomeProps {
  teachers: Teacher[];
  teachersCount: number;
  setView: (view: any) => void;
}

const Home: React.FC<HomeProps> = ({ teachers, teachersCount, setView }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="w-full">
      <Hero />

      <TrustBar />

      <Concept />

      <MentorCarousel />

      <Testimonials />

      <HowItWorks />

      <Mission />

      <SignupCTA />
    </div>
  );
};

export default Home;
