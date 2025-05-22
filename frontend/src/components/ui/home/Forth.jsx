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
        <div
          className="flex justify-between items-center animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <h1 className="text-xl md:text-3xl font-bold text-RuqyaGray">
            {title}
          </h1>
          {raqiData.length > 3 && (
            <div
              className="text-center animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <Link href="/BookMuabbirs" className="text-RuqyaGreen font-bold">
                See all <ArrowRight size={20}  className="inline mb-1"  color="currentColor" variant="Outline" />
              </Link>
            </div>
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
