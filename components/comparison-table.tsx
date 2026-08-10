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
            <tr className="bg-navy text-white">
              <th scope="col" className="px-4 py-3 font-semibold">
                Capability
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Generic AI receptionist
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Restoration Emergency Engine
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.capability} className="border-t border-navy/10 align-top">
                <th scope="row" className="px-4 py-3 font-medium text-navy">
                  {row.capability}
                </th>
                <td className="px-4 py-3 text-steel-dark">{row.generic}</td>
                <td className="px-4 py-3 font-medium text-navy">{row.engine}</td>
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
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-steel-dark">
                Engine
              </span>
              <span className="font-medium text-navy">{row.engine}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
