# SQL-Employee-Database

![License](https://img.shields.io/badge/License-MIT-blue.svg)

Build a command-line application from scratch to manage a company's employee database, using Node.js, Inquirer, and MySQL.

## User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Credits](#credits)
* [Contributors](#contributors)
* [Testing](#testing)
* [Questions](#questions)
* [Resources](#resources)

## Installation
The following necessary dependencies must be installed: npm [inquirer 8.2.4](https://www.npmjs.com/package/inquirer/v/8.2.4), [MySQL2](https://www.npmjs.com/package/mysql2) and [console.table](https://www.npmjs.com/package/console.table)

  ## Usage

  Open terminal and run node index.js. You'll be prompted with a list to view, add, update and delete roles, employees /or department. 

  [Demo](https://drive.google.com/file/d/1p3KzXtx4nV4H7qg06kx-5iHouJnwqMfR/view)

## Badges
* ![License](https://img.shields.io/badge/License-MIT-blue.svg)
* ![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
* ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
* ![Visual Studio](https://img.shields.io/badge/Visual%20Studio-5C2D91.svg?style=for-the-badge&logo=visual-studio&logoColor=white)

## Contributors

N/A


## Testing
```
run npm test on terminal
```

## Questions

For any questions, please contact me at the following links:
* **Creator** - 🎨 Raquel Tabarez
* [![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:raquelstabarez.07@gmail.com)
* [![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Raquel-t)
* [![Portfolio](https://img.shields.io/badge/Portfolio-%23000000.svg?style=for-the-badge&logo=firefox&logoColor=#FF7139)](https://raquel-t.github.io/Professional-Portfolio-2nd-assignment/)



## Resources
* [inquirer 8.2.4](https://www.npmjs.com/package/inquirer/v/8.2.4)
* [MySQL2](https://www.npmjs.com/package/mysql2)
* [console.table](https://www.npmjs.com/package/console.table)
* [Inquirer Official GitHub Repo](https://github.com/SBoudrias/Inquirer.js/)
* [mySQL Employees Sample Database](https://dev.mysql.com/doc/employee/en/)

## Credits

* [THOSCALLE YouTube](https://www.youtube.com/watch?v=m9CQxR0AfiQ)
