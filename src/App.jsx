import React from 'react';
import Navbar         from './components/Navbar/Navbar';
import Hero           from './components/Hero/Hero';
import About          from './components/About/About';
import Education      from './components/Education/Education';
import ProblemSolving from './components/ProblemSolving/ProblemSolving';
import Skills         from './components/Skills/Skills';
import Experience     from './components/Experience/Experience';
import Projects       from './components/Projects/Projects';
import Certifications from './components/Certifications/Certifications';
import Contact        from './components/Contact/Contact';
import Footer         from './components/Footer/Footer';

export default function App() {
  return (
    <>
      <Navbar />

      <main id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <Education />
        <ProblemSolving />
        <Skills />
        <Experience />
        <Projects />
        <Certifications />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
