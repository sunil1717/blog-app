


import Link from "next/link";

export default function FeaturedSection({ blogs }) {
  if (!blogs) return null;
  
  console.log(blogs);
  
  const [main, ...side] = blogs; // main image + 4 small ones

  return (
    <section className="bg-[#eef4f7] py-12">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* LEFT COLUMN: Large Feature */}
          <Link href={`/blog/${main.slug}`}>
            <div className="relative rounded-[14px] overflow-hidden h-[630px] group border border-gray-300">
              <img
                src={main.images[0]}
                alt={main.title}
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
              
              {/* content */}
              <div className="absolute left-8 bottom-8 text-white max-w-[620px]">
                <div className="text-sm opacity-90">{main.category}</div>
                <h2 className="mt-3 text-[34px] md:text-[44px] lg:text-[52px] font-extrabold leading-tight relative inline-block after:block after:h-[2px] after:bg-red-500 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                  {main.title}
                </h2>
              </div>
            </div>
          </Link>

          {/* RIGHT COLUMN: 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {side.slice(0, 4).map((b) => (
              <Link key={b.slug} href={`/blog/${b.slug}`} className="group">
                <div className="rounded-[10px] overflow-hidden">
                  <img
                    src={b.images[0]}
                    alt={b.title}
                    className="w-full h-[200px] object-cover rounded-[10px] transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                  <div className="pt-4">
                    <div className="text-sm text-[#e65a64]">{b.category}</div>
                    <h3 className="mt-2 text-[18px] font-semibold leading-snug relative inline-block after:block after:h-[2px] after:bg-[#e65a64] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                      {b.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
