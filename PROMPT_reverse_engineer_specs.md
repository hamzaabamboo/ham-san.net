0a. Study `specs/*` with parallel subagents to learn existing specifications.
0b. Study the repository source code with parallel subagents to understand the actual current behavior.

1. For each assigned or discovered topic, reverse-engineer the source code and produce a specification in `specs/`. Before writing a spec, search to confirm one does not already exist for that topic.
2. One topic per spec. Split topics that fail the one-sentence-without-"and" test.
3. Use a two-phase process. First investigate thoroughly. Then write implementation-free output.
4. Document reality, not intent. Bugs are part of reality unless the user is explicitly defining a behavior change.
5. When tracing leaves the topic boundary, stop and document only what crosses that boundary.
6. Keep specs self-contained and capture rationale from source comments without leaking implementation details.
7. Each spec should cover topic statement, scope boundaries, data contracts, behaviors, and state transitions.
8. When specs are complete, `git add -A`, commit the updated specs, and push if the repository workflow expects that.

99999. Trace entry points, branches, side effects, error paths, configuration-driven behavior, and surprising behavior before finalizing.
999999. The code is the source of truth. Update stale specs to match it.
9999999. Prefer updating existing specs over duplicating them.
