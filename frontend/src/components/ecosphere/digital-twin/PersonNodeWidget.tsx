import type { CSSProperties, PointerEvent } from "react";
import { HardHat, Leaf, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  UNIT_BLUE,
  UNIT_LABEL,
  type TwinCsrActivityNode,
  type TwinPersonNode,
} from "@/lib/digital-twin-people";

export function PersonNodeWidget({
  person,
  borderColor,
  selected,
  onSelect,
  onPointerDown,
  style,
}: {
  person: TwinPersonNode;
  borderColor: string;
  selected?: boolean;
  onSelect?: () => void;
  onPointerDown?: (e: PointerEvent) => void;
  style?: CSSProperties;
}) {
  const isVolunteer = Boolean(person.assignedActivityId);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onPointerDown={onPointerDown}
      className={cn(
        "dt-person-node absolute z-30 w-[88px] cursor-grab select-none rounded-md p-1.5 active:cursor-grabbing",
        selected && "ring-1 ring-[#3B82F6]",
      )}
      style={{
        ...style,
        background: "linear-gradient(145deg, #1a2438 0%, #141c2e 100%)",
        border: `1px solid ${borderColor}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
      }}
    >
      <div className="flex items-center gap-1.5">
        <div
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[8px] font-bold"
          style={{ background: `${borderColor}22`, color: UNIT_BLUE, border: `1px solid ${borderColor}55` }}
        >
          {person.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[9px] font-medium text-white/90">{person.name}</div>
          <div className="flex items-center gap-0.5 truncate text-[7px]" style={{ color: UNIT_LABEL }}>
            <User className="h-2 w-2 shrink-0" style={{ color: UNIT_BLUE }} strokeWidth={1.5} />
            {person.role}
          </div>
        </div>
      </div>
      <div className="mt-0.5 truncate text-[7px]" style={{ color: UNIT_LABEL }}>
        {person.dept}
        {isVolunteer && " · Volunteer"}
      </div>
    </div>
  );
}

export function CsrActivityNodeWidget({
  node,
  selected,
  onSelect,
  onPointerDown,
  style,
}: {
  node: TwinCsrActivityNode;
  selected?: boolean;
  onSelect?: () => void;
  onPointerDown?: (e: PointerEvent) => void;
  style?: CSSProperties;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onPointerDown={onPointerDown}
      className={cn(
        "dt-csr-node absolute z-30 w-[100px] cursor-grab select-none rounded-md p-1.5 active:cursor-grabbing",
        selected && "ring-1 ring-[#3B82F6]",
      )}
      style={{
        ...style,
        background: "linear-gradient(145deg, #1a2830 0%, #142028 100%)",
        border: "1px solid #22C55E55",
        boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
      }}
    >
      <div className="flex items-center gap-1">
        <Leaf className="h-3 w-3 shrink-0" style={{ color: "#22C55E" }} strokeWidth={1.5} />
        <span className="text-[7px] font-semibold uppercase tracking-wider text-[#22C55E]">CSR</span>
      </div>
      <div className="mt-0.5 flex items-start gap-1">
        <HardHat className="mt-0.5 h-2 w-2 shrink-0 opacity-0" />
        <span className="text-[8px] leading-tight text-white/85">{node.name}</span>
      </div>
    </div>
  );
}
