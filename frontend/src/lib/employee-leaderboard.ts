import { leaderboardRows } from "@/data/ecosphere-modules";

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  department: string;
  xp: number;
  isCurrentUser?: boolean;
}

const EXTENDED_ORG = [
  ...leaderboardRows,
  { id: "lb6", name: "S. Rao", department: "IT", xp: 1950 },
  { id: "lb7", name: "Priya K.", department: "HR", xp: 1720 },
  { id: "lb8", name: "Vikram S.", department: "Operations", xp: 1580 },
  { id: "lb9", name: "Anitha R.", department: "Finance", xp: 1420 },
  { id: "lb10", name: "Karthik M.", department: "Manufacturing", xp: 1310 },
  { id: "lb11", name: "Lakshmi P.", department: "Transport", xp: 1260 },
];

export function buildLeaderboardWithUser(user: {
  name: string;
  department: string;
  xp: number;
}): LeaderboardEntry[] {
  const withoutUser = EXTENDED_ORG.filter(
    r => r.name.toLowerCase() !== user.name.toLowerCase(),
  );
  const merged = [
    ...withoutUser,
    { id: "current-user", name: user.name, department: user.department, xp: user.xp },
  ];
  return merged
    .sort((a, b) => b.xp - a.xp)
    .map((row, index) => ({
      ...row,
      rank: index + 1,
      isCurrentUser: row.name.toLowerCase() === user.name.toLowerCase(),
    }));
}

export function getUserLeaderboardContext(
  entries: LeaderboardEntry[],
  userName: string,
) {
  const user = entries.find(e => e.name.toLowerCase() === userName.toLowerCase());
  if (!user) return null;
  const above = entries.find(e => e.rank === user.rank - 1);
  const below = entries.find(e => e.rank === user.rank + 1);
  const top = entries[0];
  return {
    user,
    xpToNextRank: above ? above.xp - user.xp + 1 : 0,
    nextRank: above?.rank ?? user.rank,
    leaderXp: top?.xp ?? user.xp,
    pctOfLeader: top ? Math.round((user.xp / top.xp) * 100) : 100,
    above,
    below,
  };
}
