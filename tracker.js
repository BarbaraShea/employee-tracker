const mysql = require('mysql');
const inquirer = require('inquirer');
const fs = require('fs');

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
        choices: ['Add departments, roles, employees', 'View departments, roles, employees', 'Update employee roles', 'Exit']
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
  
          case 'Exit':
            connection.end();
            break;
  
          default:
            console.log(`Invalid action: ${answer.action}`);
            break;
        }
      });
  };

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

}

const viewEmployee = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;     
            res.forEach(({ first_name, last_name}) =>
              console.log(
                `${last_name}, ${first_name}`
              )
            );
});
};

const viewRole = () => {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;     
            res.forEach(({ title, salary}) =>
              console.log(
                `${title} || ${salary}`
              )
            );
});  
}

const viewDepartment = () => {
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;     
            res.forEach(({name}) =>
              console.log(
                `${name}`
              )
            );
});
};

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    start();
});
