const db = require("../models");
const { Op } = require("sequelize");
const Set = db.set;
const User = db.user;
const { verifyOwner, checkSuperStudySet } = require("../middleware");
const UsersAndsets = db.UsersAndsets;
const fiszki  = db.fiszki;
function last_access(setId, userId){
    date = {last_access : new Date()}
    UsersAndsets.update(date, {where:{studentId: userId, setId: setId}}).then(()=>{
        console.log("zmieniono czas ostatniego dostępu")
    })
    .catch(()=>{
        console.log("error")
    })
  }
Array.prototype.insert = function ( index, ...items ) {
    this.splice( index, 0, ...items );
};
exports.multipleChoiceTest = (req,res) =>{
    const setId = req.params.setId;
    
    fiszki.findAll({
        attributes: ['id','first_side', 'second_side','link'],
        where: {
          setId: setId,
        }
    }).then(flashcards=>{
        const keys =  Object.keys(flashcards)
        var test = []
        for (const flashcard of flashcards){
            let answers = []
            answers.push(flashcard.second_side)
            for (let i=0;i<3;i++){
                let randIndex = Math.floor(Math.random() * keys.length);
                
                let randKey = keys[randIndex]
                while(answers.includes(flashcards[randKey].second_side  )){
                    randIndex = Math.floor(Math.random() * keys.length);
                    randKey = keys[randIndex]
                }
                const name = flashcards[randKey].second_side  
                answers.push(name)
                
            }
            let randNumber = Math.floor(Math.random() * test.length);
            test.insert(randNumber,{id: flashcard.id, first_side: flashcard.first_side,second_side: flashcard.second_side, link: flashcard.link, answers: answers.sort()})
            
         }
         res.send(test)
         try{
            last_access(setId,req.userId)

           }
           catch{
            console.log("error")
           }
         return
    })
}
exports.check_answers = (req, res) => {
    setId = req.params.setId;
    var points = 0
    req.body.forEach(function(item){
        if (item.answer == item.second_side){
            points = points+1
        }
    })
    UsersAndsets.findOne({where : {setId: setId}}).then(set=>{
        let new_points; 
        let data;
        if (points > set.points){
            new_points = { points: set.points + (points - set.points)}
            data = {message: points, record: points}
            User.findOne({where:{id:req.userId}}).then(p =>{
                user_points = parseInt(p.points) + (points - set.points)
                update = {points: user_points}
                console.log(update)
                User.update(update,{where: {id: req.userId}}) .then(num => {
                    if (num == 1) {
                       console.log("dodano punkty")
                    } else {
                      return res.send({
                        message: `Nie można zaktualizować użytkownika z id=${id}.`
                      });
                    };
                    UsersAndsets.update(new_points, {where: {setId: req.params.setId}}) .then(num => {
                        if (num == 1) {
                           console.log("dodano punkty")
                        } else {
                          return res.send({
                            message: `Nie można zaktualizować użytkownika z id=${id}.`
                          });
                        };
                      })
                      data = {message: points, record: set.points}

                  })
            })
           
         
        }
        else{
            data = {message: points, record: set.points}

        }
        try{
            last_access(setId,req.userId)

           }
           catch{
            console.log("error")
           }
      
        return res.json(data)

    })

}
exports.TrueFalse = (req,res) => {
    setId = req.params.setId;
    const probability = (Math.random() * (7 - 4 + 1)) + 4;
    var test=[]
    if (req.body.superset){
        checkSuperStudySet.check_if_bought
    }
    else{
        verifyOwner
    }
    fiszki.findAll({where:{setId:setId}}).then(flashcards=>{
        const keys =  Object.keys(flashcards)
        for(let flashcard of flashcards){
            const random = Math.random() * 10;
            let question;
            if (random > probability){
                question = {id: flashcard.id, first_side: flashcard.first_side,second_side: flashcard.second_side, trueFlase: true}
                test.push(question)
            }
            else{
                let randIndex = Math.floor(Math.random() * keys.length);              
                let randKey = keys[randIndex]
                randIndex = Math.floor(Math.random() * keys.length);
                randKey = keys[randIndex]
                while(flashcards[randKey].id == flashcard.id  ){
                    randIndex = Math.floor(Math.random() * keys.length);
                    randKey = keys[randIndex]
                }
                const name = flashcards[randKey]
                question = {id:flashcard.id, first_side: flashcard.first_side, second_side: name.second_side,trueFalse: false} 
                let randNumber = Math.floor(Math.random() * test.length);
                test.insert(randNumber, question)

            }
        }
        try{
            last_access(setId,req.userId)

           }
           catch{
            console.log("error")
           }
        return res.json(test)

    })
}
