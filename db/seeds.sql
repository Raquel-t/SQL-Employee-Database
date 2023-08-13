-- Sample departments
INSERT INTO department (name) VALUES
    ('Engineering'),
    ('Sales'),
    ('Human Resources');

-- Sample roles
INSERT INTO role (title, salary, department_id) VALUES
    ('Software Engineer', 80000, 1),
    ('Sales Representative', 60000, 2),
    ('HR Specialist', 50000, 3);

-- Sample employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ('John', 'Doe', 1, NULL),
    ('Jane', 'Smith', 2, 1),
    ('Mike', 'Johnson', 3, 1);