import { useEffect, useState } from "react"
import Student from "./Student";
import { Col, Button, Container, Form, Pagination, Row } from "react-bootstrap";

const Classroom = () => {

    const[students, setStudents] = useState([])
    const[searchName, setSearchName] = useState('')
    const[searchMajor, setSearchMajor] = useState('')
    const[searchInterests, setSearchInterest] = useState('')
    const[searchStudents, setSearchStudents] = useState([])
    const [activePage, setActivePage] = useState(1);

    useEffect(() => {
        fetch('https://cs571.org/api/s24/hw4/students', {
        headers: {
            "X-CS571-ID": CS571.getBadgerId()
        }
    })
        .then(res => {
            console.log(res.status);
            return res.json()
        })
        .then(data => {
            console.log(data)
            setStudents(data)
        })
    }, [])

    useEffect(() => {
        const filteredStudents = students.filter(s => {
                const fullName = `${s.name.first} ${s.name.last}`.toLowerCase();
                const nameMatch = searchName ? fullName.includes(searchName) : true; // from hw2(online external tool bebugged)
                const majorMatch = searchMajor ? s.major.toLowerCase().includes(searchMajor) : true; // from hw2(online external tool bebugged)
                const interestMatch = searchInterests ? (s.interests == false) || s.interests.some(interest => interest.toLowerCase().includes(searchInterests)) : true; // from hw2(online external tool bebugged)
                return nameMatch && majorMatch && interestMatch;
            })
        setSearchStudents(filteredStudents)
    }, [searchName, searchMajor, searchInterests, students]) // linked articles from class piazza post

    const resetSearch = (() => {
        setSearchName([]);
        setSearchMajor([]);
        setSearchInterest([]);
    })

    const buildPaginator = (() => {
        let pages = [];
        const numPages = Math.ceil(searchStudents.length / 24);
        // used online external to help with the format and logic
        pages.push(
            <Pagination.Prev
                key="Previous"
                disabled={activePage === 1}
                onClick={() => setActivePage(prev => Math.max(prev - 1, 1))}
            >
                Previous {/* used online external tool to know how to display */}
            </Pagination.Prev>
        );
        for(let i = 1; i <= numPages; i++) {
            pages.push(
                <Pagination.Item 
                    key={i}
                    active={activePage === i}
                    onClick={() => setActivePage(i)}
                >
                    {i}
                </Pagination.Item>
            )
        }
        // used online external to help with the format and logic
        pages.push(
            
            <Pagination.Next
                // key="Next"
                disabled={activePage === numPages || numPages === 0} 
                onClick={() => setActivePage(next => Math.min(next + 1, numPages))}
            >
                Next {/* used online external tool to know how to display */}
            </Pagination.Next>
        );
        return pages;
    })

    return <div>
        <h1>Badger Book</h1>
        <p>Search for students below!</p>
        <hr />

        {/* checked online external tools for setting value according to input values */}
        <Form>
            <Form.Label htmlFor="searchName">Name</Form.Label>
            <Form.Control id="searchName" value={searchName} onChange={(e) => setSearchName(e.target.value)}/> 
            <Form.Label htmlFor="searchMajor">Major</Form.Label>
            <Form.Control id="searchMajor" value={searchMajor} onChange={(e) => setSearchMajor(e.target.value)}/>
            <Form.Label htmlFor="searchInterest">Interest</Form.Label>
            <Form.Control id="searchInterest" value={searchInterests} onChange={(e) => setSearchInterest(e.target.value)}/>
            <br />
            <Button variant="neutral" onClick={resetSearch}>Reset Search</Button>
        </Form>

        <p>There are {searchStudents.length} student(s) matching your search.</p>

        <Container fluid>
            <Row>
                { /* TODO Students go here! */
                    searchStudents.slice(24 * (activePage - 1), 24 * activePage).map(student => {
                         return <Col key={student.id} xs={12} md={6} lg={4} xl={3} >
                            <Student
                                name = {student.name}
                                major = {student.major}
                                credits = {student.numCredits}
                                isFromWI = {student.fromWisconsin}
                                interests = {student.interests}
                                {...student}
                            />
                    </Col>
                    })
                }
            </Row>
        </Container>

        <Pagination>
            {buildPaginator()}
        </Pagination>
    </div>

}

export default Classroom;