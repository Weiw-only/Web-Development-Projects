function submitApplication(e) {
    e.preventDefault(); // You can ignore this; prevents the default form submission!

    // TODO: Alert the user of the job that they applied for!

    var jobRadios = document.getElementsByName('job');
    var selectedJob = null;

    for (var i = 0; i < jobRadios.length; i++) {
        if (jobRadios[i].checked) {
            selectedJob = jobRadios[i].value;
            break;
        }
    }

    if (selectedJob) {
        alert("Thank you for applying to be a " + selectedJob + "!");
    }

    
}