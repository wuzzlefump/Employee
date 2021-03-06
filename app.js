const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { listenerCount } = require("process");

let workers =[]
const types = ["Intern","Engineer","Manager"]
const same = [["What is their name?","name"],["What is their ID?", "id"],["What is their E-mail?","email"] ]
const eq = [...same, ["What is their Github username?","github"]]
const iq =[...same, ["What school did they attend?","school"]]
const mq =[...same, ["What is their Office number?", "officeNumber"]]

const eQuestions = eq.map((eprompt)=>{
return {
    message:eprompt[0],
    name:eprompt[1],
}
})
const iQuestions = iq.map((iprompt)=>{
return {
    message:iprompt[0],
    name:iprompt[1],
}
})
const mQuestions = mq.map((mprompt)=>{
return {
    message:mprompt[0],
    name:mprompt[1],
}
})
let job;


async function question(){
    try {
        const role  = await inquirer.prompt({
        type: 'list',
        message: "What type of Employee are you inputting? ",
        choices: types,
        name: "role"
      });
      job = role.role
      console.log(job)
      if(role.role == "Engineer"){
        await inquirer.prompt(eQuestions).then((answers)=>{
            console.log(answers)
            const newEngineer = new Engineer(answers.name,answers.id,answers.email,answers.github)
            workers.push(newEngineer)
            repeat();
        })

      }else if(role.role == "Intern"){
        await inquirer.prompt(iQuestions).then((answers)=>{
            console.log(answers)
            const newIntern = new Intern(answers.name,answers.id,answers.email,answers.school)
            workers.push(newIntern)
            repeat();
        })
      }else{
        await inquirer.prompt(mQuestions).then((answers)=>{
            console.log(answers)
            const newManager= new Manager(answers.name,answers.id,answers.email,answers.officeNumber)
            workers.push(newManager)
              repeat();
        })
      
      }
    } catch (err) {
      console.log(err);
    }

}
async function repeat(){
    try{
        const again  = await inquirer.prompt({
            type: "confirm",
            message: "is there another employee? ",
            name: "repeat",
        }) 
        if (again.repeat== true ){
            
            question();
        }else{
            console.log(workers)
    await fs.writeFile(outputPath,render(workers), err =>{
        if(err){
          throw err
        }
  console.log("Your page has been made")
  
      });

        }   
    }
    catch(err){
        console.log(err);
    }
}


question();


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.