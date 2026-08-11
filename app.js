const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

function readJsonArray(filePath) {
    const rawData = fs.readFileSync(filePath, 'utf8');
    if (!rawData.trim()) {
        return [];
    }

    return JSON.parse(rawData);
}

app.get('/', (req,res)=>{

    console.log(req.headers.cookie);
    if(req.headers.cookie){
        let cookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('userEmail='));
        if(cookie){
            let userEmail = cookie.split('=')[1];
            res.redirect('/home');
            
        }else{
            res.send('Please login first');
        }
    }else{
        res.send('Please login first');
    }   
    res.send('sdfd')

})
app.get('/home', (req,res)=>{
    res.sendFile(__dirname +  "/home.html");
})

app.get('/courses', (req,res)=>{
    res.sendFile(__dirname +  "/courses.html");
})

app.get('/contact', (req,res)=>{
    res.sendFile(__dirname +  "/contactus.html");
})

app.get('/about', (req,res)=>{
    res.sendFile(__dirname +  "/aboutus.html");
})

app.get('/getallcoursesdatajson', (req, res) => {
    let coursesdata = readJsonArray(__dirname + '/courses.json');
    res.send(coursesdata);
})

app.get('/perticularcourse/:id', (req, res) => {
    res.sendFile(__dirname + "/perticular_course.html");
})

app.get('/course/:id', (req, res) => {
    console.log(req.params.id);
    let allcourses = readJsonArray(__dirname + '/courses.json');
    let course = allcourses.find((course) => course.course_id == req.params.id);
    console.log(course)
    res.send(course);
})

app.get('/register', (req, res) => {
    res.sendFile(__dirname + "/registerscreen.html");
})

app.post('/registerNewUser', (req, res) => {
    let allcuruser = readJsonArray(__dirname + '/users.json');
    allcuruser.push({id: allcuruser.length + 1, name: req.body.name, email: req.body.email, password: req.body.password });
    allcuruser = JSON.stringify(allcuruser);
    fs.writeFileSync(__dirname + '/users.json', allcuruser);
    res.redirect('/register');
})


app.get('/login', (req, res) => {
    res.sendFile(__dirname + "/loginscreen.html");
})

app.post('/loginUser', (req, res) => {
    let allcuruser = readJsonArray(__dirname + '/users.json');
    let user = allcuruser.find((user) => user.email == req.body.email && user.password == req.body.password);
    if(user){
        res.setHeader('Set-Cookie', `userEmail=${(user.email)}; Path=/; HttpOnly`);
        
        res.redirect('/home');
    }else{
        res.send("Invalid Credentials");
    }
})

app.listen(3000, () =>{
    console.log("listening")
});