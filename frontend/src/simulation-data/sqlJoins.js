// Builds the step-by-step state for the SQL JOIN simulation: two sample
// tables (Students, Courses) joined on Students.courseId = Courses.id,
// for whichever join type is selected.

export const STUDENTS = [
  { id: 1, name: 'Aditi', courseId: 101 },
  { id: 2, name: 'Rohan', courseId: 102 },
  { id: 3, name: 'Meera', courseId: null },
  { id: 4, name: 'Karan', courseId: 104 },
]

export const COURSES = [
  { id: 101, title: 'Data Structures' },
  { id: 102, title: 'Computer Networks' },
  { id: 103, title: 'Operating Systems' },
]

export const JOIN_TYPES = ['INNER', 'LEFT', 'RIGHT', 'FULL']

function studentRow(student, course) {
  return {
    studentId: student?.id ?? null,
    name: student?.name ?? null,
    courseId: student?.courseId ?? null,
    courseTitle: course?.title ?? null,
  }
}

export function buildSqlJoinSteps(joinType) {
  const steps = []
  const includedCourseIds = new Set()

  steps.push({
    title: `${joinType} JOIN — starting tables`,
    explanation:
      `SELECT s.name, c.title FROM Students s ${joinLabel(joinType)} JOIN Courses c ON s.courseId = c.id. ` +
      'The database will scan rows from one table and, for each one, look for a matching row in the other table using the join key (courseId = id).',
    state: { phase: 'intro', resultRows: [], focus: null },
  })

  if (joinType === 'INNER' || joinType === 'LEFT' || joinType === 'FULL') {
    for (const student of STUDENTS) {
      const course = COURSES.find((c) => c.id === student.courseId) || null

      steps.push({
        title: `Scanning Students row: ${student.name}`,
        explanation:
          `The engine reads ${student.name}'s row (courseId = ${student.courseId ?? 'NULL'}) and searches the Courses table for a row where id = ${student.courseId ?? 'NULL'}.`,
        state: { phase: 'scan', resultRows: [...steps[steps.length - 1]?.state?.resultRows ?? []], focus: { studentId: student.id, courseId: student.courseId, matched: null } },
      })

      if (course) {
        includedCourseIds.add(course.id)
        steps.push({
          title: `Match found: ${student.name} ↔ ${course.title}`,
          explanation:
            `Courses.id = ${course.id} matches. This pair satisfies the ON condition, so the joined row (${student.name}, ${course.title}) is added to the result.`,
          state: {
            phase: 'decide',
            resultRows: [...prevRows(steps), studentRow(student, course)],
            focus: { studentId: student.id, courseId: course.id, matched: true },
          },
        })
      } else if (joinType === 'INNER') {
        steps.push({
          title: `No match for ${student.name} — excluded`,
          explanation:
            `No row in Courses has id = ${student.courseId ?? 'NULL'}. Since this is an INNER JOIN, rows without a match on both sides are dropped entirely — ${student.name} will not appear in the result.`,
          state: {
            phase: 'decide',
            resultRows: [...prevRows(steps)],
            focus: { studentId: student.id, courseId: student.courseId, matched: false },
          },
        })
      } else {
        // LEFT / FULL: keep the row, pad course columns with NULL
        steps.push({
          title: `No match for ${student.name} — kept with NULLs`,
          explanation:
            `No row in Courses has id = ${student.courseId ?? 'NULL'}. Because this is a ${joinType} JOIN, ${student.name}'s row is still kept in the result, with the course columns filled in as NULL.`,
          state: {
            phase: 'decide',
            resultRows: [...prevRows(steps), studentRow(student, null)],
            focus: { studentId: student.id, courseId: student.courseId, matched: false },
          },
        })
      }
    }
  }

  if (joinType === 'RIGHT' || joinType === 'FULL') {
    for (const course of COURSES) {
      const student = STUDENTS.find((s) => s.courseId === course.id) || null

      if (joinType === 'FULL' && student) continue // already handled in the left-side pass above

      steps.push({
        title: `Scanning Courses row: ${course.title}`,
        explanation:
          `The engine reads the "${course.title}" row (id = ${course.id}) and searches the Students table for a row where courseId = ${course.id}.`,
        state: { phase: 'scan', resultRows: [...prevRows(steps)], focus: { studentId: student?.id ?? null, courseId: course.id, matched: null, fromCourses: true } },
      })

      if (student && joinType === 'RIGHT') {
        steps.push({
          title: `Match found: ${course.title} ↔ ${student.name}`,
          explanation: `Students.courseId = ${course.id} matches ${student.name}'s row, so the joined pair is added to the result.`,
          state: {
            phase: 'decide',
            resultRows: [...prevRows(steps), studentRow(student, course)],
            focus: { studentId: student.id, courseId: course.id, matched: true, fromCourses: true },
          },
        })
      } else {
        steps.push({
          title: `No student enrolled in ${course.title} — kept with NULLs`,
          explanation:
            `No row in Students has courseId = ${course.id}. Because this is a ${joinType} JOIN, "${course.title}" is still kept in the result, with the student columns filled in as NULL.`,
          state: {
            phase: 'decide',
            resultRows: [...prevRows(steps), studentRow(null, course)],
            focus: { studentId: null, courseId: course.id, matched: false, fromCourses: true },
          },
        })
      }
    }
  }

  const finalRows = prevRows(steps)
  steps.push({
    title: `${joinType} JOIN complete`,
    explanation:
      `The scan is finished. The final result has ${finalRows.length} row${finalRows.length === 1 ? '' : 's'}. ${joinResultSummary(joinType)}`,
    state: { phase: 'done', resultRows: finalRows, focus: null },
  })

  return steps
}

function prevRows(steps) {
  return steps[steps.length - 1]?.state?.resultRows ?? []
}

function joinLabel(joinType) {
  if (joinType === 'INNER') return 'INNER'
  if (joinType === 'LEFT') return 'LEFT OUTER'
  if (joinType === 'RIGHT') return 'RIGHT OUTER'
  return 'FULL OUTER'
}

function joinResultSummary(joinType) {
  switch (joinType) {
    case 'INNER':
      return 'Only rows with a match on both sides survive — students with no course, and courses with no student, are both left out.'
    case 'LEFT':
      return 'Every student appears at least once, even Meera and Karan whose courseId had no match — their course columns are NULL.'
    case 'RIGHT':
      return 'Every course appears at least once, even Operating Systems which has no enrolled student — its student columns are NULL.'
    default:
      return 'Every row from both tables appears at least once — unmatched students and unmatched courses both show up padded with NULLs.'
  }
}

export const sqlJoinNotes = {
  what: 'A SQL JOIN combines rows from two tables based on a related column between them — here, Students.courseId matching Courses.id.',
  why: 'Real data is normalized across multiple tables to avoid duplication. JOINs let you ask questions that span tables, like "which course is each student enrolled in?", without storing course details inside the Students table itself.',
  how: 'For each row on the driving side, the engine looks for row(s) on the other side where the join condition holds. INNER JOIN keeps only matched pairs; LEFT/RIGHT keep every row from one side and pad the other with NULLs when there\'s no match; FULL keeps every row from both sides.',
  observe: 'Watch which table is scanned first, which rows get a green match highlight versus a red "no match", and how the result table grows one row at a time as each decision is made.',
  outcome: 'A single result table combining columns from both sources, whose row count and NULL-padding depend entirely on which join type was selected.',
  points: [
    'INNER JOIN is the strictest — it can silently drop real rows if the join key doesn\'t line up, which is a common source of "missing data" bugs.',
    'LEFT/RIGHT JOIN are direction-sensitive: swapping the table order changes which side gets padded with NULLs.',
    'FULL OUTER JOIN is not supported by every database engine (e.g. MySQL emulates it with a UNION of LEFT and RIGHT joins).',
  ],
  complexity: 'A naive nested-loop join compares every row on one side against every row on the other — O(n·m). Real databases avoid this using indexes or hash joins, often bringing it close to O(n + m).',
  realWorld: 'Almost every non-trivial report or API endpoint backed by a relational database relies on joins — e.g. "orders with customer names" or "posts with author details" are both joins under the hood.',
}
