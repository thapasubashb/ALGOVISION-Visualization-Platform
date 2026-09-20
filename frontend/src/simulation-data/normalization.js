// Walks a StudentCourse table through 1NF, 2NF and 3NF, decomposing it
// at each stage using a real (if small) example.

export function buildNormalizationSteps() {
  const steps = []

  steps.push({
    title: 'Unnormalized table (UNF)',
    explanation:
      'This table stores each student once, with all their enrolled courses crammed into a single "courses" cell as a comma-separated list. This repeating group makes the data hard to query — you can\'t easily ask "who is enrolled in Networks?" with plain SQL.',
    state: {
      stage: 'UNF',
      unf: [
        { studentId: 1, name: 'Aditi', courses: 'DS101, CN102', instructor: 'DS101: Rao, CN102: Mehta' },
        { studentId: 2, name: 'Rohan', courses: 'CN102', instructor: 'CN102: Mehta' },
      ],
      firstNF: null, secondNF: null, thirdNF: null,
    },
  })

  steps.push({
    title: '1NF — atomic values, one course per row',
    explanation:
      'First Normal Form requires every column to hold a single, atomic value — no comma-separated lists. We split each multi-course row into multiple rows, one per (student, course) pair. Now every cell holds exactly one value.',
    state: {
      stage: '1NF',
      unf: null,
      firstNF: [
        { studentId: 1, name: 'Aditi', courseId: 'DS101', instructor: 'Rao' },
        { studentId: 1, name: 'Aditi', courseId: 'CN102', instructor: 'Mehta' },
        { studentId: 2, name: 'Rohan', courseId: 'CN102', instructor: 'Mehta' },
      ],
      secondNF: null, thirdNF: null,
    },
  })

  steps.push({
    title: '1NF has a partial dependency',
    explanation:
      "The primary key here is the combination (studentId, courseId). But 'name' only depends on studentId — not on the full key — and it's now duplicated across rows (Aditi's name appears twice). This is a partial dependency: an attribute depending on only part of a composite key.",
    state: {
      stage: '1NF-highlight',
      unf: null,
      firstNF: [
        { studentId: 1, name: 'Aditi', courseId: 'DS101', instructor: 'Rao' },
        { studentId: 1, name: 'Aditi', courseId: 'CN102', instructor: 'Mehta' },
        { studentId: 2, name: 'Rohan', courseId: 'CN102', instructor: 'Mehta' },
      ],
      secondNF: null, thirdNF: null,
      highlightCol: 'name',
    },
  })

  steps.push({
    title: '2NF — remove the partial dependency',
    explanation:
      'Second Normal Form removes partial dependencies by splitting the table: Student(studentId, name) holds student data on its own, and Enrollment(studentId, courseId, instructor) holds the enrollment facts. "name" is no longer duplicated.',
    state: {
      stage: '2NF',
      unf: null,
      firstNF: null,
      secondNF: {
        student: [{ studentId: 1, name: 'Aditi' }, { studentId: 2, name: 'Rohan' }],
        enrollment: [
          { studentId: 1, courseId: 'DS101', instructor: 'Rao' },
          { studentId: 1, courseId: 'CN102', instructor: 'Mehta' },
          { studentId: 2, courseId: 'CN102', instructor: 'Mehta' },
        ],
      },
      thirdNF: null,
    },
  })

  steps.push({
    title: '2NF still has a transitive dependency',
    explanation:
      "In Enrollment, the key is (studentId, courseId). But 'instructor' actually depends only on courseId (each course has one instructor), not on the student. This is a transitive dependency: instructor depends on courseId, which depends on the key — not directly on the key itself. Notice 'Mehta' is duplicated for CN102.",
    state: {
      stage: '2NF-highlight',
      unf: null, firstNF: null,
      secondNF: {
        student: [{ studentId: 1, name: 'Aditi' }, { studentId: 2, name: 'Rohan' }],
        enrollment: [
          { studentId: 1, courseId: 'DS101', instructor: 'Rao' },
          { studentId: 1, courseId: 'CN102', instructor: 'Mehta' },
          { studentId: 2, courseId: 'CN102', instructor: 'Mehta' },
        ],
      },
      thirdNF: null,
      highlightCol: 'instructor',
    },
  })

  steps.push({
    title: '3NF — remove the transitive dependency',
    explanation:
      'Third Normal Form removes transitive dependencies: Course(courseId, instructor) is split out on its own. Enrollment now only holds (studentId, courseId) — a pure junction table. Every non-key column in every table now depends directly on that table\'s own key, and nothing else.',
    state: {
      stage: '3NF',
      unf: null, firstNF: null, secondNF: null,
      thirdNF: {
        student: [{ studentId: 1, name: 'Aditi' }, { studentId: 2, name: 'Rohan' }],
        course: [{ courseId: 'DS101', instructor: 'Rao' }, { courseId: 'CN102', instructor: 'Mehta' }],
        enrollment: [{ studentId: 1, courseId: 'DS101' }, { studentId: 1, courseId: 'CN102' }, { studentId: 2, courseId: 'CN102' }],
      },
    },
  })

  return steps
}

export const normalizationNotes = {
  what: 'Normalization is the process of organizing tables to reduce data duplication and avoid update anomalies, by progressively enforcing rules called normal forms (1NF, 2NF, 3NF, and beyond).',
  why: 'An unnormalized or under-normalized table duplicates data (like an instructor\'s name repeated for every student in their course). That duplication means one fact can go out of sync — update the instructor in one row and forget another, and now the data contradicts itself.',
  how: '1NF removes repeating groups so every cell holds one atomic value. 2NF removes partial dependencies (a non-key column depending on only part of a composite key). 3NF removes transitive dependencies (a non-key column depending on another non-key column instead of the key itself).',
  observe: 'Watch which column gets highlighted as duplicated right before each split, and how that exact column moves into its own table in the next step — the highlight is always the reason for the following decomposition.',
  outcome: 'Three clean 3NF tables — Student, Course, and Enrollment — where every fact is stored exactly once.',
  points: [
    'Each step exists to fix one specific kind of duplication — normalization isn\'t an arbitrary set of rules, it\'s a direct response to a data anomaly.',
    'Fully normalized schemas avoid update/insert/delete anomalies, but often need JOINs to reassemble the original view — a tradeoff against pure read speed.',
    'Real systems sometimes deliberately denormalize (undo some of this) for read-heavy workloads, once they understand the tradeoff.',
  ],
  complexity: 'Normalization is a design-time process, not a runtime algorithm — but its payoff is at runtime: it turns an O(n) "update every duplicate row" operation into an O(1) update of a single row.',
  realWorld: 'Almost any real schema — e-commerce orders/products, social media posts/tags, this very AlgoVision app\'s users/progress tables — follows these same normalization principles to avoid duplicated, inconsistent data.',
}
