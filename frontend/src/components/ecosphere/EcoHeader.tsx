import { Search, Sparkles, Bell, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EcoHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-[rgba(59,130,246,0.25)] bg-[#0B1120]/90 px-5 backdrop-blur-md">
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-sm font-bold tracking-wide text-[#22C55E]">EcoSphere</span>
        <span className="hidden text-[10px] uppercase tracking-[0.2em] text-slate-500 sm:inline">Executive Command</span>
      </div>

      <div className="relative mx-auto flex max-w-xl flex-1 items-center">
        <Search className="absolute left-3 h-4 w-4 text-slate-500" />
        <Input
          placeholder="Search employee, department, policy, challenge, audit, carbon…"
          className="h-9 border-[rgba(59,130,246,0.25)] bg-[#111827] pl-9 text-sm text-slate-200 placeholder:text-slate-600 focus-visible:ring-[#22C55E]/40"
        />
      </div>

      <button
        type="button"
        className="hidden items-center gap-1.5 rounded-lg border border-[#22C55E]/40 bg-[#22C55E]/10 px-3 py-1.5 text-xs font-semibold text-[#22C55E] transition hover:bg-[#22C55E]/20 sm:flex"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Ask EcoSphere AI
      </button>

      <div className="flex items-center gap-2">
        <Select defaultValue="all">
          <SelectTrigger className="h-8 w-[110px] border-[rgba(59,130,246,0.25)] bg-[#111827] text-xs">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sites</SelectItem>
            <SelectItem value="south">South India</SelectItem>
            <SelectItem value="west">West India</SelectItem>
          </SelectContent>
        </Select>
        <button type="button" className="relative grid h-8 w-8 place-items-center rounded-lg border border-[rgba(59,130,246,0.25)] bg-[#111827] text-slate-400 hover:text-[#06B6D4]">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
        </button>
        <button type="button" className="flex items-center gap-1 rounded-lg border border-[rgba(59,130,246,0.25)] bg-[#111827] px-2 py-1 text-xs text-slate-300">
          Athina <ChevronDown className="h-3 w-3 text-slate-500" />
        </button>
      </div>
    </header>
  );
}
