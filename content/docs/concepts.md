---
slug: concepts
title: Product model
summary: Understand operations, occurrences, context, events, steps, dependencies, and meters.
group: Getting started
order: 20
---

Sightglass records only business operations you deliberately mark. Its primary record is an information-dense occurrence rather than a stream of logs, spans, or arbitrary metrics.

## Operations and occurrences

An **operation** is a named unit of work such as checkout, report generation, or a background job. An **occurrence** is one execution with duration, status, context, events, steps, database work, outbound calls, and error details.

## Context, events, and steps

- Context is bounded business metadata attached with `observe.set()`.
- Events are meaningful moments attached with `observe.event()`.
- Steps time named child work attached with `observe.step()`.
- Prisma and native fetch detail are captured only while an observed operation is active.

## Usage meters

`observe.meter()` appends an idempotent usage record to a durable local spool before delivery. The server retains exact meter rows and compact hourly meter totals indefinitely. Sightglass reports usage; it does not price, invoice, or charge customers.

## Deliberate limits

Sightglass is not log aggregation, browser monitoring, infrastructure monitoring, blanket APM auto-instrumentation, a general metrics database, or an incident-management system. Next.js Server Actions are intentionally unsupported; use Route Handlers.
