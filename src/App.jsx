import { useEffect, useMemo, useState } from 'react'
import Papa from 'papaparse'
import PixelBlast from './PixelBlast'

function App() {
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  // typewriter for announcement
  const announcement = "Google Cloud Campaign'25 is Live!"
  const [typed, setTyped] = useState('')
  const [typeIx, setTypeIx] = useState(0)
  const [dir, setDir] = useState(1) // 1 typing, -1 deleting

  // typewriter for title
  const titleText = "Cloud campaign'25 Leaderboard"
  const [typedTitle, setTypedTitle] = useState('')
  const [titleIx, setTitleIx] = useState(0)

  // carousel state (two t-shirt images from public)
  const slides = ['/images/tshirt-1.jpg', '/images/tshirt-2.jpg']
  const [current, setCurrent] = useState(0)

  // helper for date like '24 Sept 2025'
  const formatShortDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const day = d.getDate()
    const year = d.getFullYear()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    const m = months[d.getMonth()]
    return `${day} ${m} ${year}`
  }

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await fetch('/Nirma University - Ahmedabad, India [26 Oct].csv', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load CSV file')
        const csvText = await res.text()

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length) {
              console.error('CSV Parsing errors:', results.errors)
              throw new Error('Failed to parse CSV file')
            }
            setParticipants(results.data)
            setLoading(false)
          },
          error: (err) => {
            setError(err.message || 'Error parsing CSV')
            setLoading(false)
          },
        })
      } catch (err) {
        setError(err.message || 'Error loading data')
        setLoading(false)
      }
    }
    load()
  }, [])

  // auto-play carousel
  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length)
    }, 4000)
    return () => clearInterval(id)
  }, [slides.length])

  // typewriter effects
  useEffect(() => {
    const doneTyping = typeIx >= announcement.length
    const delay = doneTyping && dir === 1 ? 1500 : 60
    const t = setTimeout(() => {
      let nextIx = typeIx + dir
      if (nextIx < 0) nextIx = 0
      if (nextIx > announcement.length) nextIx = announcement.length
      setTypeIx(nextIx)
      setTyped(announcement.slice(0, nextIx))
      if (nextIx === announcement.length) setDir(-1)
      if (nextIx === 0 && dir === -1) setDir(1)
    }, delay)
    return () => clearTimeout(t)
  }, [typeIx, dir, announcement])

  useEffect(() => {
    if (titleIx > titleText.length) return
    const t = setTimeout(() => {
      setTypedTitle(titleText.slice(0, titleIx))
      setTitleIx(titleIx + 1)
    }, 60)
    return () => clearTimeout(t)
  }, [titleIx, titleText])

  // Normalize participants once; build global sorted list and rank map
  const { globalSorted, rankByKey } = useMemo(() => {
    if (!participants || participants.length === 0) {
      return { globalSorted: [], rankByKey: new Map() }
    }

    const normalized = participants.map((p) => {
      const courses = parseInt(p['# of Skill Badges Completed'], 10) || 0
      const arcades = parseInt(p['# of Arcade Games Completed'], 10) || 0
      return {
        name: p['User Name'] || 'Unknown',
        profile_url: p['Google Cloud Skills Boost Profile URL'],
        courses: courses,
        arcades: arcades,
        count: courses + arcades,
        key: p['Google Cloud Skills Boost Profile URL'] || p['User Name'] || Math.random(),
      }
    })

    const sorted = [...normalized].sort((a, b) => b.count - a.count)
    const map = new Map()
    sorted.forEach((p, idx) => map.set(p.key, idx + 1))

    return { globalSorted: sorted, rankByKey: map }
  }, [participants])

  // Filtered view based on global order so rank is consistent
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return globalSorted
    return globalSorted.filter((p) => p.name.toLowerCase().includes(q))
  }, [globalSorted, query])
  // Countdown timer logic
  const calculateTimeLeft = () => {
    const endDate = new Date('2025-10-31T23:59:59');
    const now = new Date();
    const diff = endDate - now;
  
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
  
    return { days, hours, minutes, seconds };
  };
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

 
  return (
    <>
      <div className="min-h-screen  relative">
          {/* Background - layered GDG colors */}
          <PixelBlast variant="square" pixelSize={7} color="#fecaca" patternScale={3} patternDensity={1.05} pixelSizeJitter={0.25} speed={0.5} edgeFade={0} transparent />
          <PixelBlast variant="square" pixelSize={6} color="#fee2b3" patternScale={2.8} patternDensity={1.1} pixelSizeJitter={0.35} speed={0.65} edgeFade={0} transparent />
          <PixelBlast variant="square" pixelSize={6} color="#bbf7d0" patternScale={3.2} patternDensity={1.05} pixelSizeJitter={0.3} speed={0.55} edgeFade={0} transparent />
          <PixelBlast variant="square" pixelSize={6} color="#bfdbfe" patternScale={3} patternDensity={1.1} pixelSizeJitter={0.3} speed={0.6} edgeFade={0} transparent />

          {/* Header - fixed and full-bleed navbar (RED theme) */}
          <header className="fixed inset-x-0 top-0 z-30 bg-white/95 backdrop-blur border-b border-red-300 shadow-lg">
            <nav className="w-full px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center">
              <img
                src="/gdg_2.png"
                alt="GDG"
                className="h-10 w-auto sm:h-14 md:h-15"  // bigger sizes
              />
            </nav>
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
              <div className="w-full text-center py-2 text-sm">
                <span className="mr-2">📣</span>
                <span className="inline-block align-middle">
                  {typed}
                  <span className="ml-1 inline-block w-2 animate-pulse">|</span>
                </span>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative z-10 pt-32">
            {/* Title with typewriter - GDG gradient colors */}
            <h1 className="mb-6 text-center text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">{typedTitle}</h1>

            {/* Two-column hero: left stats, right autoplay carousel with caption */}
            <section className="mb-6 md:mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: stat cards (GREEN theme) */}
              <div className="space-y-6">
                <div className="group rounded-2xl border border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl">
                  <div className="text-center">
                    <div className="text-green-700 font-medium">Total Participants</div>
                    <div className="mt-2 text-4xl font-extrabold text-green-600">{participants.length}</div>
                  </div>
                </div>
                <div className="group rounded-2xl border border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl">
                  <div className="text-center">
                    <div className="text-green-700 font-medium">Last Updated</div>
                    <div className="mt-2 text-xl font-semibold text-amber-600">26th Oct 2025</div>
                  </div>
                </div>
                {/* Countdown Timer Card */}
                <div className="group rounded-2xl border border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl">
                  <div className="text-center">
                    <div className="text-blue-700 font-medium">Time Remaining</div>
                    <div className="mt-3 text-3xl font-extrabold text-blue-600">
                      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                    </div>
                    <div className="mt-2 text-sm text-slate-700 font-medium">
                      Campaign ends on <span className="text-indigo-700 font-semibold">31st Oct 2025</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right: autoplay carousel with caption (YELLOW theme) */}
              <div className="rounded-2xl border border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-lg overflow-hidden">
                <div className="relative w-full bg-gradient-to-br from-yellow-100 to-amber-100">
                  {slides.map((src, idx) => (
                    <img
                      key={src}
                      src={src}
                      alt={`Swag ${idx + 1}`}
                      className={`absolute inset-0 h-64 sm:h-72 md:h-80 w-full object-contain transition-opacity duration-700 ${idx === current ? 'opacity-100' : 'opacity-0'}`}
                    />
                  ))}
                  <div className="invisible h-64 sm:h-72 md:h-80 w-full" />
                </div>
                <div className="border-t border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50 px-4 py-3 text-center text-sm text-yellow-800">
                  Previous year rewards included exclusive merchandise, certificates, and special recognition for top performers!
                </div>
              </div>
            </section>

            {/* Top Students Tier Cards */}
            <section className="mb-10">
              <div className="max-w-6xl mx-auto rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 via-rose-50 to-red-100 p-6 shadow-lg">
                <h2 className="mb-6 text-center text-2xl font-bold text-slate-800">
                  <span className="font-bold text-red-600">Prize Tiers</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Each card gets hover scale & shadow */}
                  <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center font-semibold mb-3">
                      Tier 1
                    </div>
                    <p className="text-slate-700 text-center">
                      Enables for top <span className="font-bold text-blue-600">100 students</span> who complete this campaign
                    </p>
                  </div>

                  <div className="bg-white border border-green-200 rounded-xl p-6 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                    <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-center font-semibold mb-3">
                      Tier 2
                    </div>
                    <p className="text-slate-700 text-center">
                      Enables for top <span className="font-bold text-green-600">70 students</span> who complete this campaign
                    </p>
                  </div>

                  <div className="bg-white border border-yellow-200 rounded-xl p-6 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                    <div className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-center font-semibold mb-3">
                      Tier 3
                    </div>
                    <p className="text-slate-700 text-center">
                      Enables for top <span className="font-bold text-yellow-600">50 students</span> who complete this campaign
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Search below hero (BLUE theme) */}
            <section className="mb-6 md:mb-10">
                <div className="mx-auto max-w-3xl relative">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search your username..."
                    className="
                      w-full rounded-2xl border border-transparent
                      bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50
                      px-5 py-3 pr-12
                      text-slate-900 placeholder-slate-500
                      shadow-md shadow-blue-100
                      focus:outline-none focus:ring-4 focus:ring-blue-400/40
                      focus:border-blue-400 transition
                      duration-300 ease-in-out
                    "
                  />
                  {/* 🔍 Icon inside input */}
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1111.5 4.5a7.5 7.5 0 015.15 12.15z"
                      />
                    </svg>
                  </div>
                </div>

            </section>

            {loading && (
              <div className="flex items-center justify-center py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-300 border-t-blue-600" />
              </div>
            )}
            {!loading && error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
            )}
            {!loading && !error && (
              <section className="rounded-xl border-2 border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 p-2 sm:p-3 md:p-4 shadow-lg">
                <div className="overflow-x-auto rounded-lg bg-white">
                  <table className="min-w-full table-fixed">
                    <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <tr>
                        <th className="w-16 px-4 py-3 text-left text-sm font-semibold text-blue-800">Rank</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Name</th>
                        <th className="w-28 px-4 py-3 text-left text-sm font-semibold text-blue-800">Skill Badges</th>
                        <th className="w-28 px-4 py-3 text-left text-sm font-semibold text-blue-800">Arcades</th>
                        <th className="w-24 px-4 py-3 text-left text-sm font-semibold text-blue-800">Total</th>
                        <th className="w-40 px-4 py-3 text-left text-sm font-semibold text-blue-800">Profile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((p) => {
                        const key = p.key || p.public_id || p.profile_url || p.name
                        const rank = rankByKey.get(key) || 0
                        const isTop1 = rank === 1
                        const isTop2 = rank === 2
                        const isTop3 = rank === 3
                        const rankBadgeClass = isTop1
                          ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 ring-yellow-300'
                          : isTop2
                          ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 ring-gray-300'
                          : isTop3
                          ? 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 ring-amber-300'
                          : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 ring-blue-300'

                        return (
                          <tr key={key} className="border-t border-blue-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50">
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold ring-1 ${rankBadgeClass}`}>
                                #{rank}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-tr from-blue-500 via-green-500 via-yellow-500 to-red-500 text-white ring-2 ring-blue-200 flex items-center justify-center font-bold">
                                  {p.name?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div>
                                  <div className="font-medium text-slate-900">{p.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center rounded-md bg-gradient-to-r from-green-100 to-emerald-100 px-2 py-1 text-sm font-medium text-green-800 ring-1 ring-inset ring-green-200">
                                {p.courses}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center rounded-md bg-gradient-to-r from-purple-100 to-pink-100 px-2 py-1 text-sm font-medium text-purple-800 ring-1 ring-inset ring-purple-200">
                                {p.arcades}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center rounded-md bg-gradient-to-r from-blue-100 to-indigo-100 px-2 py-1 text-sm font-medium text-blue-800 ring-1 ring-inset ring-blue-200">
                                {p.count}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {p.profile_url ? (
                                <a
                                  href={p.profile_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:from-blue-700 hover:to-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                >
                                  View Profile
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                                    <path fillRule="evenodd" d="M5 10a.75.75 0 0 1 .75-.75h5.69L9.22 7.03a.75.75 0 1 1 1.06-1.06l3.5 3.5a.75.75 0 0 1 0 1.06l-3.5 3.5a.75.75 0 1 1-1.06-1.06l2.22-2.22H5.75A.75.75 0 0 1 5 10Z" clipRule="evenodd" />
                                  </svg>
                                </a>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                      {filtered.length === 0 && (
                        <tr>
                          <td className="px-4 py-12 text-center text-slate-500" colSpan={6}>No participants found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

          
          </main>
          
          
      </div>
      <footer className="w-full border-t border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur py-6 shadow-sm">
            <div className="flex flex-col items-center justify-center gap-3">
              <img src="/gdg_2.png" alt="GDG" className="h-12 w-auto sm:h-14" />
              <div className="text-center text-sm text-slate-700 px-4">
                © {new Date().getFullYear()} GDG On Campus, Nirma University. All rights reserved.
              </div>
            </div>
      </footer>


    </>
  )
}

export default App
