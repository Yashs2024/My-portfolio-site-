import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Star, BookOpen, Users, GitFork, Loader2, AlertCircle } from 'lucide-react';

/* ─── Types ─────────────────────────────────────────────────── */
interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
  name: string;
  bio: string;
}

interface Repo {
  stargazers_count: number;
  language: string | null;
  fork: boolean;
}

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionData {
  contributions: ContributionDay[];
  total: { [year: string]: number } | number;
}

/* ─── Helpers ───────────────────────────────────────────────── */
const GITHUB_USER = 'Yashs2024';

const LANG_COLORS: Record<string, string> = {
  TypeScript:  '#3178c6',
  JavaScript:  '#f1e05a',
  Python:      '#3572A5',
  'C++':       '#f34b7d',
  C:           '#555555',
  HTML:        '#e34c26',
  CSS:         '#563d7c',
  Rust:        '#dea584',
  Go:          '#00ADD8',
  Java:        '#b07219',
};

function getColor(count: number, max: number): string {
  if (count === 0) return 'bg-slate-800';
  const level = count / max;
  if (level < 0.25) return 'bg-emerald-900';
  if (level < 0.50) return 'bg-emerald-700';
  if (level < 0.75) return 'bg-emerald-500';
  return 'bg-emerald-400';
}

/* ─── Component ─────────────────────────────────────────────── */
const GitHubStats: React.FC = () => {
  const [user, setUser]             = useState<GitHubUser | null>(null);
  const [repos, setRepos]           = useState<Repo[]>([]);
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);

        const [userRes, reposRes, contribRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USER}`),
          fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`),
          fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`),
        ]);

        if (!userRes.ok) throw new Error('GitHub API rate limited or user not found.');

        const userData: GitHubUser = await userRes.json();
        const repoData: Repo[]     = reposRes.ok ? await reposRes.json() : [];
        const contribData: ContributionData = contribRes.ok ? await contribRes.json() : { contributions: [] };

        setUser(userData);
        setRepos(repoData);
        setContributions(Array.isArray(contribData.contributions) ? contribData.contributions : []);
      } catch (err: any) {
        setError(err.message ?? 'Failed to load GitHub data.');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  /* ── Derived stats ── */
  const totalStars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);
  const totalForks = repos.filter(r => r.fork).length;

  const langMap: Record<string, number> = {};
  repos.forEach(r => { if (r.language) langMap[r.language] = (langMap[r.language] ?? 0) + 1; });
  const topLangs = Object.entries(langMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const totalLangRepos = topLangs.reduce((s, [, c]) => s + c, 0);

  /* ── Heatmap — last 26 weeks (6 months) ── */
  const heatmapDays = contributions.slice(-7 * 26);
  const maxCount = Math.max(...heatmapDays.map(d => d.contributionCount), 1);

  // Group into weeks for grid layout
  const weeks: ContributionDay[][] = [];
  for (let i = 0; i < heatmapDays.length; i += 7) {
    weeks.push(heatmapDays.slice(i, i + 7));
  }

  const totalContribs = contributions.reduce((s, d) => s + d.contributionCount, 0);

  /* ── Loading / Error states ── */
  if (loading) return (
    <div className="flex items-center justify-center gap-3 py-12 text-gray-500">
      <Loader2 className="w-5 h-5 animate-spin text-cyan-500" />
      <span className="text-sm font-mono">Loading GitHub stats…</span>
    </div>
  );

  if (error || !user) return (
    <div className="flex items-center justify-center gap-3 py-8 text-gray-500">
      <AlertCircle className="w-5 h-5 text-amber-500" />
      <span className="text-sm font-mono text-amber-400/80">{error ?? 'No data available.'}</span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="mt-12 w-full bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.07)]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-800">
        <Github className="w-5 h-5 text-cyan-400" />
        <span className="font-tech text-sm font-semibold text-white tracking-wider">LIVE GITHUB STATS</span>
        <span className="ml-auto text-xs text-gray-600 font-mono">@{GITHUB_USER}</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Live" />
      </div>

      <div className="p-6 space-y-6">
        {/* ── Stat cards row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, label: 'Repositories', value: user.public_repos, color: 'text-cyan-400' },
            { icon: Star,     label: 'Stars Earned',  value: totalStars,        color: 'text-amber-400' },
            { icon: Users,    label: 'Followers',     value: user.followers,    color: 'text-violet-400' },
            { icon: GitFork,  label: 'Contributions', value: totalContribs,     color: 'text-emerald-400' },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.04 }}
              className="bg-slate-800/50 rounded-xl p-4 border border-white/5 hover:border-cyan-500/20 transition-colors text-center"
            >
              <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
              <div className={`text-2xl font-bold font-tech ${color}`}>{value.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1 font-mono">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom row: languages + heatmap ── */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

          {/* Language bars */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">Top Languages</h4>
            {topLangs.map(([lang, count], i) => {
              const pct = Math.round((count / totalLangRepos) * 100);
              const color = LANG_COLORS[lang] ?? '#6b7280';
              return (
                <motion.div
                  key={lang}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-1.5 text-gray-300">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                      {lang}
                    </span>
                    <span className="text-gray-500 font-mono">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      transition={{ delay: i * 0.08 + 0.2, duration: 0.6, ease: 'easeOut' }}
                      viewport={{ once: true }}
                      className="h-full rounded-full"
                      style={{ background: color }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Contribution heatmap */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">
              Contribution Activity
              <span className="ml-2 text-emerald-400 font-semibold">{totalContribs.toLocaleString()} contributions</span>
            </h4>
            <div className="overflow-x-auto">
              <div className="flex gap-[3px] min-w-max">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {week.map((day, di) => (
                      <div
                        key={di}
                        title={`${day.date}: ${day.contributionCount} contributions`}
                        className={`w-[10px] h-[10px] rounded-sm ${getColor(day.contributionCount, maxCount)} transition-transform hover:scale-125 cursor-default`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-1.5 mt-3">
              <span className="text-xs text-gray-600 font-mono mr-1">Less</span>
              {['bg-slate-800', 'bg-emerald-900', 'bg-emerald-700', 'bg-emerald-500', 'bg-emerald-400'].map((cls, i) => (
                <div key={i} className={`w-[10px] h-[10px] rounded-sm ${cls}`} />
              ))}
              <span className="text-xs text-gray-600 font-mono ml-1">More</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GitHubStats;
