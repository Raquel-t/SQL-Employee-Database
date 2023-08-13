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
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
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
    inquirer
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
                type: 'input',
                message: 'Manager ID for the employee:'
            }
        ])
        .then((answer) => {
            db.promise().query('INSERT INTO employee SET ?', answer)
                .then(() => {
                    console.log(`Added ${answer.first_name} ${answer.last_name} to employees`);
                    start();
                })
                .catch((err) => console.error(err));
        });
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