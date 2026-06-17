import { Link } from 'react-router';
import { ArrowRight, Bell, CalendarClock, FileText, Package, ShieldCheck, Wrench } from 'lucide-react';
import { useAuth } from '@/features/auth/auth-context';

const workflow = [
  {
    title: 'Product record',
    text: 'Purchase date, value, category, serial number, and warranty length are stored once.',
    icon: Package,
  },
  {
    title: 'Proof attached',
    text: 'Receipts, manuals, and warranty certificates live beside the product they support.',
    icon: FileText,
  },
  {
    title: 'Reminder ready',
    text: 'Warranty and maintenance dates become visible before they become expensive.',
    icon: Bell,
  },
];

const deskRows = [
  { label: 'Apple MacBook Air', meta: 'Warranty active', value: '128 days', tone: 'bg-emerald-500' },
  { label: 'Sony WH-1000XM5', meta: 'Receipt stored', value: '14 days', tone: 'bg-amber-500' },
];

export function Landing() {
  const { session } = useAuth();
  const primaryPath = session ? '/dashboard' : '/register';
  const secondaryPath = session ? '/products' : '/login';

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f3ed] text-slate-950">
      <section className="relative min-h-screen px-4 py-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(37,99,235,0.14),transparent_30%),radial-gradient(circle_at_78%_8%,rgba(245,158,11,0.14),transparent_28%),linear-gradient(135deg,#f9f7f1_0%,#eef4ff_52%,#f7fbff_100%)]" />
        <div className="absolute left-0 top-0 hidden h-full w-px bg-slate-950/10 lg:block lg:left-10" />
        <div className="absolute right-0 top-0 hidden h-full w-px bg-slate-950/10 lg:block lg:right-10" />

        <div className="relative mx-auto flex min-h-[calc(100svh-2rem)] max-w-7xl flex-col">
          <header className="landing-reveal flex min-w-0 items-center justify-between rounded-full border border-white/70 bg-white/60 px-3 py-3 shadow-sm backdrop-blur-xl sm:px-4">
            <Link to="/" className="flex min-w-0 items-center gap-3 text-base font-black tracking-tight text-slate-950 sm:text-xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <Package className="h-5 w-5" />
              </span>
              <span className="truncate">WarrantyTracker</span>
            </Link>

            <nav className="ml-3 flex shrink-0 items-center gap-1 sm:gap-2">
              {session ? (
                <Link to="/dashboard" className="rounded-full px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-white">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="rounded-full px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-white">
                    Login
                  </Link>
                  <Link to="/register" className="hidden rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700 min-[440px]:inline-flex sm:px-5">
                    Start
                  </Link>
                </>
              )}
            </nav>
          </header>

          <div className="grid flex-1 items-center gap-10 py-10 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-8">
            <div className="landing-reveal max-w-3xl [animation-delay:120ms]">
              <p className="mb-6 text-xs font-black uppercase tracking-[0.24em] text-blue-700">
                Digital warranty archive
              </p>
              <h1 className="max-w-4xl text-[clamp(2.9rem,6.25vw,6.15rem)] font-black leading-[1.03] tracking-[-0.035em] text-slate-950 [text-wrap:balance]">
                Keep the proof.
                <span className="mt-4 block text-blue-700 sm:mt-5">Catch the date.</span>
              </h1>
              <p className="mt-8 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                A focused workspace for products, receipts, warranties, service history, and reminders before claims become guesswork.
              </p>

              <div className="mt-9 flex flex-col gap-3 min-[520px]:flex-row">
                <Link to={primaryPath} className="group inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-base font-black text-white shadow-2xl shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700">
                  {session ? 'Open dashboard' : 'Create your account'}
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </Link>
                <Link to={secondaryPath} className="inline-flex items-center justify-center rounded-full border border-slate-300/80 bg-white/70 px-6 py-3.5 text-base font-black text-slate-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white">
                  {session ? 'View products' : 'I already have one'}
                </Link>
              </div>

              <div className="mt-10 grid max-w-xl divide-y divide-slate-300/70 border-y border-slate-300/70 text-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <div className="py-3 sm:py-4 sm:pr-4">
                  <p className="font-black text-slate-950">30 / 14 / 7</p>
                  <p className="mt-1 text-slate-500">day alerts</p>
                </div>
                <div className="py-3 sm:px-4 sm:py-4">
                  <p className="font-black text-slate-950">PDF + image</p>
                  <p className="mt-1 text-slate-500">proof files</p>
                </div>
                <div className="py-3 sm:py-4 sm:pl-4">
                  <p className="font-black text-slate-950">RLS</p>
                  <p className="mt-1 text-slate-500">private data</p>
                </div>
              </div>
            </div>

            <div className="landing-reveal relative [animation-delay:240ms]">
              <div className="absolute inset-x-5 bottom-3 top-16 hidden rotate-[-2deg] rounded-[2.5rem] bg-[#dbeafe] shadow-2xl shadow-slate-950/10 sm:block" />
              <div className="absolute inset-x-2 bottom-8 top-8 hidden rotate-[1.2deg] rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl shadow-slate-950/15 sm:block" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[#fbfaf7] shadow-2xl shadow-slate-950/12 sm:rounded-[2.5rem]">
                <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4 sm:px-6">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Ownership desk</p>
                    <p className="mt-1 text-xl font-black tracking-[-0.04em] text-slate-950 sm:text-2xl">Warranty control</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white sm:h-12 sm:w-12">
                    <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                </div>

                <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[1fr_0.82fr]">
                  <div className="rounded-[2rem] bg-slate-950 p-5 text-white">
                    <p className="text-sm font-semibold text-blue-200">Current focus</p>
                    <h2 className="mt-3 text-2xl font-black leading-[1.02] tracking-[-0.04em] sm:text-4xl">MacBook Air M3</h2>
                    <div className="mt-6 rounded-3xl bg-white p-5 text-slate-950">
                      <p className="text-sm font-bold text-slate-500">Warranty status</p>
                      <div className="mt-3 flex items-end justify-between">
                        <div>
                          <p className="text-4xl font-black tracking-[-0.05em]">128</p>
                          <p className="text-sm text-slate-500">days remaining</p>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-black">Receipt attached</p>
                          <p className="text-sm text-slate-500">PDF, 248 KB</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <CalendarClock className="h-5 w-5 text-amber-600" />
                        <div>
                          <p className="font-black">Next reminder</p>
                          <p className="text-sm text-slate-500">Maintenance in 7 days</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <Wrench className="h-5 w-5 text-slate-500" />
                        <div>
                          <p className="font-black">Repair history</p>
                          <p className="text-sm text-slate-500">$82 total service cost</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                  <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
                    {deskRows.map((row, index) => (
                      <div key={row.label} className="landing-row grid grid-cols-[1fr_auto] items-center gap-4 border-b border-slate-100 px-5 py-3.5 last:border-b-0" style={{ animationDelay: `${420 + index * 120}ms` }}>
                        <div className="min-w-0">
                          <p className="truncate font-black text-slate-950">{row.label}</p>
                          <p className="mt-1 text-sm text-slate-500">{row.meta}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                          <span className={`h-2.5 w-2.5 rounded-full ${row.tone}`} />
                          {row.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:px-10">
        <div className="landing-section">
          <p className="text-xs font-black uppercase tracking-[0.26em] text-blue-700">How it works</p>
          <h2 className="mt-4 text-[2.35rem] font-black leading-[1.04] tracking-[-0.035em] text-slate-950 sm:text-6xl sm:leading-[0.95] sm:tracking-[-0.055em]">
            Three steps, one reliable archive.
          </h2>
        </div>
        <div className="landing-section grid gap-4">
          {workflow.map((item, index) => (
            <div key={item.title} className="group grid gap-5 rounded-[2rem] border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:bg-white hover:shadow-xl sm:grid-cols-[4.5rem_1fr]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">0{index + 1}</p>
                <h3 className="mt-1 text-2xl font-black tracking-[-0.035em] text-slate-950">{item.title}</h3>
                <p className="mt-2 max-w-2xl leading-7 text-slate-600">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10">
        <div className="landing-section relative overflow-hidden rounded-[2.75rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-950/20 sm:p-12 lg:p-16">
          <div className="absolute right-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
          <div className="absolute bottom-[-10rem] left-[-6rem] h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.26em] text-blue-300">Ready for the demo</p>
              <h2 className="mt-4 max-w-3xl text-[2.35rem] font-black leading-[1.04] tracking-[-0.035em] sm:text-6xl sm:leading-[0.95] sm:tracking-[-0.055em]">
                Start with one product. Show the whole system.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Authentication, protected data, file storage, analytics, reminders, email, CSV export, and API documentation in one flow.
              </p>
            </div>
            <Link to={primaryPath} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-base font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-blue-50">
              {session ? 'Open dashboard' : 'Start tracking'}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
