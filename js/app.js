/**
 * Created by lukedowell on 7/17/15.
 */
$(document).ready(function() {

    //When the submit button is pressed on our form
    //.submit was acting strangely so I switched to a standard event handler
    $("#submitButton").on('click', function(event) {
        event.preventDefault(); //prevent a page refresh

        //Check to see if we already have an employee with the provided ID
        var empId = $("[name='empNum']").val();
        if(findEmployeeById(empId) == null) {

            //Put all our information into a jquery object
            var emp = new Employee(
                $("[name='firstName']").val(),
                $("[name='lastName']").val(),
                empId,
                $("[name='empTitle']").val(),
                $("[name='empReview']").val(),
                $("[name='empSalary']").val()
            );
            employees.push(emp);
            var employeeCard = new EmployeeCard(emp);
            employeeCards.push(employeeCard);
            insertCard(employeeCard);
        } else {

            //We already have an employee with that ID
            alert("That employee number is already taken!");
        }
    });

    $("#randomizeButton").on('click', function(event){
        event.preventDefault();

        var emp = generateEmployee();
        if(findEmployeeById(emp) != null) {
            var createdValidEmployee = false;
            while(!createdValidEmployee) {
                emp = generateEmployee();
                if(findEmployeeById(emp) == null) {
                    createdValidEmployee = true;
                }
            }
        }
        console.log(emp);
        employees.push(emp);
        var employeeCard = new EmployeeCard(emp);
        employeeCards.push(employeeCard);
        insertCard(employeeCard);
    });

    $("#closeButton").on('click', function(event) {
        event.preventDefault();
        $("#entryOverlay").hide();
    });

    $("header").on('click', function() {
        $("#entryOverlay").show();
    });
});

var employees = []; //Where we store our employees
var employeeCards = []; //Where we store our employee cards

//Our arrays containing 'random' information
var FIRST_NAMES = ["Abraham", "Bob", "Carl", "Dan", "Ebert", "Frank", "George", "Heather", "Io", "Susan", "Sandy", "Salmon", "Sorbet", "Shakira", "Rafi", "Rufus", "Rondo", "Mazer", "Mack", "Mistriss"];
var LAST_NAMES = ["Abbot", "Barf", "Constantine", "Dillenger", "Eckhart", "O'Mally", "O'Donnel", "O'SayCanYouSee", "Smith" , "Rackham", "Dowell", "Alan", "Ender", "Valentine"];
var OCCUPATION = ["Painter", "Printer", "Police-r", "Programmer", "Podcaster", "Mailman", "Pool Boy", "Ninja", "Spy", "Pidgeon", "Consumer", "Buyer", "Seller"];

/**
 * An employee object
 * @param first
 *      First name
 * @param last
 *      Last name
 * @param id
 *      Employee ID
 * @param title
 *      Employee title
 * @param review
 *      Employee review rating
 * @param salary
 *      Employee salary
 * @constructor
 */
function Employee(first, last, id, title, review, salary) {
    this.firstName = first;
    this.lastName = last;
    this.id = id;
    this.title = title;
    this.review = review;
    this.salary = salary;
}

/**
 * Creates an employee card element
 * @param employee
 *      The employee whose information we want to populate the card with
 */
function EmployeeCard(employee) {
    //Pull out all their information into paragraph elements
    this.$pName = $("<p/>", {
        class: "employeeName",
        text: employee.firstName + " " + employee.lastName
    });

    this.$pId = $("<p/>", {
        class: "employeeId",
        text: employee.id
    });

    this.$pTitle = $('<p/>', {
        class: "employeeTitle",
        text: employee.title
    });

    this.$pSalary = $('<p/>', {
        class: "employeeSalary",
        text: employee.salary
    });

    this.$pReview = $('<p/>', {
        class: "employeeReview",
        style: "color: " + getReviewColor(employee.review),
        text: "Review: " + employee.review
    });

    this.$cardHeader = $("<div/>", {
        class: "employeeCardHeader"
    });

    this.$card = $("<div/>", {
        class: "employeeCard"
    });
}

/**
 * Creates an employee with semi-random information
 * @returns {Employee}
 *      A randomized employee
 */
function generateEmployee() {
    var randomId = "";
    var randomIdLength = 5;
    for(var i = 0; i < randomIdLength; i++) {
        randomId += getRandomInt(0, 10);
    }
    return new Employee(
        FIRST_NAMES[getRandomInt(0, FIRST_NAMES.length)],
        LAST_NAMES[getRandomInt(0, LAST_NAMES.length)],
        randomId,
        OCCUPATION[getRandomInt(0, OCCUPATION.length)],
        getRandomInt(1, 6),
        getRandomInt(0, 100000)
    )
}

/**
 * Inserts an employee card into our container alphabetically
 * @param employeeCard
 */
function insertCard(employeeCard) {

    var added = false;

    employeeCard.$cardHeader.append(employeeCard.$pName);
    employeeCard.$cardHeader.append(employeeCard.$pId);

    employeeCard.$card.append(employeeCard.$cardHeader);
    employeeCard.$card.append(employeeCard.$pTitle);
    employeeCard.$card.append(employeeCard.$pSalary);
    employeeCard.$card.append(employeeCard.$pReview);

    $(".employeeCardContainer > .employeeCard > .employeeCardHeader > .employeeName").each(function() {
        var currentCardName = $(this).text().split(" ")[0]; //Get the first name
        var newCardName = employeeCard.$pName.text().split(" ")[0]; //Get the first name
        console.log(currentCardName + " " + newCardName);
        if((newCardName < currentCardName || newCardName === currentCardName) && !added) {
            console.log("1");
            $(this).parent().parent().before(employeeCard.$card);
            added = true;
        }
    });

    if(!added) {
        $(".employeeCardContainer").append(employeeCard.$card);
    }
}

/**
 * Finds and returns an employee from our array based
 * on their ID.
 * @param id
 *      The employee's id
 * @returns {*}
 *      An employee. Returns null if no employee is found
 */
function findEmployeeById(id) {
    for(var i = 0; i < employees.length; i++) {
        var emp = employees[i];
        if(emp.id == id) { //Type doesn't matter
            return emp;
        }
    }
    return null;
}

/**
 * Returns a random number
 * @param min
 *      Minimum number inclusive
 * @param max
 *      Max number exclusive
 * @returns {*}
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Gives a color based on review score
 * @param review
 *      The review score
 * @returns {string}
 *      A string color value
 */
function getReviewColor(review) {
    var color = "red";
    switch(review) {
        case 5:
            color = "gold";
            break;
        case 4:
            color = "green";
            break;
        case 3:
            color = "brown";
            break;
        case 2:
            color = "orange";
            break;
    }
    return color;
}