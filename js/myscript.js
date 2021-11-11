// File: myscript.js
// GUI Assignment: HW4 Using the jQuery Plugin/UI with Dynamic Multiplication Table
//     Create a dynamic table based on an HTML form using JavaScript
// Sofya Chow, Sofya_Chow@student.uml.edu
// Last Updated On: Nov 11, 2021       

// https://www.tutorialspoint.com/jqueryui/jqueryui_slider.htm
// This source helped me create the sliders and how to link to textfield
// When the DOM is ready, execute the javascript script
$(document).ready(function () {
    // The first portion of this function is declaring the sliders and updating its
    // value to the corresponding textfield
    // E.g.  ---x--- to ------x changes textfield from 4 to 7

    // For each slider, there will be a range of -50 and 50
    $("#slide_lower_hor").slider({
        value: 0,
        min: -50,
        max: 50,
        orientation: "horizontal",
        // When the slider is moved, the text is reflected in the textfield
        slide: function (event, ui) {
            $("#lower_horizontal").val(ui.value);
            $("#form_id").submit();
        }
    });

    // Repeat for each slider and textfield pair
    $("#slide_upper_hor").slider({
        value: 0,
        min: -50,
        max: 50,
        orientation: "horizontal",
        slide: function (event, ui) {
            $("#upper_horizontal").val(ui.value);
            $("#form_id").submit();
        }
    });

    $("#slide_lower_ver").slider({
        value: 0,
        min: -50,
        max: 50,
        orientation: "horizontal",
        slide: function (event, ui) {
            $("#lower_vertical").val(ui.value);
            $("#form_id").submit();
        }
    });

    $("#slide_upper_ver").slider({
        value: 0,
        min: -50,
        max: 50,
        orientation: "horizontal",
        slide: function (event, ui) {
            $("#upper_vertical").val(ui.value);
            $("#form_id").submit();

        }
    });

    // The second part of this function is to validate all input
    // Added new rules to check if upper bound is less than lower bound
    // If the methods return false, print the custom message
    $.validator.addMethod("checklowerhor",
        function (value, element) {
            // parseInt converts string to number
            // Directly retrieve the values in the lower and upper textfields and compare
            var upper_hor = parseInt(value)
            var lower_hor = parseInt($('#lower_horizontal').val())
            return (upper_hor > lower_hor) ? true : false;
        }, "The upper bound must be greater than the lower bound"
    );
    $.validator.addMethod("checklowerver",
        function (value, element) {
            var upper_ver = parseInt(value)
            var lower_ver = parseInt($('#lower_vertical').val())
            return (upper_ver > lower_ver) ? true : false;
        }, "The upper bound must be greater than the lower bound"
    );

    // This validate function is part of the JqueryUI validation plugin
    // and allows us to specify rules and custom messages
    // https://www.sitepoint.com/basic-jquery-form-validation-tutorial/
    // This source helped me create validation rules
    // https://stackoverflow.com/questions/10111907/how-to-focus-invalid-fields-with-jquery-validate
    // This source helped me fix a bug in which invalid form submissions would change the focus
    // out of the current textfield
    $("#form_id").validate({
        focusInvalid: false,
        rules: {
            lower_horizontal: {
                required: true,
                // The range also validates only numbers
                range: [-50, 50]
            },
            upper_horizontal: {
                required: true,
                range: [-50, 50],
                checklowerhor: true
            },
            lower_vertical: {
                required: true,
                range: [-50, 50]
            },
            upper_vertical: {
                required: true,
                range: [-50, 50],
                checklowerver: true
            }
        },
        // Create custom messages if form catches an error
        messages: {
            lower_horizontal: {
                required: "Please enter a number"
            },
            upper_horizontal: {
                required: "Please enter a number"
            },
            lower_vertical: {
                required: "Please enter a number"
            },
            upper_vertical: {
                required: "Please enter a number"
            }
        },
        // When the form is validated, proceed to create the multplication table
        submitHandler: function (form) {
            submitFunc();
        }
    });
});

// https://stackoverflow.com/questions/12795307/jquery-ui-slider-change-value-of-slider-when-changed-in-input-field
// This source helped me with one of two-way binding for slider and textfield
// set_new_input() is called everytime there is a new input in the textfields (called in the 
// index.html file
// set_new_input() helps change the slider upon immediate input
function setNewInput(type) {
    if (type == "lower_hor") {
        // Get the current value from textfield and then show it
        // on the slider
        // E.g.  4 to 7 changes slider ---x--- to ------x
        final_value = parseInt($('#lower_horizontal').val());
        // There is a bug, if the user enters nothing, the slider cannot move
        // So if textfield is NaN, set defauly slider to 0, so slider
        // can recognize an actual number
        if (Number.isNaN(final_value)) {
            final_value = 0;
        }
        $("#slide_lower_hor").slider('value', final_value);
    }
    // Repeat for each slider and textfield pair
    else if (type == "upper_hor") {
        final_value = parseInt($('#upper_horizontal').val());
        if (Number.isNaN(final_value)) {
            final_value = 0;
        }
        $("#slide_upper_hor").slider('value', final_value);
    }
    else if (type == "lower_ver") {
        final_value = parseInt($('#lower_vertical').val());
        if (Number.isNaN(final_value)) {
            final_value = 0;
        }
        $("#slide_lower_ver").slider('value', final_value);
    }
    else if (type == "upper_ver") {
        final_value = parseInt($('#upper_vertical').val());
        if (Number.isNaN(final_value)) {
            final_value = 0;
        }
        $("#slide_upper_ver").slider('value', final_value);
    }
    // After changing the values, submit form
    // Validation also occurs when the form is attempting to submit (in the ready function)
    $("#form_id").submit();
}

// Handles form submission when the submit image is clicked
function submitFunc() {
    // Clear everything due to resubmission of form
    document.getElementById("error_message").innerHTML = "";
    document.getElementById("multiplication_table").innerHTML = "";
    document.getElementById("multiplication_table").style.visibility = "hidden";

    // Get object/values from the form
    var form = document.getElementById("form_id");
    var lower_hor = document.getElementById("lower_horizontal").value;
    var upper_hor = document.getElementById("upper_horizontal").value;
    var lower_ver = document.getElementById("lower_vertical").value;
    var upper_ver = document.getElementById("upper_vertical").value;

    createTable(+lower_hor, +upper_hor, +lower_ver, +upper_ver)

    // Since the div is orginally hidden before user input, change visibility
    document.getElementById("multiplication_table").style.visibility = "visible";
    // document.getElementById("form_id").reset();

    // return statement to not refresh form
    return false;
}

// Creates a dynamic table
function createTable(lh, uh, lv, uv) {
    var table = document.getElementById("multiplication_table");
    var header_row = table.insertRow(0);
    header_row.style.backgroundColor = "lightgrey";
    var increment_var = 1;
    var increment_row = 1;

    // Extra empty cell in top left hand corner
    var new_cell = header_row.insertCell(0);
    new_cell.innerHTML = "";

    // First create the first row
    for (let i = lh; i <= uh; i++) {
        let next_cell = header_row.insertCell(increment_var);
        increment_var = increment_var + 1;
        next_cell.innerHTML = i;
    }

    var lv_index = lv;
    for (let i = lv; i <= uv; i++) {
        var header_row = table.insertRow(increment_row);
        // First, create the first cell in the remaining rows are from the vertical bounds
        var first_cell = header_row.insertCell(0);
        table.rows[increment_row].cells[0].style.backgroundColor = "lightgrey";
        first_cell.innerHTML = lv_index;
        lv_index += 1;
        increment_row += 1;
        increment_var = 1;
        // Next, fill the rest of the cells with the product of the first row and that first cell 
        // calculated in the first step
        for (let j = lh; j <= uh; j++) {
            var new_cell = header_row.insertCell(increment_var);
            new_cell.innerHTML = table.rows[0].cells[increment_var].innerHTML * first_cell.innerHTML;
            increment_var = increment_var + 1;
        }
    }
}

// This function relates to anything relating to creating/removing tabs
// http://www.tutorialspark.com/jqueryUI/jQuery_UI_Tabs_Methods_Adding_Removing_Tabs.php
// http://jsfiddle.net/k44Wk/1/
// These sources helped me set up the jQuery UI tab and how to manipulate them
$(function () {
    // This line creates the tab widget
    $("#tabs").tabs();

    // If the remove table button is clicked, execute this part of the script
    $('#remove_table_button').click(function () {
        // If there are no tabs, disable the button, otherwise a bug will occur
        // in which the tab content still remains but there is supposed to be 
        // 0 tabs
        // So, hide the tab widget if the length will become 0
        var tab_count = $("#tabs li").length;
        if (tab_count == 1) {
            document.getElementById("tabs").style.visibility = "hidden";
        }

        // tabIndex holds the string from the remove tab textfield
        var tabIndex = $("#indexvalue").val();
        // Isolate each element between commas
        var value_array = tabIndex.split(',');
        // The sort function sorts the array to handle the exception that the user did not
        // enter the indexes in order
        value_array.sort()

        // For each element, delete that tab index
        // Because the tab indexes are dynamically updated as you delete,
        // subtract by startIndex each time, as they are sequentially deleted
        // E.g. if you have five tabs, the indexes will look lke:
        // 0, 1, 2, 3, 4    <- indexes
        // a, b, c, d, e    <- name of tabs
        // and if the user entered 1,3 delete tabs b and d
        // So, delete tab index 1 first
        // 0, 1, 2, 3    <- indexes
        // a, c, d, e    <- name of tabs
        // because, there is one less index, we assign d to have an index
        // of 2, instead of 3 to delete tab d
        startIndex = 1
        value_array.forEach(function (item, index) {

            var tabIndex = parseInt(item)
            if (item != value_array[0]) {
                tabIndex = tabIndex - startIndex;
                startIndex = startIndex + 1;
            }
            var tab = $("#tabs").find(".ui-tabs-nav li:eq(" + tabIndex + ")").remove();
            $("#tabs").tabs("refresh");
        });
        // Process the tabs that were removed
        $("#tabs").tabs("refresh");
    });

    // If the save table button is clicked, execute this part of the script
    $('#save_table_button').click(function () {
        // Make the tab div visible once Save Table button is clicked
        document.getElementById("tabs").style.visibility = "visible";

        var num_tabs = $('div#tabs ul li.tab').length + 1;

        // Create variables to use for naming the tab title
        var lower_hor = parseInt($('#lower_horizontal').val());
        var upper_hor = parseInt($('#upper_horizontal').val());
        var lower_ver = parseInt($('#lower_vertical').val());
        var upper_ver = parseInt($('#upper_vertical').val());

        // Creates the title for the tabs
        $('div#tabs ul').append(
            '<li class="tab"><a href="#tab-' + num_tabs + '">' + lower_hor + "X" + upper_hor
            + "X" + lower_ver + "X" + upper_ver + '</a></li>');

        // Add tab to table
        $('div#tabs').append(
            '<div id="tab-' + num_tabs + '"></div>');
        $('#tabs').tabs("refresh");
        $('#tabs').tabs("option", "active", -1); //makes the new tab active

        insertTable();
    });
});

// Insert content into the currently selected tab
function insertTable() {
    var current_tab = $("#tabs").tabs('option', 'active');
    current_tab += 1;
    $("#tab-" + current_tab).append($("#multiplication_table").html());
}