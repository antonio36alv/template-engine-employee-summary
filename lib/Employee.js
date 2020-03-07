// TODO: Write code to define and export the Employee class
class Employee {
    constructor(name, id, email) {
        //TODO possibly add 
        this.name = name
        this.id = id//find away to assign this automatticaly
        // this.role = role
        this.email = email

    }
    // getRole = () => "Employee"//this.role
    //TODO look into it - might need to add some functions or just more

    getName() {
        return this.name
    }

    getId() {
        return this.id
    }

    getEmail() {
        return this.email
    }

    getRole() {
        return "Employee"
    }
}

// Employee. bc i wanted to do a static variable in some sorts
module.exports = Employee