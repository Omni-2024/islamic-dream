"use client";
import Link from "next/link";
import RaqisCard from "@/components/cards/RaqisCard";
import { ArrowRight } from 'iconsax-react';
import ResponsiveGrid from "@/components/ui/layout/ResponsiveGrid";

function Forth(props) {
  const { raqiData = [], title } = props;

  if (!raqiData) {
    return null;
  }

  return (
    <div
      id="Forth"
      className={`mt-0 animate-fade-in ${props.className} mb-20`}
      style={{ animationDelay: "0.1s" }}
    >
      {/* Same container padding/margins as 'First' */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mt-16 mb-4">
        <h1 className="text-3xl text-RuqyaGreen font-bold leading-tight transition-all duration-700 delay-100">
          {title}
        </h1>

        {raqiData.length > 3 && (
          <Link href="/BookMuabbirs" className="text-RuqyaGreen font-bold inline-block mt-2 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            See all <ArrowRight size={20} className="inline mb-1" color="currentColor" variant="Outline" />
          </Link>
        )}
      </div>


        <ResponsiveGrid
          data={raqiData}
          breakpoints={{
            mobile: 4,
            ipad: 4,
            "ipad-landscape": 4,
            lg: 3,
            xl: 3,
            "2xl": 3,
            "3xl": 5,
            "4xl": 6,
            "5xl": 6,
          }}
          className="animate-fade-in mt-8"
          style={{ animationDelay: "0.4s" }}
        >
          {(data) => <RaqisCard key={`Raqi${data.id}`} raqi={data} />}
        </ResponsiveGrid>
      </div>
    </div>
  );
}

export default Forth;
