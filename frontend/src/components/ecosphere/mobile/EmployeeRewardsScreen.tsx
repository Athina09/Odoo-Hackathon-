import { useState } from "react";
import { Gift, CheckCircle2 } from "lucide-react";
import { useEmployeeGamification } from "@/context/EmployeeGamificationContext";
import { rewardCatalog } from "@/data/ecosphere-modules";
import { redeemReward } from "@/lib/ecosphere-employee-store";

export function EmployeeRewardsScreen() {
  const { state, update } = useEmployeeGamification();
  const [redeemedName, setRedeemedName] = useState<string | null>(null);

  const handleRedeem = (rewardId: string, name: string, points: number, stock: number) => {
    const result = redeemReward(state, rewardId, name, points, stock);
    if (result.ok) {
      update(result.state);
      setRedeemedName(name);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="eco-card p-4">
        <div className="text-[11px] uppercase text-[var(--text-secondary)]">Your balance</div>
        <div className="text-3xl font-bold text-[var(--accent-purple)]">{state.points} pts</div>
      </div>

      {redeemedName && (
        <div className="eco-card flex items-start gap-3 border-[var(--accent-teal)] p-4">
          <CheckCircle2 className="h-6 w-6 shrink-0 text-[var(--accent-green)]" />
          <div>
            <div className="font-semibold text-[var(--text-primary)]">Redeemed: {redeemedName}</div>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Show this screen to HR to claim your voucher.
            </p>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Reward catalog</h1>
        <p className="text-sm text-[var(--text-muted)]">Redeem points for perks</p>
      </div>

      <div className="grid gap-3">
        {rewardCatalog.map(reward => (
          <div key={reward.id} className="eco-card p-4 text-center">
            <Gift className="mx-auto h-8 w-8 text-[var(--accent-purple)]" />
            <div className="mt-2 font-semibold">{reward.name}</div>
            <div className="text-sm text-[var(--accent-purple)]">{reward.points} pts</div>
            <div className="text-xs text-[var(--text-muted)]">{reward.stock} in stock</div>
            <button
              type="button"
              disabled={state.points < reward.points || reward.stock <= 0}
              onClick={() => handleRedeem(reward.id, reward.name, reward.points, reward.stock)}
              className="mt-3 w-full rounded-full bg-[var(--accent-teal)] py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              Redeem
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
