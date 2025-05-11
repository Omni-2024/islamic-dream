'use client'
import { useState, useEffect } from 'react'
import Link from "next/link"
import { FileIcon, Music2Icon, ChevronDownIcon, ChevronRightIcon, BookOpenIcon, HomeIcon, DownloadIcon } from 'lucide-react'
import content from '@/data/ruqyah'

export default function RuqyahPage() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(content.sections[0]?.id);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle scroll for progress bar and active section highlighting
  useEffect(() => {
    const handleScroll = () => {
      // Update scroll progress
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);

      // Update active section based on scroll position
      const sections = content.sections.map(section => document.getElementById(section.id));
      const currentSection = sections.find((section, index) => {
        if (!section) return false;
        const nextSection = sections[index + 1];
        const sectionTop = section.offsetTop - 150;
        const sectionBottom = nextSection ? nextSection.offsetTop - 150 : document.documentElement.scrollHeight;
        return scrollTop >= sectionTop && scrollTop < sectionBottom;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 100,
        behavior: 'smooth'
      });
    }
    setActiveSection(sectionId);
    setIsNavOpen(false);
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
      window.open(link.href, '_blank');
    } else {
      link.click();
    }
    document.body.removeChild(link);
  };

  return (
<div className="md:mx-[6%] px-3 py-5 md:pl-1 md:pr-3 min-h-screen bg-gradient-to-br from-white to-RuqyaLightPurple/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
     
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-sm text-gray-600">
          <Link href="/" className="flex items-center hover:text-RuqyaGreen transition-colors">
            <HomeIcon className="w-4 h-4 mr-1" />
            <span>Home</span>
          </Link>
          <ChevronRightIcon className="w-4 h-4 mx-2" />
          <span className="font-medium text-RuqyaGray">Self-Ruqyah</span>
        </nav>

        {/* Page header */}
        <header className="mb-10">
          <div className="flex items-center mb-4">
            <BookOpenIcon className="w-8 h-8 text-RuqyaGreen mr-3" />
            <h1 className="text-3xl md:text-4xl font-fullsansbold text-RuqyaGray">Self-Ruqyah Guide</h1>
          </div>
          <p className="text-gray-600 max-w-3xl">
            A comprehensive guide to performing self-ruqyah with authentic duas and methods from the Sunnah.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-20">
              <button
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-md border border-RuqyaLightPurple mb-2 lg:hidden"
              >
                <span className="font-medium text-RuqyaGray">Table of Contents</span>
                <ChevronDownIcon className={`w-5 text-RuqyaGreen transition-transform ${isNavOpen ? 'rotate-180' : ''}`} />
              </button>

              <nav className={`
                overflow-hidden bg-white rounded-lg shadow-md border border-RuqyaLightPurple
                ${isNavOpen ? 'max-h-[600px]' : 'max-h-0'}
                transition-all duration-300 ease-in-out
                lg:max-h-[800px]
              `}>
                <div className="p-4">
                  <h2 className="text-lg font-medium text-RuqyaGray mb-4 hidden lg:block">Table of Contents</h2>
                  <ul className="space-y-1">
                    {content.sections.map(section => (
                      <li key={section.id}>
                        <button
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-md transition-colors hover:bg-RuqyaLightPurple/50 flex items-center
                            ${activeSection === section.id ? 'bg-RuqyaLightPurple text-RuqyaGreen font-medium' : 'text-gray-700'}
                          `}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full mr-2 ${activeSection === section.id ? 'bg-RuqyaGreen' : 'bg-gray-400'}`}></div>
                          {section.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-md border border-RuqyaLightPurple overflow-hidden">
              <div className="p-6 md:p-8">
                {/* Replace the entire content sections map and resources section with this single map */}
                {content.sections.map((section, index) => (
                  <section 
                    key={section.id} 
                    id={section.id} 
                    className={`
                      animate-fade-in pb-5
                     
                    `} 
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 rounded-full bg-RuqyaLightPurple flex items-center justify-center text-RuqyaGreen font-medium mr-3">
                        {index + 1}
                      </div>
                      <h2 className="text-2xl font-medium text-RuqyaGray">{section.title}</h2>
                    </div>
                    
                    <div className="prose max-w-none">
                      {section.content.split('<br/>').map((paragraph, index) => (
                        <p key={index} className="text-gray-700 mb-4">{paragraph}</p>
                      ))}
                    </div>
                  </section>
                ))}

                {/* Resources Section */}
                <section id="resources" className="animate-fade-in">

                  <div className="relative group">
                    {/* First resource */}
                    <div className="relative group/item">
                      <div className="flex items-center p-3 cursor-pointer">
                        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-gradient-to-r from-RuqyaGreen/20 to-RuqyaLightPurple/50">
                          <FileIcon className="h-6 w-6 text-RuqyaGreen" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="font-medium text-RuqyaGray">Daily Morning & Evening Adhkar</h4>
                          <p className="text-sm text-gray-500">PDF • Essential daily prayers</p>
                        </div>
                        <div className="w-12 h-12 relative opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                          <div className="absolute inset-0 rounded-full bg-RuqyaGreen/10 group-hover:bg-RuqyaGreen/20 flex items-center justify-center transition-colors cursor-pointer"
                              onClick={() => handleDownload('/download/Ruqya_PDF1.pdf', 'Daily Morning & Evening Adhkar.pdf')}>
                            <DownloadIcon className="h-5 w-5 text-RuqyaGreen" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Second resource */}
                    <div className="relative group/item">
                      <div className="flex items-center p-3 cursor-pointer">
                        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-gradient-to-r from-RuqyaGreen/20 to-RuqyaLightPurple/50">
                          <FileIcon className="h-6 w-6 text-RuqyaGreen" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="font-medium text-RuqyaGray">Ruqyah Booklet</h4>
                          <p className="text-sm text-gray-500">PDF • Complete guide</p>
                        </div>
                        <div className="w-12 h-12 relative opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                          <div className="absolute inset-0 rounded-full bg-RuqyaGreen/10 group-hover:bg-RuqyaGreen/20 flex items-center justify-center transition-colors cursor-pointer"
                              onClick={() => handleDownload('/download/Ruqya_PDF2.pdf', 'ruqyah booklet.pdf')}>
                            <DownloadIcon className="h-5 w-5 text-RuqyaGreen" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Ruqyah Audio */}
                    <div className="relative group/item">
                      <div className="flex items-center p-3 cursor-pointer">
                        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-gradient-to-r from-RuqyaGreen/20 to-RuqyaLightPurple/50">
                          <Music2Icon className="h-6 w-6 text-RuqyaGreen" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="font-medium text-RuqyaGray">Ruqyah Audio</h4>
                          <p className="text-sm text-gray-500">MP3 • Recitation with tajweed</p>
                        </div>
                        <div className="w-12 h-12 relative opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                          <div className="absolute inset-0 rounded-full bg-RuqyaGreen/10 group-hover:bg-RuqyaGreen/20 flex items-center justify-center transition-colors cursor-pointer"
                              onClick={() => handleDownload('/download/Ruqya_Audio.mp3', 'Ruqya_Audio.mp3')}>
                            <DownloadIcon className="h-5 w-5 text-RuqyaGreen" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative footer */}
                  <div className="h-2 bg-gradient-to-r from-RuqyaGreen/30 via-RuqyaLightPurple to-RuqyaGreen/30"></div>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}