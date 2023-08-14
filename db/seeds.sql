-- Sample departments
INSERT INTO department (name) VALUES
    ('Engineering'),
    ('Sales'),
    ('Human Resources');

-- Sample roles
INSERT INTO role (title, salary, department_id) VALUES
    ('Software Engineer Head', 120000, 1),
    ('Project Engineer', 80000, 1),
    ('Sales Representative Head', 75000, 2),
    ('Sales Executive', 55000, 2),
    ('Chief HR Officer', 100000, 3),
    ('HR Specialist Head', 65000, 3);

-- Sample employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ('John', 'Doe', 1, NULL),
    ('Jane', 'Smith', 3, NULL),
    ('Mike', 'Johnson', 5, NULL),
    ('Caleb', 'Rivera', 2, 1),
    ('Susan', 'Lee', 4, 3),
    ('Sam', 'Rayford', 6, 5);

