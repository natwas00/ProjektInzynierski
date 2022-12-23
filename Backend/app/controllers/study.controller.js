const db = require("../models");
const { Op } = require("sequelize");
const Set = db.set;
const User = db.user;
const { verifyOwner, checkSuperStudySet } = require("../middleware");
const UsersAndsets = db.UsersAndsets;
const fiszki  = db.fiszki;
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
            let answers2 = []
            answers2.push(flashcard.first_side)
            for (let i=0;i<3;i++){
                let randIndex = Math.floor(Math.random() * keys.length);
                
                let randKey = keys[randIndex]
                while(answers2.includes(flashcards[randKey].first_side  )){
                    randIndex = Math.floor(Math.random() * keys.length);
                    randKey = keys[randIndex]
                }
                const name = flashcards[randKey].first_side  
                answers2.push(name)
                
            }
            let randNumber = Math.floor(Math.random() * test.length);
            test.insert(randNumber,{id: flashcard.id, first_side: flashcard.first_side,second_side: flashcard.second_side, link: flashcard.link, answers: answers.sort(), answers2: answers2.sort()})
            
         }
         res.status(200).send(test)
         return
    })
}
exports.check_answers = (req, res) => {
    let setId = req.params.setId;
    var points = 0
    try {
        req.body.forEach(function (item) {
            fiszki.findOne({ where: { id: item.id } }).then(data => {
                if (item.answer == item.second_side && data != null && data.second_side == item.second_side) {
                    points = points + 1
                }
            })
     
        })
        UsersAndsets.findOne({ where: { setId: setId, studentId: req.userId } }).then(set => {
            let new_points;
            let data;
            if (points > set.points) {
                new_points = { points: set.points + (points - set.points) }
                data = { message: points, record: points }
                User.findOne({ where: { id: req.userId } }).then(p => {
                    user_points = parseInt(p.points) + (points - set.points)
                    update = { points: user_points }
                    console.log(update)
                    User.update(update, { where: { id: req.userId } }).then(num => {
                        if (num == 1) {
                            console.log("dodano punkty")
                        } else {
                            return res.send({
                                message: `Nie można zaktualizować użytkownika z id=${id}.`
                            });
                        };
                        UsersAndsets.update(new_points, { where: { setId: req.params.setId, studentId: req.userId } }).then(num => {
                            if (num == 1) {
                                console.log("dodano punkty")
                            } else {
                                return res.send({
                                    message: `Nie można zaktualizować użytkownika z id=${id}.`
                                });
                            };
                        })
                        data = { message: points, record: set.points }

                    })
                })
           
         
            }
            else {
                data = { message: points, record: set.points }

            }
     
      
            return res.status(200).json(data)

        })
    }
    catch {
        return res.status(400).send({message:"error"})
    }
}
exports.TrueFalse = (req,res) => {
    let setId = req.params.setId;
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
                question = {id: flashcard.id, first_side: flashcard.first_side,second_side: flashcard.second_side, trueFalse: true}
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
       
        test = test.sort((a, b) => {
            if (a.first_side < b.first_side ) {
              return -1;
            }
        });
        return res.status(200).json(test)

    })
}
function trueFalseQuestion(flashcard,flashcards) {
    var trueOrFalse = Math.floor(Math.random()* 2)
    if (trueOrFalse == 0){
        return {method: "trueFalse",id: flashcard.id, first_side: flashcard.first_side,second_side: flashcard.second_side, trueFalse: true}
    }
    else{
        const keys =  Object.keys(flashcards)
        let randIndex = Math.floor(Math.random() * keys.length);              
        let randKey = keys[randIndex]
        randIndex = Math.floor(Math.random() * keys.length);
        randKey = keys[randIndex]
        while(flashcards[randKey].id == flashcard.id  ){
            randIndex = Math.floor(Math.random() * keys.length);
            randKey = keys[randIndex]
        }
        const name = flashcards[randKey]
        question = {method: "trueFalse",id:flashcard.id, first_side: flashcard.first_side, second_side: name.second_side,trueFalse: false} 
        return question
    }
    
}
function abcdQuestion(flashcard,flashcards){
    const keys =  Object.keys(flashcards)
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
    let answers2 = []
    answers2.push(flashcard.first_side)
    for (let i=0;i<3;i++){
        let randIndex = Math.floor(Math.random() * keys.length);
        
        let randKey = keys[randIndex]
        while(answers2.includes(flashcards[randKey].first_side  )){
            randIndex = Math.floor(Math.random() * keys.length);
            randKey = keys[randIndex]
        }
        const name = flashcards[randKey].first_side  
        answers2.push(name)
        
    }

    return {method: "abcd",id: flashcard.id, first_side: flashcard.first_side,second_side: flashcard.second_side, link: flashcard.link, answers: answers.sort(),ansers2: answers2.sort()}
}
exports.mixStudy = (req,res)=>{
    let test = []
    fiszki.findAll({where:{setId: req.params.setId}}).then(flashcards=>{
        for (let i=0;i<flashcards.length;i++){
            var record;
            let numberMethod = Math.floor(Math.random() * 3);
            if (numberMethod == 0){
                record = {method: "write",id:flashcards[i].id, first_side: flashcards[i].first_side, second_side: flashcards[i].second_side} 

            }
            else if (numberMethod == 1){
                record = trueFalseQuestion(flashcards[i],flashcards)
            }
            else if (numberMethod == 2){
                record = abcdQuestion(flashcards[i],flashcards)
            }
            let randNumber = Math.floor(Math.random() * test.length);
            test.insert(randNumber,record)

        }
        return res.status(200).send(test)
    })
}
