let studentData;
fetch('https://cs571.org/api/s24/hw2/students', {
	headers: {
		'X-CS571-ID': CS571.getBadgerId() // You may hardcode your Badger ID instead.
	}
})
.then(
	res => res.json()
) 
.then(data => {
	const numStudents = data.length;
    const numResultsElement = document.getElementById('num-results');
    if (numResultsElement) {
        numResultsElement.innerText = `${numStudents}`;
    }
    studentData = JSON.parse(JSON.stringify(data));
	console.log(data);
})
.catch(err => {
	console.error('Error fetching or processing data.')
})

function buildStudents(studs) {
	// TODO This function is just a suggestion! I would suggest calling it after
	//      fetching the data or performing a search. It should populate the
	//      index.html with student data by using createElement and appendChild.

    const studentsItems = document.getElementById('students');


	studs.forEach(student => {
        // Create container for each student
        const studentDiv = document.createElement('div');
        studentDiv.className = 'col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3';
    
        // Name
        const nameElement = document.createElement('h3');
        nameElement.innerText = `${student.name.first} ${student.name.last}`;
        studentDiv.appendChild(nameElement);
    
        // Major
        const majorElement = document.createElement('p');
        majorElement.innerText = `Major: ${student.major}`;
        studentDiv.appendChild(majorElement);
    
        // Number of Credits
        const creditsElement = document.createElement('p');
        creditsElement.innerText = `Credits: ${student.numCredits}`;
        studentDiv.appendChild(creditsElement);
    
        // From Wisconsin
        const fromWIElement = document.createElement('p');
        fromWIElement.innerText = student.fromWisconsin ? 'From Wisconsin: Yes' : 'From Wisconsin: No';
        studentDiv.appendChild(fromWIElement);
    
        // Interests
        const interestsElement = document.createElement('ul');
        student.interests.forEach(interest => {
          const interestItem = document.createElement('li');
          interestItem.innerText = interest;
          interestItem.style.cursor = 'pointer'; // Make it visually clickable
          interestItem.addEventListener("click", (e) => {
            const selectedText = e.target.innerText;
            // TODO update the search terms to search just for the
            //      selected interest, and re-run the search!
            document.getElementById('search-interest').value = selectedText;
              // Clear other search fields to ensure the search is only for the interest
            document.getElementById('search-name').value = '';
            document.getElementById('search-major').value = '';
              // Re-run the search
            handleSearch(e);
          });
          interestsElement.appendChild(interestItem);
        });
        studentDiv.appendChild(interestsElement);
    
        // Append the student div to the container
        studentsItems.appendChild(studentDiv);
      });
}

function handleSearch(e) {
	e?.preventDefault(); // You can ignore this; prevents the default form submission!

	// TODO Implement the search
    // Retrieve search criteria
    const searchName = document.getElementById('search-name').value.trim().toLowerCase();
    const searchMajor = document.getElementById('search-major').value.trim().toLowerCase();
    const searchInterest = document.getElementById('search-interest').value.trim().toLowerCase();

    // Filter students based on search criteria
    const filteredStudents = studentData.filter(student => {
        // Check if the name matches (if searchName is provided)
        const fullName = `${student.name.first} ${student.name.last}`.toLowerCase();
        const nameMatch = searchName ? fullName.includes(searchName) : true;

        // Check if the major matches (if searchMajor is provided)
        const majorMatch = searchMajor ? student.major.toLowerCase().includes(searchMajor) : true;

        // Check if any interest matches (if searchInterest is provided)
        const interestMatch = searchInterest ? student.interests.some(interest => interest.toLowerCase().includes(searchInterest)) : true;

        // Return true if all provided search criteria match
        return nameMatch && majorMatch && interestMatch;
    });

    // Clear the current list of students
    const studentsContainer = document.getElementById('students');
    studentsContainer.innerHTML = ''; // Clear the students display area

    // Rebuild the students display with filteredStudents
    buildStudents(filteredStudents);

    // Update num-results with the number of matching students
    const numResultsElement = document.getElementById('num-results');
    if (numResultsElement) {
        numResultsElement.innerText = `${filteredStudents.length}`;
    }

}

document.getElementById("search-btn").addEventListener("click", handleSearch);