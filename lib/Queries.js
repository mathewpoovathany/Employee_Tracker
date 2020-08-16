class Queries {

  viewAllEmployees() {
    return `SELECT employee.id, employee.first_name, employee.last_name, role.title, dept.name AS department, 
    role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee 
    LEFT JOIN role on employee.role_id = role.id 
    LEFT JOIN department dept on role.department_id = dept.id 
    LEFT JOIN employee manager on manager.id = employee.manager_id`;
  };

  viewAllEmployeesByDept() {
    return `SELECT employee.id, employee.first_name, employee.last_name, role.title, dept.name AS department, 
    role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee 
    LEFT JOIN role on employee.role_id = role.id 
    LEFT JOIN department dept on role.department_id = dept.id 
    LEFT JOIN employee manager on manager.id = employee.manager_id
    WHERE dept.name = ?`;
  }

  viewAllEmployeesByRole() {
    return `SELECT employee.id, employee.first_name, employee.last_name, role.title, dept.name AS department, 
    role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee 
    LEFT JOIN role on employee.role_id = role.id 
    LEFT JOIN department dept on role.department_id = dept.id 
    LEFT JOIN employee manager on manager.id = employee.manager_id
    WHERE role.title = ?`;
  }

  viewAllDepartments() {
    return `SELECT department.name AS department FROM department`;
  }

  viewAllRoles() {
    return `SELECT title from role`;
  }

  viewAllEmployeeNames() {
    return `SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS employee_name FROM employee;`;
  }

  viewAllManagers() {
    return `SELECT DISTINCT employee.manager_id AS manager_id, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee 
    LEFT JOIN employee manager on manager.id = employee.manager_id
    WHERE employee.manager_id IS NOT NULL`;
  }

  viewAllEmployeesByManager() {
    return ` SELECT employee.id, employee.first_name, employee.last_name, role.title, dept.name AS department, 
    role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee 
    LEFT JOIN role on employee.role_id = role.id 
    LEFT JOIN department dept on role.department_id = dept.id 
    LEFT JOIN employee manager on manager.id = employee.manager_id
    WHERE manager.first_name = ? AND manager.last_name = ?`;
  }

  viewEmployeeIdByName() {
    return `SELECT employee.id FROM employee WHERE employee.first_name = ? AND employee.last_name = ?`;
  }

  viewManagerIdByName() {
    return `SELECT employee.id AS manager_id FROM employee WHERE employee.first_name = ? AND employee.last_name = ?`;
  }

  viewDeptIdByName() {
    return `SELECT department.id FROM department WHERE department.name = ?`;
  }

  viewRoleIdByName() {
    return `SELECT role.id FROM role WHERE role.title = ?`;
  }

  viewRoleIdByDeptId() {
    return `SELECT id FROM role WHERE department_id = ?`;
  }

  viewDepartmentIdByName() {
    return `SELECT department.id FROM department WHERE department.name = ?`;
  }

  assignDeptIdToRole() {
    return `UPDATE role SET department_id = ? WHERE role.title = ?`;
  }

  insertNewEmployee() {
    return `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?);`
  }

  insertOrIgnoreDepartment() {
    return `INSERT IGNORE INTO department (name)
    VALUES (?)`;
  }

  insertOrIgnoreRole() {
    return `INSERT IGNORE INTO role (title, salary, department_id)
    VALUES (?, ?, ?)`;
  }

  removeEmployeeById() {
    return `DELETE FROM employee WHERE employee.id = ?`;
  }

  removeDepartmentById() {
    return `DELETE FROM department WHERE department.id = ?`;
  }

  removeRoleById() {
    return `DELETE FROM role WHERE role.id = ?`;
  }

  updateDeptRoleUnderRemovedDept() {
    return `UPDATE role SET department_id = null WHERE role.id = ?`;
  }

  updateEmployeeRoleIdUnderRemovedRole() {
    return `UPDATE employee SET employee.role_id = null WHERE employee.role_id = ?`;
  }

  updateEmployeesUnderRemovedManager() {
    return `UPDATE employee SET employee.manager_id = null WHERE employee.manager_id = ?`;
  }

  updateEmployeeRoleId() {
    return `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
  }

  updateEmployeeManagerById() {
    return `UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`;
  }

}

module.exports = Queries;