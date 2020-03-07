const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");
const util = require("util")

const fileWriter = util.promisify(fs.writeFile)

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
//first call is to the asyn init function
init()

var id = 1;
const employees = []

//method responsible for manager details
//first called within init
function getManagerDetails() {
    return inquirer.prompt([
        {
            type: "input",
            message: "What is your name?",
            name: "name"//might have to make this into manager name
        },
        {
            type: "input",
            message: "What is your email?",
            name: "email"
        },
        {
            type: "input",
            message: "What is your office number?",
            name: "officeNumber"
        }])
    // ]).then(input => {
    // id++;
    // return new Manager(input.name, id, input.email, input.officeNumber)
    // })
}

//second called within init, reponsible for only one question/answer
function getEmployeeRole() {
    return inquirer.prompt(
        {
            type: "list",
            message: "What kind of employee would you like to add?",
            choices: ["Engineer", "Intern", "I do not want to add any/anymore employees"],
            name: "employeePosition",
        }).then(emp => emp.employeePosition)
}

function employeeDetails(role) {
    //switch statement will deviate into a question relevant to the employee's role

    questions = [{
        type: "input",
        message: `What is the ${role}'s name?`,
        name: "name"
    },
    {
        type: "input",
        message: "What is their email?",
        name: "email"
    }]
    
    switch (role) {
        case "Engineer":
            questions.push(
                {
                    type: "input",
                    message: "What is their GitHub username?",
                    name: "gitUsername"
                })
                break
        case "Intern":
            questions.push(
                {
                    type: "input",
                    message: "What school does this intern go to?",
                    name: "internSchool"
                })
                break
            }
    return inquirer.prompt(questions)
}

function writeHTML(fileName, data) {
    fileWriter(fileName, data)
}

async function init() {

    try {
        //get manager details
        const manager = await getManagerDetails()
        employees.push(new Manager(manager.name, id++, manager.email, manager.officeNumber))
        let role = await getEmployeeRole()
        //make sure the dude wants to add an employee
        if (role != "I do not want to add any/anymore employees") {
            //the dude wanted to add an employee
            while (role != "I do not want to add any/anymore employees") {
                //fill in the details for the current employee
                emp = await employeeDetails(role)
                role == "Engineer" ? employees.push(new Engineer(emp.name, id++, emp.email, emp.gitUsername)) : employees.push(new Intern(emp.name, id++, emp.email, emp.internSchool))
                //prompt to see if they want to add another employee and if so then what role
                role = await getEmployeeRole()
            }
        }

        const data = await render(employees)

        // await writeHTML(render)
        writeHTML(outputPath, data)

    } catch (err) {
        if (err) throw new Error("Unfortanetly, I'm not just here to say hi, errors have arisen")
    }

    // console.log(employees)
}
// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!


// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an 
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work!