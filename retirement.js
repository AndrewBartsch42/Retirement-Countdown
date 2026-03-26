"use strict";

// Defer in HTML allows us to grab these immediately at the top
const $ = selector => document.querySelector(selector);

const nameIn    = $("#client_name");
const emailIn   = $("#email");
const investIn  = $("#investment");
const addIn     = $("#monthly_add");
const rateIn    = $("#rate");
const dateIn    = $("#retirement_date");
const errBox    = $("#error_message");
const statusMsg = $("#status_message");
const output    = $("#projection_output");
const form      = $("#projection_form");
const testData  = $("#test_data");

let projectionTimer = null;

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const processEntries = (evt) => {
    let isValid = true;
    let years = 0;

    evt.preventDefault();
    resetForm()

    const invest =  parseFloat(investIn.value);
    const add = parseFloat(addIn.value);
    const rate = parseFloat(rateIn.value);

    // Validate the name
    if (nameIn.value.trim() === "") {
        $("#name_error").textContent = nameIn.title; // Pulls from title attribute
        isValid = false;
    }

        const emailPattern = /^[a-zA-Z0-9_]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(emailIn.value.trim())) {
            $("#email_error").textContent = emailIn.title;
            isValid = false;
        }


    /* TODO: Validate Date
        if date is empty
            display error similar to name logic
        else
            years = user's year - the current year
            if years is less or equal to 0 || greater than 75
                display error similar to name logic

     */
    if (dateIn.value.trim() === "") {
        $("#retire_date_error").textContent = dateIn.title;
        isValid = false;
    } else{
        const today = new Date();
        const retireDate = new Date(dateIn.value);
        years = retireDate.getFullYear() - today.getFullYear();

        if (years <= 0 || years > 75){
            $("#retire_date_error").textContent = dateIn.title;
            isValid = false;
        }
    }

    if (isNaN(invest) || invest < 0) {
        $("#investment_error").textContent = investIn.title;
        isValid = false;
    }

    /*
     TODO: do the same for the other two numeric input values
        based on the input field's title data validation message
     */
    if (isNaN(add) || add < 0) {
        $("#add_error").textContent = addIn.title;
        isValid = false;
    }

    if (isNaN(rate) || rate < 0) {
        $("#rate_error").textContent = rateIn.title;
        isValid = false;
    }

    /* TODO: Code try-catch logic
        try
            if not valid then throw error "Please correct the entries highlighted below."
            NOTE: otherwise the following 2 statements will run
            document.body.style.width = "350px";
            startProjection(nameIn.value, invest, add, rate, years);
         catch(e)
            set the body width to 700px (like code above)
            errBox.textContent = e.message;
     */
    try {
        if (!isValid) {
            throw new Error("Please correct the entries highlighted below.");
        }

        document.body.style.width = "350px";
        startProjection(nameIn.value, invest, add, rate, years);
    } catch (e) {
        document.body.style.width = "700px";
        errBox.textContent = e.message;
    }
};

const startProjection = (name, bal, add, rate, years) => {
    console.log(years);
    statusMsg.textContent = `Live Projection: ${name}`;
    statusMsg.style.color = "red";
    let count = 1;

    const startYear = new Date().getFullYear();

    let formattedBal = formatter.format(bal);
    output.textContent = `Year ${startYear} = ${formattedBal}`;

    projectionTimer = setInterval(() => {
    /* TODO: code the interval logic
        for (let i = 0; i < 12; i++) {
            bal = ((bal + add) * (1 + (rate / 12 / 100))).toFixed(2);
        }
        format the balance - see code above
        update the output - see code above
        if count is >= years
            clear interval projectionTimer (Ch 8)
            update the statusMsg to Calculation Completed! (like code above)
            set the statusMsg to red (like code above)
        end if
        add one to the count
     */
        for (let i = 0; i < 12; i++) {
            bal = ((bal + add) * (1 + (rate / 12 / 100))).toFixed(2);
        }
        const formatted = formatter.format(bal);
        output.textContent = `Year ${startYear + count} = ${formatted}`;

        if (count >= years){
            clearInterval(projectionTimer);
            statusMsg.textContent = "Calculation Complete!";
            statusMsg.style.color = "red";
        }
        count++;



    }, 1000);
};

const setTestData = () => {
    resetForm();
    /* TODO: set default value for all input fields
        Setup the future date to 10 years from now:
        (1) create a const variable named future and set it to the current date (Ch 8)
        (2) add 10 years to the future date variable (Ch 8)
        (3) use toISOString().split('T')[0] to display the future date (Ch 8)
     */
    nameIn.value = "Joe Smith";
    emailIn.value = "josmith@wsc.edu";
    investIn.value = "100000";
    addIn.value = "500";
    rateIn.value = "5.5";

    const future = new Date();
    future.setFullYear(future.getFullYear() + 10)
    dateIn.value = future.toISOString().split('T')[0];
};

const resetForm = () => {
    /* TODO:
        Using textContent clear the following error spans
            errBox (#error_message)
            output (#projection_output)
            statusMsg (#status_message)
        clear the interval projectionTimer (Ch 8)
        reset all the error spans back to *
            document.querySelectorAll(".error").forEach(s => s.textContent = "*");
        set the body width to 350px (see code example above)
        set the statusMsg to red (see code example above)
        set the focus to the name input field (Ch 9)
     */
    const errBoxes = document.getElementsByClassName("error");
    for(var i = 0; i < errBoxes.length; i++){
        errBoxes[i].textContent = "*";
    }
    errBox.textContent = "";
    document.body.style.width = "350px";
    statusMsg.color = "red";
    nameIn.focus();
    clearInterval(projectionTimer);
};

document.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", processEntries);
    form.addEventListener("reset", resetForm);
    testData.addEventListener("click", setTestData);
});