import { Headphones, Package, RefreshCw, ShieldCheck } from "lucide-react";
import { valueProps } from "./homeData";

const icons = [Package, ShieldCheck, Headphones, RefreshCw];

const badgeStyles = [
  "bg-orange-100 text-orange-700 ring-orange-200",
  "bg-amber-100 text-amber-800 ring-amber-200",
  "bg-rose-100 text-rose-700 ring-rose-200",
  "bg-stone-100 text-stone-700 ring-stone-200",
];

export default function ValuePropositionBar() {
  return (
    <section className="bg-white px-3 pt-2 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50 via-white to-rose-50 px-4 py-6 shadow-sm sm:px-6 sm:py-7">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {valueProps.map((item, index) => {
            const Icon = icons[index];
            const badgeClass = badgeStyles[index];

            return (
              <div
                key={item.title}
                className="flex min-h-[82px] items-center gap-4 rounded-xl border border-orange-100 bg-white/90 px-4 py-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-1 ${badgeClass}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {item.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}