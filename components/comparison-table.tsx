import { comparisonRows } from "@/content/site";

export function ComparisonTable() {
  return (
    <div className="mt-10">
      {/* Table for wide screens; definition list for narrow screens. */}
      <div className="hidden overflow-hidden rounded-lg border border-navy/10 bg-white md:block">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">
            Capability comparison between a generic AI receptionist and the Restoration
            Emergency Engine
          </caption>
          <thead>
            <tr className="bg-navy text-white font-mono text-[11px] uppercase tracking-[0.15em]">
              <th scope="col" className="px-5 py-5 font-semibold">
                Operational Capability
              </th>
              <th scope="col" className="px-5 py-5 font-semibold">
                Generic AI receptionist
              </th>
              <th scope="col" className="px-5 py-5 font-semibold text-amber">
                Restoration Emergency Engine
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.capability} className="align-top even:bg-slate-50 odd:bg-white border-b border-navy/5 last:border-0">
                <th scope="row" className="px-5 py-4 font-medium text-navy">
                  {row.capability}
                </th>
                <td className="px-5 py-4 text-steel-dark">{row.generic}</td>
                <td className="px-5 py-4 text-navy bg-slate-200/40 border-l border-white">
                  <div className="flex items-start gap-2">
                    <span className="text-verified font-bold">✓</span>
                    <span className="font-semibold">{row.engine}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="flex flex-col gap-3 md:hidden">
        {comparisonRows.map((row) => (
          <div key={row.capability} className="rounded-lg border border-navy/10 bg-white p-4">
            <dt className="text-sm font-semibold text-navy">{row.capability}</dt>
            <dd className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-steel-dark">
                Generic
              </span>
              <span className="text-steel-dark">{row.generic}</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-steel-dark mt-1">
                Engine
              </span>
              <div className="flex items-start gap-1.5 mt-1">
                <span className="text-verified font-bold">✓</span>
                <span className="font-semibold text-navy">{row.engine}</span>
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
