export type ServiceName = "api" | "billing-api" | "worker";
export type Environment = "production" | "staging";
export type TimeRange = "1h" | "24h" | "7d";
export type OccurrenceStatus = "ok" | "error";

export interface OperationStat {
  id: string;
  name: string;
  service: ServiceName;
  route?: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  calls: number;
  errorRate: number; // 0..1
  p50: number;
  p95: number;
  p99: number;
  dbShare: number; // 0..1 of total time
  dbMs: number; // avg db ms per call
  usage?: { meter: string; total: number; unit: string };
  topFailures: { reason: string; count: number; share: number }[];
  breakdown: { label: string; ms: number }[];
  contextBreakdown?: { label: string; rows: { key: string; calls: number; errorRate: number }[] };
  description: string;
}

export interface SpanNode {
  id: string;
  label: string;
  kind: "operation" | "step" | "db" | "http" | "service";
  ms: number;
  offset: number;
  status?: OccurrenceStatus;
  detail?: string;
  children?: SpanNode[];
}

export interface OccurrenceEvent {
  name: string;
  atMs: number;
  attrs: Record<string, string | number | boolean>;
  level?: "info" | "warn" | "error";
}

export interface Occurrence {
  id: string;
  operationId: string;
  operation: string;
  service: ServiceName;
  environment: Environment;
  status: OccurrenceStatus;
  httpStatus: number;
  method: string;
  route: string;
  durationMs: number;
  timestamp: string;
  tenantId: string;
  tenantName: string;
  userId: string;
  plan: string;
  requestId: string;
  attributes: Record<string, string | number | boolean>;
  events: OccurrenceEvent[];
  error?: { type: string; message: string; where: string };
  db: { queries: number; totalMs: number; slowest: { name: string; ms: number }[] };
  dependencies: { name: string; ms: number; status: string }[];
  meters?: { name: string; quantity: number }[];
  root: SpanNode;
}

export interface QueryStat {
  id: string;
  name: string;
  model: string;
  kind: string;
  calls: number;
  avgMs: number;
  p95Ms: number;
  totalMs: number;
  topOperation: string;
  callers: { operation: string; calls: number; share: number }[];
  slowest: { occurrenceId: string; ms: number; operation: string; when: string }[];
  note?: string;
}

export interface MeterRow {
  id: string;
  meter: string;
  label: string;
  unit: string;
  today: number;
  month: number;
  prevMonth: number;
  tenants: { tenantId: string; name: string; plan: string; quantity: number; quota?: number }[];
}

export interface SecurityEvent {
  id: string;
  kind: "unauthorized" | "forbidden" | "reported";
  code: number | string;
  route: string;
  method: string;
  service: ServiceName;
  count?: number;
  tenant?: string;
  user?: string;
  ip: string;
  when: string;
  occurrenceId?: string;
  note?: string;
}

export interface ServiceHealth {
  service: ServiceName;
  status: "healthy" | "degraded";
  cpu: number;
  memoryMb: number;
  memoryLimitMb: number;
  uptime: string;
  eventLoopLagMs: number;
  restarts: number;
  instances: number;
}
