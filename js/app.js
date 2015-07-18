/**
 * Created by lukedowell on 7/17/15.
 */
$(document).ready(function() {

    //When the submit button is pressed on our form
    //.submit was acting strangely so I switched to a standard event handler
    $("#submitButton").on('click', function(event) {
        event.preventDefault(); //prevent a page refresh
        var $form = $("#entryForm");

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
    });
});

var employees = []; //Where we store our employees
var employeeCards = []; //Where we store our employee cards

//Our arrays containing 'random' information
var FIRST_NAMES = ["Susan", "Sandy", "Salmon", "Sorbet", "Shakira", "Rafi", "Rufus", "Rondo", "Mazer", "Mack", "Mistriss"];
var LAST_NAMES = ["O'Mally", "O'Donnel", "O'SayCanYouSee", "Smith" , "Rackham", "Dowell", "Alan", "Ender", "Valentine"];
var OCCUPATION = ["Painter", "Printer", "Police-r", "Programmer", "Podcaster", "Mailman", "Pool Boy", "Ninja", "Spy"];

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
    var $pName = $("<p/>", {
        class: "employeeName",
        text: employee.firstName + " " + employee.lastName
    });

    var $pId = $("<p/>", {
        class: "employeeId",
        text: employee.id
    });

    var $pTitle = $('<p/>', {
        class: "employeeTitle",
        text: employee.title
    });

    var $pSalary = $('<p/>', {
        class: "employeeSalary",
        text: employee.salary
    });

    var $pReview = $('<p/>', {
        class: "employeeReview",
        text: "Review: " + employee.review
    });

    var $card = $("<div/>", {
        class: "employeeCard"
    });

    var $cardHeader = $("<div/>", {
        class: "employeeCardHeader"
    });

    $cardHeader.append($pName);
    $cardHeader.append($pId);

    $card.append($cardHeader);
    $card.append($pTitle);
    $card.append($pSalary);
    $card.append($pReview);

    $(".employeeCardContainer").append($card);
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
        getRandomInt(0, 6),
        getRandomInt(0, 100000)
    )
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