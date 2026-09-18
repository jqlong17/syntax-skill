# 2. Dependency Structure For Tasks

## Source-grounded idea

Chapter 3 models a sentence as a dependency structure in which heads determine broad semantic categories and dependents refine them. The chapter also treats combinatorial rules, argument structure, ambiguity, and long-distance dependencies as structured relations rather than a flat word string.

## Agent application

Represent a request as a graph of dependencies: a goal has actors, objects, parameters, constraints, prerequisites, tools, and expected evidence. This graph should be the contract between language understanding and execution.

## Agent card

- **Trigger**: a request contains multiple entities, constraints, steps, or ambiguous attachments.
- **State fields**: typed nodes, typed edges, unresolved dependencies, required arguments, evidence requirements.
- **Invariant**: every executable action has its required arguments and a traceable parent goal.
- **Decision policy**: branch when attachments are ambiguous; block when a required dependency is missing; compile only complete subgraphs.
- **Failure recovery**: mark the unresolved edge, ask one targeted question, and preserve existing candidates.
- **Minimum test**: remove one argument, duplicate one entity, and introduce one conflicting constraint; verify that the graph exposes each defect.

## Design rules

- Use typed nodes for entities, actions, constraints, resources, and outputs.
- Use typed edges such as `requires`, `acts_on`, `depends_on`, `contradicts`, and `verified_by`.
- Keep argument roles separate from optional modifiers.
- Store unresolved edges explicitly instead of silently guessing them.
- Compile the graph into a task plan only after required arguments and constraints are present.

## Review checklist

- Does every action have its required arguments?
- Are modifiers distinguishable from task-critical constraints?
- Can two interpretations of the same utterance be represented without overwriting one another?
- Is the execution plan traceable back to the dependency graph?

## Source locator

Gibson, Ch. 3, sec. 3.1, pp. 51-53, `OEBPS/xhtml/chapter_3.xhtml#hsec3-1` near `#pg_51`; sec. 3.3, pp. 56-61, `#hsec3-3`; sec. 3.16, pp. 86-88, `#hsec3-16`; sec. 3.18-3.19, pp. 90-98, `#hsec3-18` and `#hsec3-19`. Retrieve `heads`, `dependents`, `argument structure`, `ambiguity`, and `long-distance dependency`.
