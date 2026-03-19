import { BarLoader } from "react-spinners";
import { Suspense } from "react";

export default function Layout({ children }) {
  return (
    <div className="px-5">

      {/* 🔥 Centered Heading with Blue Glow */}
      <div className="flex flex-col items-center justify-center text-center mb-10 relative">
        
        {/* Glow Effect */}
        <div className="absolute inset-0 flex justify-center">
          <div className="w-[300px] h-[150px] bg-blue-500/20 blur-3xl rounded-full"></div>
        </div>

        {/* Heading */}
        <h1 className="relative text-5xl md:text-6xl font-bold gradient-title">
          Industry Analytics
        </h1>

        {/* Optional subtitle */}
       
      </div>

      {/* Content */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />}
      >
        {children}
      </Suspense>
    </div>
  );
}