// Simulates inserts flowing through a constraint-validation pipeline:
// PRIMARY KEY -> NOT NULL -> UNIQUE -> CHECK, stopping at the first
// stage that rejects the row.

const STAGES = ['PK', 'NOT NULL', 'UNIQUE', 'CHECK']

const EXISTING_ROWS = [
  { id: 1, name: 'Riya', email: 'riya@mail.com', age: 20 },
  { id: 2, name: 'Sam', email: 'sam@mail.com', age: 22 },
]

function attemptInsert(row, failStage) {
  const failIndex = failStage ? STAGES.indexOf(failStage) : -1
  return { row, failIndex, failStage }
}

const ATTEMPTS = [
  {
    label: "INSERT (3, 'Dev', 'dev@mail.com', 21)",
    row: { id: 3, name: 'Dev', email: 'dev@mail.com', age: 21 },
    reasonByStage: {},
    result: attemptInsert({ id: 3, name: 'Dev', email: 'dev@mail.com', age: 21 }, null),
    verdictText: 'All four checks pass — id is new, name is present, email is unused, and age is non-negative. The row is inserted.',
  },
  {
    label: "INSERT (2, 'Neha', 'neha@mail.com', 19)",
    row: { id: 2, name: 'Neha', email: 'neha@mail.com', age: 19 },
    result: attemptInsert({ id: 2, name: 'Neha', email: 'neha@mail.com', age: 19 }, 'PK'),
    verdictText: 'id = 2 already belongs to Sam. The PRIMARY KEY constraint requires every id to be unique, so this row is rejected immediately — the other checks never even run.',
  },
  {
    label: "INSERT (4, NULL, 'x@mail.com', 20)",
    row: { id: 4, name: null, email: 'x@mail.com', age: 20 },
    result: attemptInsert({ id: 4, name: null, email: 'x@mail.com', age: 20 }, 'NOT NULL'),
    verdictText: 'The PK check passes (id = 4 is new), but the name column is NULL. The NOT NULL constraint on name rejects the row here.',
  },
  {
    label: "INSERT (5, 'Zoya', 'sam@mail.com', 23)",
    row: { id: 5, name: 'Zoya', email: 'sam@mail.com', age: 23 },
    result: attemptInsert({ id: 5, name: 'Zoya', email: 'sam@mail.com', age: 23 }, 'UNIQUE'),
    verdictText: "id and name both pass, but 'sam@mail.com' is already used by Sam's row. The UNIQUE constraint on email rejects this insert.",
  },
  {
    label: "INSERT (6, 'Arjun', 'arjun@mail.com', -5)",
    row: { id: 6, name: 'Arjun', email: 'arjun@mail.com', age: -5 },
    result: attemptInsert({ id: 6, name: 'Arjun', email: 'arjun@mail.com', age: -5 }, 'CHECK'),
    verdictText: 'id, name and email all pass. But the table has a CHECK (age >= 0) constraint, and -5 violates it — this is the only stage that inspects the actual value, not just its presence or uniqueness.',
  },
]

export function buildKeysConstraintsSteps() {
  const steps = []
  let rows = [...EXISTING_ROWS]

  steps.push({
    title: 'Table with constraints defined',
    explanation:
      'This Students table has: PRIMARY KEY on id, NOT NULL on name, UNIQUE on email, and CHECK (age >= 0). Every INSERT must pass all four checks, in order, before the row is written.',
    state: { stages: STAGES, rows: [...rows], attemptRow: null, activeStageIndex: -1, verdict: null, verdictText: '' },
  })

  for (const attempt of ATTEMPTS) {
    const { row, failIndex } = attempt.result
    const lastStage = failIndex === -1 ? STAGES.length - 1 : failIndex

    for (let stageIndex = 0; stageIndex <= lastStage; stageIndex += 1) {
      const isFailingHere = stageIndex === failIndex
      steps.push({
        title: `${attempt.label} — checking ${STAGES[stageIndex]}`,
        explanation: isFailingHere
          ? attempt.verdictText
          : `Checking the ${STAGES[stageIndex]} constraint for this row... it passes, so validation continues to the next stage.`,
        state: {
          stages: STAGES,
          rows: [...rows],
          attemptRow: row,
          activeStageIndex: stageIndex,
          verdict: isFailingHere ? 'reject' : stageIndex === STAGES.length - 1 && failIndex === -1 ? 'accept' : 'checking',
          verdictText: isFailingHere ? attempt.verdictText : '',
        },
      })
    }

    if (failIndex === -1) {
      rows = [...rows, row]
      steps.push({
        title: `${attempt.label} — accepted`,
        explanation: attempt.verdictText,
        state: { stages: STAGES, rows: [...rows], attemptRow: row, activeStageIndex: STAGES.length - 1, verdict: 'accept', verdictText: attempt.verdictText },
      })
    }
  }

  steps.push({
    title: 'Final table state',
    explanation:
      `Out of 5 insert attempts, only 1 succeeded. The table now has ${rows.length} rows. Every rejected insert left the table completely unchanged — constraints protect the data even when the application sends a bad request.`,
    state: { stages: STAGES, rows: [...rows], attemptRow: null, activeStageIndex: -1, verdict: null, verdictText: '' },
  })

  return steps
}

export const keysConstraintsNotes = {
  what: 'Keys and constraints are rules the database enforces on every write: PRIMARY KEY (unique, non-null row identifier), FOREIGN KEY (must reference an existing row elsewhere), UNIQUE, NOT NULL, and CHECK (a custom boolean condition on a value).',
  why: 'Without constraints, invalid data (duplicate IDs, missing required fields, impossible values) can silently enter the database, corrupting every feature built on top of it later. Constraints reject bad data at the moment it\'s written, which is far cheaper than cleaning it up afterward.',
  how: 'On every INSERT or UPDATE, the engine checks each declared constraint in turn. The first constraint that fails aborts the entire statement — none of it is applied, not even partially.',
  observe: 'Watch how each failing insert stops at a different stage depending on what\'s actually wrong with it, and how a row that fails any single check leaves the table completely untouched.',
  outcome: 'Only the one fully valid row makes it into the table; every invalid attempt is rejected with the table left exactly as it was before.',
  points: [
    'A PRIMARY KEY is both UNIQUE and NOT NULL by definition — it\'s really two constraints in one.',
    'CHECK constraints are the only ones in this example that look at the actual value rather than just presence/uniqueness.',
    'Constraint checks are typically cheap because PRIMARY KEY and UNIQUE columns are automatically indexed — checking for a duplicate is an index lookup, not a full table scan.',
  ],
  complexity: 'A PK/UNIQUE check against an indexed column is roughly O(log n); a CHECK constraint on a single value being inserted is O(1) since it only examines that one row.',
  realWorld: 'That "email already in use" error you see when signing up for almost any website is a UNIQUE constraint violation being caught and turned into a friendly message by the application.',
}
