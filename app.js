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
        }
    ])
}

//second called within init, reponsible for only one question/answer
function getEmployeeRole() {
    return inquirer.prompt(
        {
            type: "list",
            message: "What kind of employee would you like to add?",
            choices: ["Engineer", "Intern", "I do not want to add any/anymore employees"],
            name: "employeePosition",
        }).then(emp => emp.employeePosition)//TODO probably do not need
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
    return fileWriter(fileName, data)
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
        await writeHTML(outputPath, data)

    } catch (err) {
        if (err) throw new Error("Unfortanetly, I'm not just here to say hi, errors have arisen")
    }
}