# Employee-Tracker &middot; ![node](https://img.shields.io/badge/node-12.16.2-blue) ![npm](https://img.shields.io/badge/npm-6.14.5-blue) ![inquirer](https://img.shields.io/badge/inquirer-7.1.0-blue) ![mysql](https://img.shields.io/badge/mysql-6.14.5-blue) 

![Employee-Tracker](/images/Employee-Tracker-View-All-Employees.png) 

## Description 
The Employee Tracker Application is a command-line/terminal application used to input and display employee data for a business or organization. It gives the user the ability to enter and save information such as the employee’s name, job title, department, salary, and manager. It also provides the capability of removing any of those categories and automatically updating the associated data accordingly. 

## Table of Contents 
* [Installation](#installation) 
* [Usage](#usage) 
* [License](#license) 
* [Questions](#questions) 
 
## Installation 
1.  Run npm install node inside command-line/terminal  
2.  navigate to project folder and run npm i inquirer mysql to install dependencies  
3.  Run node app.js to start application.  
 
## Usage 
1.  When the application starts, the user is shown the Main Menu with a choice list. The top four selection view the data, while the rest modify the data. The image only displays the beginning of the list. Press the down arrow key to view the rest. ![Main-Menu](/images/Main-Menu.png) 
2.  The View All Employees option displays all employees that have been entered into the database including the following data: id, first name, last name, title, department, salary, manager. ![View-All-Employees](/images/View-All-Employees.png) 
3.  The next three choices views all employees based on categories: Department, Role, and Manager. The following example displays all employees within the Engineering Department: ![View-Employees-By-Dept](/images/View-Employees-By-Dept.png) 
4. The next three options are used to enter a Department, Role, or Employee into the database. Note: A department must be added before a Role can be added, and both a Department and a Role must both be added before an Employee can be added because the list of choices for Department and Role are taken from preexisting entries in the database. ![Add-Employee-Assign-Job-Title](/images/Add-Employee-Assign-Job-Title.png) When an Employee is being added, assigning that employee a manager is optional. When the “None” option is selected, a value of “null” is assigned the the employee’s manager column. ![Add-Employee](/images/Add-Employee.png) 
5.  ![Table-Headers](/images/Table-Headers.png) ![Employee-Record-null-manager](/images/Employee-Record-null-manager.png) 
6.  When an employee is removed, his or her data is completely removed from the database. When a department is removed from the database, a “null” value will be put in place of the department name in the table. For example, if the Human Resources department is removed, all departments with that name will be replaced with a “null” value. Notice how in the following table, Human Resources was replaced with “null” ![Remove-Department](/images/Remove-Department.png)When a role is removed, the value matching that role is set to “null” and also the department alongside that role is also set to null for employees that previously had that role. For example, when “Lawyer” is removed, only records with role “Lawyer” and “Legal” are set to null. “Legal Team Lead” and “Legal” are unaffected. ![Remove-Role](/images/Remove-Role.png) 
7.  In the case of when a department is removed, and any of it’s associated departments are not, there is also the option of assigning a Role to a Department. This option displays preexisting role options to choose from and preexisting department options to choose from so any department or roles that were previously removed must be added again in order to assign them. For example, in the case of removing the Human Resources department, the HR Representative role is left without a department assigned to it. ![Remove-Department](/images/Remove-Department.png) 
8.  The Human Resources department must be added again before the HR Representative Role can be assigned to it. ![Assign-Role-To-Department](/images/Assign-Role-To-Department.png) 
 

## License 
There is not a license for this application. 

## Questions 
![GitHub Profile Image](https://avatars.githubusercontent.com/u/6642173?) 

 njr7romano@yahoo.com