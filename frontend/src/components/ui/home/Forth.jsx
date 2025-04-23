'use client'
import Link from "next/link";
import RaqisCard from "@/components/cards/RaqisCard";
import { FaLongArrowAltRight } from "react-icons/fa";
import ResponsiveGrid from "@/components/ui/layout/ResponsiveGrid";

function Forth(props) {
    const { raqiData = [], title } = props;
    // const slice = raqiData?.slice(0, 4) || [];

  if (!raqiData) {
    return null;
  }

  return (
    <div id="Forth" className={`flex flex-col  md:mx-[7%] lg:mx-[7%] mt-20 m-5 rounded-lg ${[props.className]}  animate-fade-in`} style={{ animationDelay: '0.1s' }}>
      <div className="flex justify-between items-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h1 className="text-xl md:text-3xl font-bold text-RuqyaGray">{title}</h1>
        {raqiData.length > 3 && (
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link href="/BookRaqis" className="text-RuqyaGreen font-bold">
              See all <FaLongArrowAltRight className="inline mb-1" />
            </Link>
          </div>
        )}
      </div>

      {/* <Grid>
        {raqiData && slice.map((data) => (
          <RaqisCard key={data.id} raqi={data} />
        ))}
        </Grid> */}

      <ResponsiveGrid data={raqiData} breakpoints={{mobile:4, ipad: 4, 'ipad-landscape': 4, lg:3, xl: 3, '2xl': 3, '3xl': 5, '4xl': 6, '5xl': 6 }} className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {(data) => <RaqisCard key={`Raqi` + data.id} raqi={data} />}
        </ResponsiveGrid>
    </div>
  );
}

export default Forth;
