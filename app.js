const inquirer = require("inquirer");
const consoleTable = require('console.table');
const DB = require("./lib/Database");
const Queries = require("./lib/Queries");

const Db = new DB({
    host: "axxb6a0z2kydkco3.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
   
    port: 3306,
    user: "rrs48eweafjo0enu",
    password: "wyjnjsxrzfljfb3a",
    database: "gz9wl2njuqwby86g"
});
const askQuestions = () => {

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                  'View All Employees',
                  'View All Employees By Department',
                  'View All Employees By Role',
                  'View All Employees By Manager',
                  'Add Department',
                  'Add Role',
                  'Add Employee',
                  'Assign Role to Department',
                  'Remove Employee',
                  'Remove Department',
                  'Remove Role',
                  'Update Employee Role',
                  'Update Employee Manager',
                  'Exit'
                ]
            }
        ])
        .then(answer => {
            const { action } = answer;
            switch(action) {
                case 'View All Employees':
                  viewAllEmployees();
                break;
                case 'View All Employees By Department':
                  viewAllEmployeesByDepartment();
                break;
                case 'View All Employees By Role':
                  viewAllEmployeesByRole();
                break;
                case 'View All Employees By Manager':
                  viewAllEmployeesByMgr();
                break;
                case 'Add Department':
                  addDepartment();
                break;
                case 'Add Role':
                  addRole();
                break;
                case 'Add Employee':
                  addEmployee();
                break;
                case 'Assign Role to Department':
                    assignRoleToDept();
                break;
                case 'Remove Employee':
                  removeEmployee();
                break;
                case 'Remove Department':
                  removeDepartment();
                break;
                case 'Remove Role':
                  removeRole();
                break;
                case 'Update Employee Role':
                  updateEmployeeRole();
                break;
                case 'Update Employee Manager':
                  updateEmployeeManager();
                break;
                case 'Exit':
                  TerminateExecution();
                break;
                default:
                    TerminateExecution();
            }
      });

}

const TerminateExecution = () => {
    Db.close();
}

askQuestions();


const createTable = rows => {

    let dataInTable = [];
    
    for (let i = 0; i < rows.length; i++) {
        const { id, first_name, last_name, title, department, salary, manager } = rows[i];
        const obj = {};
        obj["id"] = id;
        obj["first_name"] = first_name;
        obj["last_name"] = last_name;
        obj["title"] = title;
        obj["department"] = department;
        obj["salary"] = salary;
        obj["manager"] = manager;

        dataInTable.push(obj);
    }

    return consoleTable.getTable(dataInTable);
        

}

const createList = (rows, item) => {

    let Items = [];

    for (let i = 0; i < rows.length; i++) {
        Items.push(rows[i][item]);
    }

    return Items;

}

const requireLetters = value => {
    if (/^[A-Za-z\s']+$/.test(value)) {
        return true;
    }
    
    return 'Your answer must be alphabetical';
}

const OnlyNumbers = value => {
    if (/^\d+$/.test(value)) {
        return true;
    }
    
    return 'Answer must be a number. Do not include commas.';
}

const splitName = name => {

    const index = name.indexOf(' ');
    let first_name = name.substr(0, index);
    let last_name = name.substr(index + 1);

    return [first_name, last_name];

}

const initialCaps = words => {

    words = words.split(" ");

    let capitalized_word = "";
    
    for (let i = 0; i < words.length; i++) {
        const first_letter = words[i].substring(0, 1);
        const rest_of_word = words[i].substr(1);
        const capital_letter = first_letter.toUpperCase();
        capitalized_word += capital_letter + rest_of_word + " ";
    }
    
    capitalized_word = capitalized_word.trim();
    
    return capitalized_word;

}


const updateEmployeeManager = () => {

    let employeeList = [];
    let managersList = [];
    let employee_id;
    let manager_id;
    let e_first_name;
    let e_last_name;
    let m_first_name;
    let m_last_name;

    const query = new Queries();
    const viewAllEmployeeNames = query.viewAllEmployeeNames();

    Db.query(viewAllEmployeeNames).then(rows => {

        if (rows.length > 0) {

            employeeList = createList(rows, 'employee_name');

            managersList = createList(rows, 'employee_name');

            managersList.unshift('None');

            return;

        }
        else {
            console.log("There are no employees in the Db.");
            askQuestions();
        }

    }, err => {
        return Db.close().then(() => { throw err; })
    }).then(() => {

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Select the employee whose manager you want to update:',
                    choices: employeeList
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Select the manager you want to assign this employee to:',
                    choices: managersList
                }
            ])
            .then(ans => {

                const { employee, manager } = ans;

                const e_full_name = splitName(employee);
                e_first_name = e_full_name[0];
                e_last_name = e_full_name[1];

                if (manager !== 'None') {
                    const m_full_name = splitName(manager);
                    m_first_name = m_full_name[0];
                    m_last_name = m_full_name[1];
                }
                else {
                    manager_id = null;
                }

                const query = new Queries();
                const viewEmployeeIdByName = query.viewEmployeeIdByName();

                Db.query(viewEmployeeIdByName, [e_first_name, e_last_name]).then(rows => {

                    employee_id = rows[0].id;

                    if (manager_id !== null) {
                        const query = new Queries();
                        const viewEmployeeIdByName = query.viewEmployeeIdByName();

                        return Db.query(viewEmployeeIdByName, [m_first_name, m_last_name]);

                    }
                    else {
                        return manager_id;
                    }
                    
                }, err => {
                    return Db.close().then(() => { throw err; })
                }).then(rows => {

                    if (rows !== null) {
                        manager_id = rows[0].id;
                    }

                    if (employee_id === manager_id) {
                        console.log("You cannot assign the same person as a manager to themselves.");
                        rows = null;
                        return rows;
                    }
                    else {

                        const query = new Queries();
                        const updateEmployeeManagerById = query.updateEmployeeManagerById();

                        return Db.query(updateEmployeeManagerById, [manager_id, employee_id]);

                    }

                }, err => {
                    return Db.close().then(() => { throw err; })
                }).then(rows => {

                    if (rows === null) {
                        return;
                    }
                    else if (rows.changedRows === 1) {
                        console.log("Manager successfully assigned to the employee");
                    }
                    else if (rows.changedRows === 0) {
                        console.log("That manager is already assigned to that employee.");
                    }

                }).then(() => {
                    askQuestions();
                }).catch(err => {
                    console.log(err);
                });

        });

    }).catch(err => {
        console.log(err);
    });

}

const viewAllEmployeesByDepartment = () => {

    const query = new Queries();
    const viewAllDepartments = query.viewAllDepartments();

    let deptList = [];

    Db.query(viewAllDepartments).then(rows => {

        if (rows.length > 0) {

            deptList = createList(rows, 'department');
    
            deptList.push('Cancel');
    
            return deptList;

        }
        else {
            console.log("There are no departments in the Db.");
            askQuestions();
        }

    }, err => {
        return Db.close().then(() => { throw err; })
    }).then(deptList => {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'dept',
                    message: 'Which department would you like to view?',
                    choices: deptList
                }
            ])
            .then(answer => {
                const { dept } = answer;
                if (dept !== 'Cancel') {
                    viewDept(dept);
                }
                else {
                    TerminateExecution();
                }
            });
    }).catch(err => {
        console.log(err);
    });
        
}

const viewDept = (dept) => {

    const query = new Queries();
    const viewAllEmployeesByDepartment = query.viewAllEmployeesByDepartment();

    Db.query(viewAllEmployeesByDepartment, dept).then(rows => {
  
        const dataTable = createTable(rows);
        console.log(dataTable);

    }, err => {
        return Db.close().then(() => { throw err; })
    }).then(() => {
        askQuestions();
    }).catch(err => {
        console.log(err);
    });

}




const viewAllEmployees = () => {

    const query = new Queries();
    const viewAllEmployees = query.viewAllEmployees();

    Db.query(viewAllEmployees).then(rows => {

        if (rows.length > 0) {

            const dataTable = createTable(rows);
            console.log(dataTable);

        }
        else {
            console.log("There are no employees in the Db.");
            askQuestions();
        } 

    }, err => {
        return Db.close().then(() => { throw err; })
    }).then(() => {
        askQuestions();
    }).catch(err => {
        console.log(err);
    });

}

const viewRole = title => {

    const query = new Queries();
    const viewAllEmployeesByRole = query.viewAllEmployeesByRole();
  
    Db.query(viewAllEmployeesByRole, title).then(rows => {
        
        const dataTable = createTable(rows);
        console.log(dataTable);

    }, err => {
        return Db.close().then(() => { throw err; })
    }).then(() => {
        askQuestions();
    }).catch(err => {
        console.log(err);
    });

}


const viewAllEmployeesByRole = () => {

    let roleList = [];

    const query = new Queries();
    const viewAllRoles = query.viewAllRoles();

    Db.query(viewAllRoles).then(rows => {

        if (rows.length > 0) {

            roleList = createList(rows, 'title');
    
            roleList.push('Cancel');
    
            return roleList;

        }
        else {
            console.log("There are no roles in the Db.");
            askQuestions();
        }

    }, err => {
        return Db.close().then(() => { throw err; })
    }).then(roleList => {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'title',
                    message: 'Select the job title of the employees you would like to view:',
                    choices: roleList
                }
            ])
            .then(answer => {
                const { title } = answer;
                if (title !== 'Cancel') {
                    viewRole(title);
                }
                else {
                    TerminateExecution();
                }
            });
    }).catch(err => {
        console.log(err);
    });

}

const viewMgr = mgr => {

    let e_full_name = splitName(mgr);
    let first_name = e_full_name[0];
    let last_name = e_full_name[1];

    const query = new Queries();
    const viewAllEmployeesByManager = query.viewAllEmployeesByManager();
  
    Db.query(viewAllEmployeesByManager, [first_name, last_name]).then(rows => {
        
        const dataTable = createTable(rows);
        console.log(dataTable);

    }, err => {
        return Db.close().then(() => { throw err; })
    }).then(() => {
        askQuestions();
    }).catch(err => {
        console.log(err);
    });

}


const viewAllEmployeesByMgr = () => {

    const query = new Queries();
    const viewAllManagers = query.viewAllManagers();

    let managersList = [];
  
    Db.query(viewAllManagers).then(rows => {

        if (rows.length > 0) {

            managersList = createList(rows, 'manager');
    
            managersList.push('Cancel');
    
            return managersList;
        }
        else {
            console.log('There are no managers in the Db.');
            askQuestions();
        }

    }, err => {
        return Db.close().then(() => { throw err; })
    }).then(managersList => {
        
        inquirer
              .prompt([
                  {
                    type: 'list',
                    name: 'mgr',
                    message: 'What manager\'s employees do you want to view?',
                    choices: managersList
                }
              ])
              .then(answer => {
                  const { mgr } = answer;
                  if (mgr !== 'Cancel') {
                    viewMgr(mgr);
                  }
                  else {
                    TerminateExecution();
                  }
              });

    }).catch(err => {
        console.log(err);
    });

}



const addRole = () => {

    let deptList = [];
    let dept_id;

    const query = new Queries();
    const viewAllDepartments = query.viewAllDepartments();

    Db.query(viewAllDepartments).then(rows => {

        if (rows.length > 0) {

            deptList = createList(rows, 'department'); 
            return deptList;

        }
        else {
            deptList = null;
            return deptList;
        }

    }, err => {
        return Db.close().then(() => { throw err; })
    }).then(deptList => {

        if (deptList === null) {
            console.log('You must first add a department before you can add a job title to the Db.');
            askQuestions();
        }

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Enter the name of the job title you would like to add:',
                    validate: requireLetters
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is this salary for this job?',
                    validate: OnlyNumbers
                },
                {
                    type: 'list',
                    name: 'dept',
                    message: 'Select a department where this job belongs to:',
                    choices: deptList
                }
            ])
            .then(ans => {

                    let { title, salary, dept } = ans;

                    title = initialCaps(title).trim();
                    dept = initialCaps(dept).trim();

                    const query = new Queries();
                    const viewDepartmentIdByName = query.viewDepartmentIdByName();

                Db.query(viewDepartmentIdByName, dept).then(rows => {

                    dept_id = rows[0].id;

                    if (dept_id === undefined) {
                        console.log("The department you entered was not found.")
                        addRole();
                    }

                    const query = new Queries();
                    const insertOrIgnoreRole = query.insertOrIgnoreRole();

                    return Db.query(insertOrIgnoreRole, [title, salary, dept_id]);

                }, err => {
                    return Db.close().then(() => { throw err; })
                }).then(rows => {

                        if (rows.insertId !== 0) {
                            console.log("New job title added.");
                        }
                        else {
                            console.log("This job title already exists. Please enter a different name.");
                            addRole();
                        }

                }).then(() => {
                        askQuestions();
                }).catch(err => {
                    console.log(err);
                });

        });

    }).catch(err => {
        console.log(err);
    });

}

const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'department',
                message: 'Enter the name of the department you would like to add:',
                validate: requireLetters
            }
        ])
        .then(ans => {

            let department = ans.department;

            department = initialCaps(department).trim();

            const query = new Queries();
            const insertOrIgnoreDepartment = query.insertOrIgnoreDepartment();

            Db.query(insertOrIgnoreDepartment, department).then(rows => {

                if (rows.insertId !== 0) {
                    return rows;
                }
                else {
                    return null;
                }

            }, err => {
                return Db.close().then(() => { throw err; })
            }).then(rows => {

                if (rows !== null) {
                    console.log("New Department added");   
                    askQuestions();                 
                }
                else {
                    console.log("This department already exists. Please enter a different name.");
                    addDepartment();
                }
                
            }).catch(err => {
                console.log(err);
            });

        });
}


const addEmployee = () => {

    let jobTitleArray = [];
    let managersList = [];

    const query = new Queries();
    const viewAllRoles = query.viewAllRoles();
  
    Db.query(viewAllRoles).then(rows => {

        if (rows.length > 0) {

            jobTitleArray = createList(rows, 'title');
    
            const query = new Queries();
            const viewAllEmployeeNames = query.viewAllEmployeeNames();

            return Db.query(viewAllEmployeeNames);

        }
        else {
            return null;
        }

    }, err => {
        return Db.close().then(() => { throw err; })
    }).then(rows => {

        if (rows === null) {
            console.log("You must first add a job title to the Db before you can add an employee.");
            askQuestions();
        }

        managersList = createList(rows, 'employee_name');

        managersList.unshift('None');

        let role_id;
        let manager_id;

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'What is this employee\'s first name?',
                    validate: requireLetters
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'What is this employee\'s last name?',
                    validate: requireLetters
                },
                {
                    type: 'list',
                    name: 'title',
                    message: 'Select a job title for this employee',
                    choices: jobTitleArray
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Who is this employee\'s manager?',
                    choices: managersList
                }
            ])
            .then(ans => {

                let { first_name, last_name, title, manager } = ans;

                first_name = initialCaps(first_name).trim();
                last_name = initialCaps(last_name).trim();

                const query = new Queries();
                const viewRoleIdByName = query.viewRoleIdByName();
            
                Db.query(viewRoleIdByName, title).then(rows => {

                    role_id = rows[0].id;

                    if (manager !== 'None') {

                        let m_full_name = splitName(manager);
                        let first_name = m_full_name[0];
                        let last_name = m_full_name[1];

                        const query = new Queries();
                        const viewEmployeeIdByName = query.viewEmployeeIdByName();
                    
                        return Db.query(viewEmployeeIdByName, [first_name, last_name]);

                    }
                    else {
                        manager_id = null;
                        return manager_id;
                    }

                }, err => {
                    return Db.close().then(() => { throw err; })
                }).then(rows => {

                    if (rows !== null) {
                        manager_id = rows[0].id;
                    }
                    else {
                        manager_id = null;
                    }

                    const query = new Queries();
                    const insertNewEmployee = query.insertNewEmployee();

                    return Db.query(insertNewEmployee, [first_name, last_name, role_id, manager_id]);

                }, err => {
                    return Db.close().then(() => { throw err; })
                }).then(rows => {
                    
                    if (rows.insertId !== 0) {
                        console.log("New employee added.");
                    }
                    else {
                        console.log("Unable to add new employee.");
                        addRole();
                    }

                }).then(() => {
                    askQuestions();
                }).catch(err => {
                    console.log(err);
                });

            });

    }).catch(err => {
        console.log(err);
    });

}


const removeEmployee = () => {

    let employeeList = [];

    const query = new Queries();
    const viewAllEmployeeNames = query.viewAllEmployeeNames();

    Db.query(viewAllEmployeeNames).then(rows => {

        if (rows.length > 0) {

            employeeList = createList(rows, 'employee_name');

            return employeeList;

        }
        else {
            console.log("There are no employees in the Db.");
            askQuestions();
        }

    }, err => {
        return Db.close().then(() => { throw err; })
    }).then(employeeList => {

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Select the employee you want to remove from the Db.',
                    choices: employeeList
                }
            ])
            .then(answer => {

                const employee = answer.employee;

                let e_full_name = splitName(employee);
                let first_name = e_full_name[0];
                let last_name = e_full_name[1];

                const query = new Queries();
                const viewEmployeeIdByName = query.viewEmployeeIdByName();

                let employee_id;

                Db.query(viewEmployeeIdByName, [first_name, last_name]).then(rows => {
                    
                    employee_id = rows[0].id;

                    const query = new Queries();
                    const updateEmployeesUnderRemovedManager = query.updateEmployeesUnderRemovedManager();

                    return Db.query(updateEmployeesUnderRemovedManager, employee_id);
                
                }, err => {
                    return Db.close().then(() => { throw err; })
                }).then(rows => {

                    const query = new Queries();
                    const removeEmployeeById = query.removeEmployeeById();

                    return Db.query(removeEmployeeById, employee_id);

                }, err => {
                    return Db.close().then(() => { throw err; })
                }).then(rows => {

                    if (rows.affectedRows === 1) {
                        console.log("Employee was removed from the Db.");
                    }
                    else {
                        console.log("Failed to remove employee from the Db.");
                    }

                }).then(() => {
                    askQuestions();
                }).catch(err => {
                    console.log(err);
                });

            });

    }).catch(err => {
        console.log(err);
    });

}

const assignRoleToDept = () => {

    
    let jobTitleArray = [];
    let deptList = [];
    let dept_id;
    let title;

    const query = new Queries();
    const viewAllRoles = query.viewAllRoles();
  
    Db.query(viewAllRoles).then(rows => {

        if (rows.length > 0) {

            jobTitleArray = createList(rows, 'title');
    
            const query = new Queries();
            const viewAllDepartments = query.viewAllDepartments();

            return Db.query(viewAllDepartments);

        }
        else {
            return null;
        }

    }, err => {
        return Db.close().then(() => { throw err; })
    }).then(rows => {

        if (rows === null) {
            console.log("There are no job titles in the Db to assign departments to.");
            askQuestions();
        }

        if (rows.length > 0) {
            deptList = createList(rows, 'department');
        }
        else {
            console.log("There are no departments in the Db to assign a role to.");
            askQuestions();
        }

        inquirer
        .prompt([
            {
                type: 'list',
                name: 'title',
                message: 'Select the role you want to assign a department to:',
                choices: jobTitleArray
            },
            {
                type: 'list',
                name: 'dept',
                message: 'Select the department you want to assign to this role:',
                choices: deptList
            }

        ])
        .then(ans => {

            title = ans.title;
            let dept = ans.dept;

            const query = new Queries();
            const viewDepartmentIdByName = query.viewDepartmentIdByName();

            return Db.query(viewDepartmentIdByName, dept);

        }, err => {
            return Db.close().then(() => { throw err; })
        }).then(rows => {
            dept_id = rows[0].id;

            const query = new Queries();
            const assignDeptIdToRole = query.assignDeptIdToRole();

            return Db.query(assignDeptIdToRole, [dept_id, title]);

        }, err => {
            return Db.close().then(() => { throw err; })
        }).then(rows => {

            if (rows.affectedRows > 0) {
                console.log("Matching roles have been assigned to this department.");
                askQuestions();
            }

            const query = new Queries();
            const assignDeptIdToRole = query.assignDeptIdToRole();

            return Db.query(assignDeptIdToRole, [dept_id, title]);


        }).catch(err => {
            console.log(err);
        });

    }).catch(err => {
        console.log(err);
    });

}


const removeDepartment = () => {

    let deptList = [];
    let dept_id;

    const query = new Queries();
    const viewAllDepartments = query.viewAllDepartments();

    Db.query(viewAllDepartments).then(rows => {

        if (rows.length > 0) {

            deptList = createList(rows, 'department'); 
            return deptList;

        }
        else {
            return null;
        }

    }, err => {
        return Db.close().then(() => { throw err; })
    }).then(deptList => {

        if (deptList === null) {
            console.log('There are no departments in the Db to remove.');
            return;
        }

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'dept',
                    message: 'Select the department you want to remove.',
                    choices: deptList
                }
            ])
            .then(ans => {

                let { dept } = ans;

                const query = new Queries();
                const viewDeptIdByName = query.viewDeptIdByName();

                Db.query(viewDeptIdByName, dept).then(rows => {

                    dept_id = rows[0].id;

                    const query = new Queries();
                    const removeDepartmentById = query.removeDepartmentById();
    
                    return Db.query(removeDepartmentById, dept_id);
                    
                    }, err => {
                        return Db.close().then(() => { throw err; })
                    }).then(rows => {

                        if (rows.affectedRows === 1) {
                            console.log("Department removed from the Db.");
                        }
                        else {
                            console.log("Failed to remove department removed from the Db.");
                        }

                        const query = new Queries();
                        const viewRoleIdByDeptId = query.viewRoleIdByDeptId();
    
                        return Db.query(viewRoleIdByDeptId, dept_id);

                    }, err => {
                        return Db.close().then(() => { throw err; })
                    }).then(rows => {

                    if (rows.length > 0) {
                        for (let i = 0; i < rows.length; i++) {
                            const query = new Queries();
                            const updateDeptRoleUnderRemovedDept = query.updateDeptRoleUnderRemovedDept();
    
                            Db.query(updateDeptRoleUnderRemovedDept, rows[i].id);
    
                        }
                    }
                    return;
                    
                }, err => {
                    return Db.close().then(() => { throw err; })
                }).then(() => {
                    console.log("Roles have been updated.");
                }).then(() => {
                    askQuestions();
                }).catch(err => {
                    console.log(err);
                });
            });
    }).catch(err => {
        console.log(err);
    });

}


const updateEmployeeRole = () => {

    let employeeList = [];
    let jobTitleArray = [];
    let employee_id;
    let role_id;

    const query = new Queries();
    const viewAllEmployeeNames = query.viewAllEmployeeNames();

    Db.query(viewAllEmployeeNames).then(rows => {

        if (rows.length > 0) {

            employeeList = createList(rows, 'employee_name');

            return employeeList;

        }
        else {
            console.log("There are no employees in the Db.");
            askQuestions();
        }

    }, err => {
        return Db.close().then(() => { throw err; })
    }).then(employeeList => {

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Select an employee to update their job title:',
                    choices: employeeList
                }
            ])
            .then(answer => {
                const { employee } = answer;

                let e_full_name = splitName(employee);
                let first_name = e_full_name[0];
                let last_name = e_full_name[1];
                
                const query = new Queries();
                const viewEmployeeIdByName = query.viewEmployeeIdByName();

                Db.query(viewEmployeeIdByName, [first_name, last_name]).then(rows => {

                    employee_id = rows[0].id;

                    const query = new Queries();
                    const viewAllRoles = query.viewAllRoles();
                
                    return Db.query(viewAllRoles);
                    
                }, err => {
                    return Db.close().then(() => { throw err; })
                }).then(rows => {

                    jobTitleArray = createList(rows, 'title');

                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'title',
                                message: 'Select a job role to assign to this employee:',
                                choices: jobTitleArray
                            }
                        ])
                        .then(answer => {

                            let { title } = answer;
                            
                            const query = new Queries();
                            const viewRoleIdByName = query.viewRoleIdByName();

                            return Db.query(viewRoleIdByName, title);

                        }, err => {
                            return Db.close().then(() => { throw err; })
                        }).then(rows => {

                            role_id = rows[0].id;

                            const query = new Queries();
                            const updateEmployeeRoleId = query.updateEmployeeRoleId();
                            
                            return Db.query(updateEmployeeRoleId, [role_id, employee_id]);
                                
                        }, err => {
                            return Db.close().then(() => { throw err; })
                        }).then(rows => {

                            if (rows.changedRows === 1) {
                                console.log("Updated employee job title");
                                askQuestions();
                            }
                            else {
                                console.log("This employee has already been assigned this job title.");
                            }

                        }).catch(err => {
                            console.log(err);
                        });

                }).catch(err => {
                    console.log(err);
                });
            });

    });

}

const removeRole = () => {

    let jobTitleArray = [];
    let role_id;

    const query = new Queries();
    const viewAllRoles = query.viewAllRoles();
  
    Db.query(viewAllRoles).then(rows => {

        if (rows.length > 0) {

            jobTitleArray = createList(rows, 'title');
    
            const query = new Queries();
            const viewAllEmployeeNames = query.viewAllEmployeeNames();

            return Db.query(viewAllEmployeeNames);

        }
        else {
            return null;
        }

    }, err => {
        return Db.close().then(() => { throw err; })
    }).then(rows => {

        if (rows === null) {
            console.log("There are no job titles in the Db to remove.");
            return;
        }

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'title',
                    message: 'Select the job title you want to remove:',
                    choices: jobTitleArray
                }
            ]).then(answer => {

                const { title } = answer;

                const query = new Queries();
                const viewRoleIdByName = query.viewRoleIdByName();
            
                Db.query(viewRoleIdByName, title).then(rows => {

                    role_id = rows[0].id;

                    const query = new Queries();
                    const removeRoleById = query.removeRoleById();
            
                    return Db.query(removeRoleById, role_id);

                }, err => {
                    return Db.close().then(() => { throw err; })
                }).then(rows => {

                    if (rows.affectedRows > 0) {
                        console.log(`Role has been removed from the Data base Table.`);
                    }
                    else {
                        console.log("Failed to remove role from the Data base Table.");
                    }

                    const query = new Queries();
                    const updateEmployeeRoleIdUnderRemovedRole = query.updateEmployeeRoleIdUnderRemovedRole();
            
                    return Db.query(updateEmployeeRoleIdUnderRemovedRole, role_id);
                         
                }, err => {
                    return Db.close().then(() => { throw err; })
                }).then(rows => {

                    if (rows.affectedRows > 0) {
                        console.log("Employee roles have been updated in the Data base Table.");
                        return;                  
                    }
                    
                }).then(() => {
                    askQuestions();
                }).catch(err => {
                    console.log(err);
                });
            });        
    }).catch(err => {
        console.log(err);
    });
}
