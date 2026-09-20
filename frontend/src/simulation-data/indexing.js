// Compares a full table scan against an index lookup for the same query:
// find the row where id = 8, in a 10-row table.

const TABLE = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, name: `User${i + 1}` }))
const TARGET_ID = 8

export function buildIndexingSteps() {
  const steps = []

  steps.push({
    title: 'Query: find the row where id = 8',
    explanation:
      "We'll run the same query — SELECT * FROM Users WHERE id = 8 — twice: once with no index (a full scan), and once using an index, to see exactly why indexes matter.",
    state: { mode: 'intro', scanIndex: -1, comparisons: 0, found: false, indexHops: [] },
  })

  for (let i = 0; i < TABLE.length; i += 1) {
    const isMatch = TABLE[i].id === TARGET_ID
    steps.push({
      title: `Without index — scanning row ${i + 1} (id = ${TABLE[i].id})`,
      explanation: isMatch
        ? `Row ${i + 1} has id = ${TARGET_ID} — match found! Without an index, the engine had to check ${i + 1} rows one by one, in the worst case checking every single row in the table.`
        : `Without an index, the database has no way to know where id = ${TARGET_ID} lives — it must check every row in order. Row ${i + 1} has id = ${TABLE[i].id}, which doesn't match, so it moves to the next row.`,
      state: { mode: 'scan', scanIndex: i, comparisons: i + 1, found: isMatch, indexHops: [] },
    })
    if (isMatch) break
  }

  steps.push({
    title: 'Now, the same query — with an index on id',
    explanation:
      "An index is a separate, sorted structure that maps key values to row locations — think of it like a book's index instead of reading every page. Here it's a small sorted array of (id → row location) pairs.",
    state: { mode: 'index-intro', scanIndex: -1, comparisons: 0, found: false, indexHops: [] },
  })

  // Binary search over the sorted index for TARGET_ID
  let lo = 0
  let hi = TABLE.length - 1
  const hops = []
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    hops.push(mid)
    const midId = TABLE[mid].id
    if (midId === TARGET_ID) {
      steps.push({
        title: `Index lookup — check middle entry (id = ${midId})`,
        explanation: `The index is sorted, so the engine can binary-search it. It checks the middle entry: id = ${midId}. That's our target — the index tells the engine exactly where this row lives, no scanning required.`,
        state: { mode: 'index', scanIndex: -1, comparisons: hops.length, found: true, indexHops: [...hops], targetId: TARGET_ID },
      })
      break
    }
    steps.push({
      title: `Index lookup — check middle entry (id = ${midId})`,
      explanation: midId < TARGET_ID
        ? `id = ${midId} is less than ${TARGET_ID}, so the target (if it exists) must be in the right half of the index. The engine discards the entire left half in one step.`
        : `id = ${midId} is greater than ${TARGET_ID}, so the target must be in the left half of the index. The engine discards the entire right half in one step.`,
      state: { mode: 'index', scanIndex: -1, comparisons: hops.length, found: false, indexHops: [...hops], targetId: TARGET_ID },
    })
    if (midId < TARGET_ID) lo = mid + 1
    else hi = mid - 1
  }

  const scanComparisons = TABLE.findIndex((r) => r.id === TARGET_ID) + 1
  steps.push({
    title: 'Why the index wins',
    explanation:
      `The full scan needed ${scanComparisons} comparisons to find id = ${TARGET_ID}. The index found it in ${hops.length} comparisons using binary search. On a 10-row table the difference is small, but on a table with a million rows, a scan could take up to a million comparisons while an index takes about 20 — that gap only grows.`,
    state: { mode: 'summary', scanIndex: -1, comparisons: 0, found: false, indexHops: [], scanComparisons, indexComparisons: hops.length },
  })

  return steps
}

export const TABLE_DATA = TABLE
export const TARGET = TARGET_ID

export const indexingNotes = {
  what: 'An index is an auxiliary data structure (commonly a B-tree) that maps column values to the physical location of the matching rows, letting the database find rows without checking every one.',
  why: 'Without an index, any WHERE clause on a large table forces a full table scan — checking every row, one by one. As tables grow to millions of rows, that becomes far too slow for interactive queries.',
  how: 'The database maintains a sorted structure of (indexed value → row pointer) pairs. A lookup uses binary search (or B-tree traversal) on that structure instead of scanning the table itself, jumping straight to the relevant rows.',
  observe: 'Compare the comparison counters between the two runs — the scan\'s counter climbs by exactly 1 per row until it hits the match, while the index\'s counter roughly halves the remaining search space every single step.',
  outcome: 'Both approaches find the same row, but the index does it in far fewer comparisons — and that gap widens dramatically as the table grows.',
  points: [
    'Indexes speed up reads but add overhead to writes — every INSERT/UPDATE/DELETE must also update the index.',
    'An index only helps if the query actually filters or sorts on the indexed column(s) — an index on `name` won\'t help a query filtering on `id`.',
    'Primary keys and UNIQUE columns get an index automatically in most databases; other columns need an explicit CREATE INDEX.',
  ],
  complexity: 'A full scan is O(n). An index lookup (via a balanced structure) is O(log n) — for a million rows that\'s roughly 1,000,000 vs about 20 comparisons.',
  realWorld: 'Slow queries in production are extremely often solved by adding the right index — it\'s usually the single highest-leverage database performance fix available.',
}
