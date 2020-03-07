// TODO: Write code to define and export the Intern class.  HINT: This class should inherit from Employee.
const Employee = require("./Employee")

class Intern extends Employee{
    constructor(name, id, email, school) {
        super(name, id, "Intern", email)
        this.school = school
    }

    getRole() {
        return "Intern"
    }
    // getRole = () => "Intern"

    getSchool() {
        return this.school
    }
}

module.exports = Intern