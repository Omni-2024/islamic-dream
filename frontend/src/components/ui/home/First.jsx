import Button from "@/components/ui/buttons/DefaultButton";
import { useEffect, useState } from "react";

function First() {
  const [svgScale, setSvgScale] = useState(2.1);
  const [svgTranslateY, setSvgTranslateY] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const sectionHeight = document.getElementById("first").clientHeight;
      const newScale = sectionHeight / 280; // Increase to make the svg smaller
      const newTranslateY = -((newScale - 1.6) * 50); // Increase to move the svg up
      setSvgScale(newScale);
      setSvgTranslateY(newTranslateY);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section id="first" className="relative w-full h-auto lg:h-60vh min-h-[400px] bg-RuqyaLightPurple overflow-x-clip">
      {/* Overlay to prevent background from affecting content */}
      <div className="absolute inset-0 bg-RuqyaLightPurple opacity-50"></div>

      {/* SVG Background - Hidden on mobile, visible on large screens */}
      <div className="hidden lg:block absolute right-0 bottom-0 pointer-events-none animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="8.19 7.39 16.4 18" style={{ animationDelay: "0.2s", transform: `scale(${svgScale}) translateY(${svgTranslateY}px)` }}>
          <path d="M13.794 8.89258C14.9487 6.89258 17.8355 6.89258 18.9902 8.89258L24.1863 17.8926C25.341 19.8926 23.8976 22.3926 21.5882 22.3926H11.1959C8.88654 22.3926 7.44316 19.8926 8.59786 17.8926L13.794 8.89258Z" fill="#008080" />
          <path d="M21.5885 10.3923C23.8979 10.3923 25.3413 12.8923 24.1866 14.8923L18.9904 23.8923C17.8357 25.8923 14.949 25.8923 13.7943 23.8923L8.59813 14.8923C7.44343 12.8923 8.88681 10.3923 11.1962 10.3923L21.5885 10.3923Z" fill="#008080" />
        </svg>
      </div>

      {/* Main Content Container */}
      <div className="relative h-full flex items-center justify-center mx-[8%]">
        <div className="mx-auto px-3 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center lg:gap-5 gap-0 relative z-10">
            {/* Text Content */}
            <div className="space-y-6 animate-fade-in text-center lg:text-left mb-10 order-2 lg:order-1" style={{ animationDelay: "0.4s" }}>
              <h1 className="text-3xl lg:text-5xl xl:text-6xl font-[1000] text-RuqyaGray leading-tight">
                <span className="text-RuqyaGreen block">
                  Empower Your
                  <br />
                  Spirit with Ruqyah
                </span>
              </h1>
              <p className="text-sm lg:text-lg max-w-xl mx-auto xl:mx-0">Connect with expert Raqis for personalized spiritual healing and guidance.</p>
              <div className="flex w-full xl:w-auto text-center items-center justify-center lg:items-start lg:justify-start gap-4 mt-10">
                <Button text="Book a Session" link="/BookRaqis" color="RuqyaGreen" bg={true} className="px-6 py-3 rounded-lg whitespace-nowrap animate-fade-in" style={{ animationDelay: "0.6s" }} />
                <Button text="Learn Ruqyah" link="/SelfRuqyah" className="px-6 py-3 border-RuqyaGreen border text-[#0d766e] bg-[rgba(0,204,204,0.1)] rounded-lg whitespace-nowrap animate-fade-in" style={{ animationDelay: "0.8s" }} />
              </div>
            </div>

            {/* Image Container */}
            <div className="flex items-center justify-end mb-3 mt-5 md:mt-0 lg:mb-0 order-1 lg:order-2 animate-fade-in" style={{ animationDelay: "0.7s" }}>
              <div className="relative w-full lg:w-[90vh]">
                <img src="https://miro.medium.com/v2/resize:fit:1200/1*dYuIVOkIcDKIarat5ynsIw.jpeg" alt="men-meditation" className="w-full lg:min-h-[400px] max-h-[45vh] object-cover object-center scale-x-[-1] lg:rounded-[2.2rem] rounded-[2.2rem]" />
                {/* <div className="h-5 md:h-8 hidden lg:flex"></div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default First;
