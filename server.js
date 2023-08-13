const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // Add MySQL password here
        password: 'Secret.flower1276!',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
);

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