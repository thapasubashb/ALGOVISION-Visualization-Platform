// Builds the step sequence for CREATE / INSERT / SELECT / UPDATE / DELETE
// against a single live "Employees" table.

export function buildSqlCrudSteps() {
  const steps = []
  let rows = []

  steps.push({
    title: 'CREATE TABLE Employees',
    explanation:
      'CREATE TABLE Employees (id INT PRIMARY KEY, name TEXT, dept TEXT, salary INT); This defines the table\'s structure — its columns and types — before any data exists. Right now the table is empty.',
    state: { sql: 'CREATE TABLE Employees (id, name, dept, salary);', rows: [], highlightIds: [], flashCell: null, deletingId: null },
  })

  const inserts = [
    { id: 1, name: 'Ravi', dept: 'Sales', salary: 40000 },
    { id: 2, name: 'Anu', dept: 'Engineering', salary: 60000 },
    { id: 3, name: 'Kabir', dept: 'Sales', salary: 45000 },
  ]
  for (const row of inserts) {
    rows = [...rows, row]
    steps.push({
      title: `INSERT INTO Employees VALUES (${row.id}, '${row.name}', '${row.dept}', ${row.salary})`,
      explanation:
        `A new row is appended to the table. The engine checks that id=${row.id} doesn't violate the PRIMARY KEY constraint, then physically writes the row. It animates in at the bottom of the table.`,
      state: { sql: `INSERT INTO Employees VALUES (${row.id}, '${row.name}', '${row.dept}', ${row.salary});`, rows: [...rows], highlightIds: [row.id], flashCell: null, deletingId: null },
    })
  }

  const salesIds = rows.filter((r) => r.dept === 'Sales').map((r) => r.id)
  steps.push({
    title: "SELECT * FROM Employees WHERE dept = 'Sales'",
    explanation:
      "The engine scans every row and keeps only the ones where dept = 'Sales'. Ravi and Kabir match; Anu (Engineering) does not. SELECT doesn't change any data — it only reads and filters what already exists.",
    state: { sql: "SELECT * FROM Employees WHERE dept = 'Sales';", rows: [...rows], highlightIds: salesIds, flashCell: null, deletingId: null },
  })

  rows = rows.map((r) => (r.id === 1 ? { ...r, salary: 50000 } : r))
  steps.push({
    title: 'UPDATE Employees SET salary = 50000 WHERE id = 1',
    explanation:
      "The engine finds the row(s) matching id = 1 — just Ravi — and overwrites the salary column in place. Every other column and every other row is left untouched. The changed cell flashes to show exactly what was modified.",
    state: { sql: 'UPDATE Employees SET salary = 50000 WHERE id = 1;', rows: [...rows], highlightIds: [1], flashCell: { id: 1, col: 'salary' }, deletingId: null },
  })

  steps.push({
    title: 'DELETE FROM Employees WHERE id = 3',
    explanation:
      "The engine locates the row where id = 3 (Kabir) and removes it entirely. Unlike UPDATE, DELETE removes the whole row — all of its column values disappear from the table together.",
    state: { sql: 'DELETE FROM Employees WHERE id = 3;', rows: [...rows], highlightIds: [], flashCell: null, deletingId: 3 },
  })
  rows = rows.filter((r) => r.id !== 3)

  steps.push({
    title: 'Final table state',
    explanation:
      'After all five operations, the table holds two rows: Ravi (now earning 50000) and Anu. This is exactly what a client querying the table right now would see — CRUD operations are immediately visible to any later SELECT.',
    state: { sql: 'SELECT * FROM Employees;', rows: [...rows], highlightIds: [], flashCell: null, deletingId: null },
  })

  return steps
}

export const sqlCrudNotes = {
  what: 'CRUD stands for Create, Read, Update, Delete — the four basic operations SQL provides for managing data: CREATE TABLE defines structure, INSERT adds rows, SELECT reads rows, UPDATE modifies rows, and DELETE removes rows.',
  why: 'Almost every feature of every application eventually reduces to one of these operations against a database — signing up a user is an INSERT, viewing a profile is a SELECT, editing it is an UPDATE, and deleting an account is a DELETE.',
  how: 'Each statement names a table and, for UPDATE/DELETE/SELECT, a WHERE clause that filters which rows are affected. The engine scans (or uses an index to jump to) the matching rows and applies the operation to exactly those rows — never more, never less.',
  observe: 'Watch how INSERT adds a whole new row, UPDATE changes only the flashing cell while leaving the rest of the row alone, and DELETE removes the entire row rather than just a value.',
  outcome: 'A table that ends up with 2 rows out of the original 3 inserted, one of them with a modified salary — reflecting exactly the sequence of statements that ran.',
  points: [
    'Forgetting a WHERE clause on UPDATE or DELETE applies the change to every row in the table — a classic, dangerous mistake.',
    'SELECT never modifies data; it only reads and optionally filters/sorts it.',
    'The order operations run in matters — this DELETE only succeeds because it runs after the row already exists from an earlier INSERT.',
  ],
  complexity: 'Without an index, INSERT is O(1) (append), while SELECT/UPDATE/DELETE with a WHERE clause are O(n) since every row must be checked against the condition.',
  realWorld: 'Every ORM (Django ORM, Sequelize, Hibernate, Prisma) you\'ll use as a developer is ultimately just generating these same four statements on your behalf.',
}
