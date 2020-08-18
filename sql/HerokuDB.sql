USE employee_tracker_cms;

CREATE TABLE employee(
	id int auto_increment not null,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int null,
    manager_id int null,
    primary key (id)
);

CREATE TABLE department(
	id int auto_increment not null,
    name varchar(30) not null,
    primary key (id)
);

CREATE TABLE role(
	id int auto_increment not null,
    title varchar(30) not null,
    salary decimal(30) not null,
    department_id int null,
    primary key (id)
);

TRUNCATE TABLE employee;
TRUNCATE TABLE role;
TRUNCATE TABLE department;

SHOW INDEX FROM department;
DROP INDEX Key_name ON department;

ALTER TABLE department ADD UNIQUE (name);
ALTER TABLE role ADD UNIQUE (title);

SELECT * FROM employee;
SELECT * FROM department;
SELECT * FROM role;