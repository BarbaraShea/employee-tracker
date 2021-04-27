const mysql = require('mysql');
const inquirer = require('inquirer');
const fs = require('fs');
const cTable = require('console.table');


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'webDev256$RIOPIO',
    database: 'employee_DB',
  });

function start() {  
    inquirer
    .prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: ['Add departments, roles, employees', 'View departments, roles, employees', 'Update employee roles', 'Update employee managers', 'View employees by manager', 'Delete departments, roles, and employees', 'View the total utilized budget of a department', 'Exit']
      }
  
    ])
    .then((answer) => {
        switch (answer.action) {
          case 'Add departments, roles, employees':
            add();
            break;
  
          case 'View departments, roles, employees':
            view();
            break;
  
          case 'Update employee roles':
            updateRole();
            break;

          case 'Update employee managers':
            updateManager();
            break;
  
          case 'View employees by manager':
            viewByManager();
            break;

          case 'Delete departments, roles, and employees':
            remove();
            break;

          case 'View the total utilized budget of a department':
            budgetByDepartment();
            break;

          case 'Exit':
            connection.end();
            break;
  
          default:
            console.log(`Invalid action: ${answer.action}`);
            break;
        }
      });
  };

  //ADD functions
const add = () => {
    inquirer
      .prompt([
        {
          name: 'add',
          type: 'list',
          message: 'What would you like to add?',
          choices: ['employee','role','department']
        },
      ])
      .then((answer) => {
        switch (answer.add) {
          case 'employee':
            addEmployee();
            break;
  
          case 'role':
            addRole();
            break;
  
          case 'department':
            addDepartment();
            break;
  
          case 'Exit':
            connection.end();
            break;
  
          default:
            console.log(`Invalid action: ${answer.add}`);
            break;
        }
      });

const addEmployee = () => {
    inquirer
    .prompt([
      {
        name: 'first_name',
        type: 'input',
        message: 'What is the employees first name?',
      },
      {
        name: 'last_name',
        type: 'input',
        message: 'What is the employees last name?',
      },
      {
        name: 'role_id',
        type: 'input',
        message: 'What is the employee role id?',
        validate(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
      },
    ]) 
    .then((answer) => {
        connection.query(
          'INSERT INTO employee SET ?',
          {
            first_name: answer.first_name,
            last_name: answer.last_name,
            manager_id: answer.manager_id,
            role_id: answer.role_id,
          },
          (err) => {
            if (err) throw err;
            console.log('The employee was created successfully!');
            start();
          }
        );
      });
  };
  };

const addRole = () => {
    inquirer
    .prompt([
      {
        name: 'title',
        type: 'input',
        message: 'What is role title?',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the salary?',
      },
      {
        name: 'department_id',
        type: 'input',
        message: 'Enter the department_id.',
        validate(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
      },
    ]) 
    .then((answer) => {
        connection.query(
          'INSERT INTO role SET ?',
          {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.department_id,
          },
          (err) => {
            if (err) throw err;
            console.log('The role was created successfully!');
            start();
          }
        );
      });
  };

const addDepartment = () => {
    inquirer
    .prompt([
      {
        name: 'name',
        type: 'input',
        message: 'What is the department name?',
      },
    ]) 
    .then((answer) => {
        connection.query(
          'INSERT INTO departments SET ?',
          {
            name: answer.name,
          },
          (err) => {
            if (err) throw err;
            console.log('The department was created successfully!');
            start();
          }
        );
      });
  };

  //VIEW functions
const view = () => {
    inquirer
    .prompt([
      {
        name: 'view',
        type: 'list',
        message: 'What would you like to view?',
        choices: ['employees','roles','departments']
      },
    ])
    .then((answer) => {
      switch (answer.view) {
        case 'employees':
          viewEmployee();
          break;

        case 'roles':
          viewRole();
          break;

        case 'departments':
          viewDepartment();
          break;

        case 'Exit':
          connection.end();
          break;

        default:
          console.log(`Invalid action: ${answer.view}`);
          break;
      }
    });

  };

const viewEmployee = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;     
        console.table(res);
        start();
});
  };

const viewRole = () => {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;     
        console.table(res);
        start();
});  
  };

const viewDepartment = () => {
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;     
        console.table(res);
        start();

});
  };

  // UPDATE functions
const updateRole = () => {
  console.log("works");
  connection.query('SELECT * FROM employee', (err, results) => {
    if (err) throw err;
    inquirer
    .prompt([
      {
        name: 'choice',
        type: 'rawlist',
        message: 'Select an employee:',
        choices(){
          const employeeArray = [];
          results.forEach(({ first_name, last_name } ) => {
            // let fullname = first_name + " " + last_name;
            employeeArray.push(`${first_name} ${last_name}`);
          });
          return employeeArray;
        } 
      },
      {
        name: 'newRole',
        type: 'input',
        message: 'What is the employees new role?',
      },
    ])
    .then((answer) => {
      let chosenEmployee;
        results.forEach((employee) => {
          if (employee.id === answer.choice) {
            chosenEmployee = employee;
          }
      connection.query(
        'UPDATE employee SET ? WHERE ?',
        [
          {
            role: answer.newRole,
          },
          {
            id: chosenEmployee.id,
          },
        ],
        (error) => {
          if (error) throw err;
          console.log('Employee role updated successfully!');
          start();
        }
      );
    });
  });
});
};

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    start();
  });
