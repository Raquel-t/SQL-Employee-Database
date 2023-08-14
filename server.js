const mysql = require('mysql2');
const inquirer = require('inquirer');
require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'employee_db'
}, console.log(`Connected to the employee_db database.`));

db.connect(function(err) {
    if (err) throw err;
    start();
});

// Prompts
function start() {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'View employees by manager',
                'View employees by department',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Update an employee manager',
                'Delete a department',
                'Delete a role',
                'Delete an employee',
                'Exit'
            ]
        })
        .then((answer) => {
            switch (answer.action) {
                case 'View all departments':
                    viewAllDepartments();
                    break;

                case 'View all roles':
                    viewAllRoles();
                    break;

                case 'View all employees':
                    viewAllEmployees();
                    break;

                case 'Add a department':
                    addDepartment();
                    break;

                case 'Add a role':
                    addRole();
                    break;

                case 'Add an employee':
                    addEmployee();
                    break;

                case 'Update an employee role':
                    updateEmployeeRole();
                    break;

                case 'Delete a department':
                    deleteDepartment();
                    break;

                case 'Delete a role':
                    deleteRole();
                    break;

                case 'Delete an employee':
                    deleteEmployee();
                    break;

                case 'Update an employee manager':
                    updateEmployeeManager();
                    break;

                case 'View employees by manager':
                    viewEmployeesByManager();
                    break;

                case 'View employees by department':
                    viewEmployeesByDepartment();
                    break;

                case 'Exit':
                    db.end();
                    break;
            }
        });
}

function addRole() {
    inquirer
        .prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Role title:'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Salary for the role:'
            },
            {
                name: 'department_id',
                type: 'input',
                message: 'Department ID for the role:'
            }
        ])
        .then((answer) => {
            db.promise().query('INSERT INTO role SET ?', answer)
                .then(() => {
                    console.log(`Added ${answer.title} to roles`);
                    start();
                })
                .catch((err) => console.error(err));
        });
}

function addEmployee() {
    db.promise().query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee')
        .then(([managers]) => {
            return inquirer
                .prompt([
                    {
                        name: 'first_name',
                        type: 'input',
                        message: 'Employee\'s first name:'
                    },
                    {
                        name: 'last_name',
                        type: 'input',
                        message: 'Employee\'s last name:'
                    },
                    {
                        name: 'role_id',
                        type: 'input',
                        message: 'Role ID for the employee:'
                    },
                    {
                        name: 'manager_id',
                        type: 'list',
                        message: 'Manager ID for the employee:',
                        choices: managers.map(manager => ({ name: manager.name, value: manager.id })).concat({ name: 'None', value: null })
                    }
                ]);
        })
        .then((answer) => {
            db.promise().query('INSERT INTO employee SET ?', answer)
                .then(() => {
                    console.log(`Added ${answer.first_name} ${answer.last_name} to employees`);
                    start();
                })
                .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
}

// Functionality for each department, roles and employees
function viewAllDepartments() {
    db.promise().query('SELECT id, name FROM department')
        .then(([rows]) => {
            console.table(rows);
            start();
        })
        .catch((err) => console.error(err));
}

function viewAllRoles() {
    const query = `
        SELECT role.id, role.title, department.name AS department, role.salary
        FROM role
        INNER JOIN department ON role.department_id = department.id
    `;
    db.promise().query(query)
        .then(([rows]) => {
            console.table(rows);
            start();
        })
        .catch((err) => console.error(err));
}



function viewAllEmployees() {
    const query = `
        SELECT e1.id, e1.first_name, e1.last_name, role.title, department.name AS department, role.salary, 
        CONCAT(e2.first_name, ' ', e2.last_name) AS manager
        FROM employee e1
        LEFT JOIN employee e2 ON e1.manager_id = e2.id
        INNER JOIN role ON e1.role_id = role.id
        INNER JOIN department ON role.department_id = department.id
    `;
    db.promise().query(query)
        .then(([rows]) => {
            console.table(rows);
            start();
        })
        .catch((err) => console.error(err));
}

function viewEmployeesByDepartment() {
    db.promise().query('SELECT id, name FROM department')
        .then(([departments]) => {
            inquirer.prompt([
                {
                    name: 'departmentId',
                    type: 'list',
                    message: 'For which department do you want to see the employees?',
                    choices: departments.map(department => ({ name: department.name, value: department.id }))
                }
            ])
            .then(answer => {
                const query = `
                    SELECT department.name AS Department, GROUP_CONCAT(CONCAT(employee.first_name, ' ', employee.last_name) ORDER BY employee.last_name ASC) AS Employees
                    FROM department
                    JOIN role ON department.id = role.department_id
                    JOIN employee ON role.id = employee.role_id
                    WHERE department.id = ?
                    GROUP BY department.id
                `;
                db.promise().query(query, [answer.departmentId])
                    .then(([rows]) => {
                        console.table(rows);
                        start();
                    })
                    .catch(err => console.error(err));
            });
        })
        .catch(err => console.error(err));
}

function viewEmployeesByManager() {
    db.promise().query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee')
        .then(([managers]) => {
            inquirer.prompt([
                {
                    name: 'managerId',
                    type: 'list',
                    message: 'For which manager do you want to see the employees?',
                    choices: managers.map(manager => ({ name: manager.name, value: manager.id }))
                }
            ])
            .then(answer => {
                const query = `
                    SELECT e1.manager_id, CONCAT(e2.first_name, ' ', e2.last_name) AS Manager, GROUP_CONCAT(CONCAT(e1.first_name, ' ', e1.last_name) ORDER BY e1.last_name ASC) AS Employees
                    FROM employee e1
                    JOIN employee e2 ON e1.manager_id = e2.id
                    WHERE e1.manager_id = ?
                    GROUP BY e1.manager_id, e2.first_name, e2.last_name
                `;
                db.promise().query(query, [answer.managerId])
                    .then(([rows]) => {
                        console.table(rows);
                        start();
                    })
                    .catch(err => console.error(err));
            });
        })
        .catch(err => console.error(err));
}

// functtion to add department, role and employee
function addDepartment() {
    inquirer
        .prompt([
            {
                name: 'name',
                type: 'input',
                message: 'What is the name of the new department?'
            }
        ])
        .then((answer) => {
            db.promise().query('INSERT INTO department SET ?', { name: answer.name })
                .then(() => {
                    console.log(`Added ${answer.name} to departments`);
                    start();
                })
                .catch((err) => console.error(err));
        });
}

// Updating employee 
function updateEmployeeRole() {
    // First get all employees
    db.promise().query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee')
        .then(([employees]) => {
            inquirer.prompt([
                {
                    name: 'employeeId',
                    type: 'list',
                    message: 'Which employee do you want to update?',
                    choices: employees.map(employee => ({ name: employee.name, value: employee.id }))
                }
            ])
            .then((answers) => {
                // Get all roles
                db.promise().query('SELECT id, title FROM role')
                    .then(([roles]) => {
                        inquirer.prompt([
                            {
                                name: 'roleId',
                                type: 'list',
                                message: 'What is the new role for this employee?',
                                choices: roles.map(role => ({ name: role.title, value: role.id }))
                            }
                        ])
                        .then(roleAnswer => {
                            db.promise().query('UPDATE employee SET role_id = ? WHERE id = ?', [roleAnswer.roleId, answers.employeeId])
                                .then(() => {
                                    console.log('Updated employee role');
                                    start();
                                })
                                .catch(err => console.error(err));
                        });
                    });
            });
        })
        .catch(err => console.error(err));
}

function updateEmployeeManager() {
    db.promise().query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee')
        .then(([employees]) => {
            inquirer.prompt([
                {
                    name: 'employeeId',
                    type: 'list',
                    message: 'Which employee\'s manager do you want to update?',
                    choices: employees.map(employee => ({ name: employee.name, value: employee.id }))
                },
                {
                    name: 'managerId',
                    type: 'list',
                    message: 'Who is the new manager for this employee?',
                    choices: employees.map(employee => ({ name: employee.name, value: employee.id })).concat({ name: 'None', value: null })
                }
            ])
            .then(answers => {
                db.promise().query('UPDATE employee SET manager_id = ? WHERE id = ?', [answers.managerId, answers.employeeId])
                    .then(() => {
                        console.log('Updated employee\'s manager.');
                        start();
                    }) 
                    .catch(err => console.error(err));
            });
        })
        .catch(err => console.error(err));
}

function deleteDepartment() {
    db.promise().query('SELECT id, name FROM department')
        .then(([departments]) => {
            inquirer.prompt([
                {
                    name: 'departmentId',
                    type: 'list',
                    message: 'Which department do you want to delete?',
                    choices: departments.map(department => ({ name: department.name, value: department.id }))
                }
            ])
            .then((answer) => {
                // Gets the count of roles and employees associated with the department
                return db.promise().query(`
                    SELECT 
                        (SELECT COUNT(*) FROM role WHERE department_id = ?) AS role_count,
                        (SELECT COUNT(*) FROM employee WHERE role_id IN (SELECT id FROM role WHERE department_id = ?)) AS employee_count
                `, [answer.departmentId, answer.departmentId])
                .then(([counts]) => {
                    if (counts[0].role_count > 0 || counts[0].employee_count > 0) {
                        // Presents the count to the user
                        return inquirer.prompt([
                            {
                                name: 'action',
                                type: 'list',
                                message: `There are ${counts[0].role_count} roles and ${counts[0].employee_count} employees associated with this department. What would you like to do?`,
                                choices: [
                                    'Delete all associated roles and employees, then the department',
                                    'Go back to the main menu'
                                ]
                            }
                        ])
                        .then(choice => {
                            if (choice.action === 'Delete all associated roles and employees, then the department') {
                                // Deletes employees associated with the roles of this department
                                return db.promise().query('DELETE FROM employee WHERE role_id IN (SELECT id FROM role WHERE department_id = ?)', [answer.departmentId])
                                .then(() => {
                                    // Deletes all roles associated with the department
                                    return db.promise().query('DELETE FROM role WHERE department_id = ?', [answer.departmentId]);
                                });
                            } else {
                                throw new Error('User chose to not delete department with associated roles and employees.');
                            }
                        });
                    }
                })
                .then(() => {
                    // deletes the department
                    return db.promise().query('DELETE FROM department WHERE id = ?', [answer.departmentId]);
                })
                .then(() => {
                    console.log('Deleted department successfully!');
                    start();
                });
            })
            .catch(err => {
                if (err.message === 'User chose to not delete department with associated roles and employees.') {
                    console.log(err.message);
                    start();
                } else {
                    console.error(err);
                }
            });
        })
        .catch(err => console.error(err));
}

function deleteRole() {
    db.promise().query('SELECT id, title FROM role')
        .then(([roles]) => {
            inquirer.prompt([
                {
                    name: 'roleId',
                    type: 'list',
                    message: 'Which role do you want to delete?',
                    choices: roles.map(role => ({ name: role.title, value: role.id }))
                }
            ])
            .then((answer) => {
                // Gets the count of employees associated with the role
                return db.promise().query('SELECT COUNT(*) AS employee_count FROM employee WHERE role_id = ?', [answer.roleId])
                .then(([counts]) => {
                    if (counts[0].employee_count > 0) {
                        // Presents the count to the user
                        return inquirer.prompt([
                            {
                                name: 'action',
                                type: 'list',
                                message: `There are ${counts[0].employee_count} employees associated with this role. What would you like to do?`,
                                choices: [
                                    'Delete all associated employees, then the role',
                                    'Go back to the main menu'
                                ]
                            }
                        ])
                        .then(choice => {
                            if (choice.action === 'Delete all associated employees, then the role') {
                                // Deletes employees associated with the role
                                return db.promise().query('DELETE FROM employee WHERE role_id = ?', [answer.roleId]);
                            } else {
                                throw new Error('User chose to not delete role with associated employees.');
                            }
                        });
                    }
                })
                .then(() => {
                    // deletes the role
                    return db.promise().query('DELETE FROM role WHERE id = ?', [answer.roleId]);
                })
                .then(() => {
                    console.log('Deleted role successfully!');
                    start();
                });
            })
            .catch(err => {
                if (err.message === 'User chose to not delete role with associated employees.') {
                    console.log(err.message);
                    start();
                } else {
                    console.error(err);
                }
            });
        })
        .catch(err => console.error(err));
}

function deleteEmployee() {
    db.promise().query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee')
        .then(([employees]) => {
            inquirer.prompt([
                {
                    name: 'employeeId',
                    type: 'list',
                    message: 'Which employee do you want to delete?',
                    choices: employees.map(employee => ({ name: employee.name, value: employee.id }))
                }
            ])
            .then((answer) => {
                db.promise().query('DELETE FROM employee WHERE id = ?', [answer.employeeId])
                    .then(() => {
                        console.log('Deleted employee successfully!');
                        start();
                    })
                    .catch(err => console.error(err));
            });
        })
        .catch(err => console.error(err));
}

