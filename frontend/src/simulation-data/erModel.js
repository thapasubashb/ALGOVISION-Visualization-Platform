export function buildErModelSteps() {
  const steps = []

  steps.push({
    title: 'An ER diagram models real-world things and their relationships',
    explanation:
      'An Entity-Relationship diagram captures the entities (things worth storing data about) in a system, their attributes, and how entities relate to each other — before a single table is created.',
    state: { showStudent: false, showStudentAttrs: false, showCourse: false, showCourseAttrs: false, showRelation: false, showCardinality: false, showJunction: false },
  })

  steps.push({
    title: 'Entity: STUDENT',
    explanation:
      'STUDENT is our first entity — a "thing" the system needs to remember data about. It\'s drawn as a rectangle. Right now we only know it exists; we haven\'t defined what data it holds yet.',
    state: { showStudent: true, showStudentAttrs: false, showCourse: false, showCourseAttrs: false, showRelation: false, showCardinality: false, showJunction: false },
  })

  steps.push({
    title: 'STUDENT attributes',
    explanation:
      'Every entity has attributes — the specific pieces of data it stores. STUDENT has student_id (the primary key, underlined, uniquely identifying each student), name, and email.',
    state: { showStudent: true, showStudentAttrs: true, showCourse: false, showCourseAttrs: false, showRelation: false, showCardinality: false, showJunction: false },
  })

  steps.push({
    title: 'Entity: COURSE',
    explanation:
      'COURSE is our second entity. Like STUDENT, it starts as just a labeled box before we define its attributes.',
    state: { showStudent: true, showStudentAttrs: true, showCourse: true, showCourseAttrs: false, showRelation: false, showCardinality: false, showJunction: false },
  })

  steps.push({
    title: 'COURSE attributes',
    explanation:
      'COURSE has course_id (its primary key), title, and credits. Note that STUDENT and COURSE don\'t share any columns yet — that\'s what the relationship below is for.',
    state: { showStudent: true, showStudentAttrs: true, showCourse: true, showCourseAttrs: true, showRelation: false, showCardinality: false, showJunction: false },
  })

  steps.push({
    title: 'Relationship: ENROLLS',
    explanation:
      'The diamond labeled ENROLLS connects STUDENT and COURSE. It says "students enroll in courses" — this is where the actual connection between the two entities is defined, separate from either entity\'s own attributes.',
    state: { showStudent: true, showStudentAttrs: true, showCourse: true, showCourseAttrs: true, showRelation: true, showCardinality: false, showJunction: false },
  })

  steps.push({
    title: 'Cardinality: many-to-many',
    explanation:
      'The "M" near STUDENT and "N" near COURSE mean: one student can enroll in many courses, AND one course can have many students enrolled. This many-to-many (M:N) cardinality is common and has a specific consequence for how we build the actual tables.',
    state: { showStudent: true, showStudentAttrs: true, showCourse: true, showCourseAttrs: true, showRelation: true, showCardinality: true, showJunction: false },
  })

  steps.push({
    title: 'M:N needs a junction table',
    explanation:
      'A many-to-many relationship can\'t be stored with a simple foreign key on either side — neither table can hold "many" values in one column. Instead, ENROLLS becomes its own table: Enrollment(student_id, course_id, enrollment_date), with a foreign key pointing to each entity.',
    state: { showStudent: true, showStudentAttrs: true, showCourse: true, showCourseAttrs: true, showRelation: true, showCardinality: true, showJunction: true },
  })

  return steps
}

export const erModelNotes = {
  what: 'An Entity-Relationship (ER) diagram is a conceptual blueprint of a database: it shows entities (things), their attributes (data they hold), and the relationships between them, before any SQL is written.',
  why: 'Designing the data model on paper (or a whiteboard) first catches structural mistakes — like a missing relationship or the wrong cardinality — while they\'re cheap to fix, instead of after tables and application code already depend on the wrong structure.',
  how: 'Entities become rectangles, attributes become ovals or a bullet list attached to their entity, primary keys are underlined, and relationships are diamonds connecting two (or more) entities, annotated with cardinality (1:1, 1:N, or M:N).',
  observe: 'Watch how STUDENT and COURSE are built independently first, and only the ENROLLS relationship — and its M:N cardinality — determines that we\'ll eventually need a separate junction table.',
  outcome: 'A complete conceptual model: two entities with their attributes, connected by a many-to-many relationship that will become three physical tables (Student, Course, Enrollment).',
  points: [
    'Cardinality (1:1, 1:N, M:N) directly determines your physical schema — M:N always needs a junction/bridge table.',
    'The primary key of each entity is what a foreign key in another table will reference.',
    'A relationship can have its own attributes too — here, enrollment_date belongs to the ENROLLS relationship, not to STUDENT or COURSE individually.',
  ],
  complexity: 'Not applicable in the algorithmic sense — ER modeling is a design-time activity, but a well-normalized model (see the Normalization topic) avoids O(n) update anomalies later.',
  realWorld: 'Every "students and courses", "orders and products", or "posts and tags" feature you\'ve seen in an app started as exactly this kind of diagram before any code was written.',
}
