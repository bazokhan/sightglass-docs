import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Environment, ServiceName, TimeRange } from "@/data/types";
import { envFactor, rangeFactor } from "@/data/seed";

interface FilterState {
  environment: Environment;
  range: TimeRange;
  service: ServiceName | "all";
  setEnvironment: (v: Environment) => void;
  setRange: (v: TimeRange) => void;
  setService: (v: ServiceName | "all") => void;
  factor: number;
}

const Ctx = createContext<FilterState | null>(null);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [environment, setEnvironment] = useState<Environment>("production");
  const [range, setRange] = useState<TimeRange>("24h");
  const [service, setService] = useState<ServiceName | "all">("all");

  const value = useMemo(
    () => ({
      environment,
      range,
      service,
      setEnvironment,
      setRange,
      setService,
      factor: rangeFactor[range] * envFactor[environment],
    }),
    [environment, range, service],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFilters(): FilterState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFilters must be used inside FiltersProvider");
  return ctx;
}
