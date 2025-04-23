import Image from "next/image";
import flower from "@/assets/svg/green-flower.svg";

function Second() {
  return (
    <div id="second" className="min-h-[20vh]  mt-16 md:mt-14  animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <h1 className="text-3xl md:text-5xl font-bold text-RuqyaGray text-center leading-tight animate-fade-in" style={{ animationDelay: '0.2s' }}>
        Ruqyah is a <br className="block md:hidden" /> <span className="text-RuqyaGreen">spiritual healing</span> practice
        <br className="hidden md:block" />
        involving sacred recitations.
      </h1>
      <p className="mt-3 mb-6 text-sm md:text-base text-center leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <Image src={flower} alt="flower" className="w-6 mb-3 inline" />
        <span className="hidden md:inline">Our platform offers </span>
        Access to expert Raqis and self-guided resources
        <Image src={flower} alt="flower" className="w-6 mb-3 inline" />
      </p>
      <h1 className="mt-5 text-2xl md:text-3xl font-bold text-RuqyaGray text-center leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <span className="text-5xl"> £50.00/</span> booking
      </h1>
    </div>
  );
}

export default Second;
