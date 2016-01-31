var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyparser = require("body-parser");

app.use(express.static(__dirname + "/public"));

app.use(bodyparser.json());

mongoose.connect('  mongodb://admin:admin@ds055575.mongolab.com:55575/spellendb');

var gameScheme = mongoose.Schema({subject: String, age: String, type: String, participants: Number, description: String});
var gameModel = mongoose.model('game', gameScheme);

app.get('/gamelist', function(req,res)
{
	console.log("I received a get request");
	gameModel.find().exec(function(err, docs)
	{
		res.json(docs);
	});

});
app.post('/gamelist', function(req,res)
{
        var game;

		game = new gameModel({
			subject: req.body.subject,
			age: req.body.age,
			type: req.body.type,
			participants: req.body.participants,
			description: req.body.description

		});
		console.log(req.body)
          gameModel.findOne({subject: game.subject}, function(err, samegame){
               //console.log("entering query to componentsmodel");
               if(samegame == null){
                game.save(function(error)
                {
                    if(!error){
                        console.log("created");
                    }
                    else{
                        console.log(error);
                    }
                    return res.json(game);
                });

               }else{
                 console.log(samegame.subject);
               }
          });

});
app.delete("/gamelist/:id", function(req,res)
{
	return gameModel.findById(req.params.id, function(err, game)
	{
		return game.remove(function(err)
		{
			if(!err)  {
			 console.log("game removed");
			 res.json(game);
		}
		else{
			 console.log(err);
		}
		});
	});

});
app.get('/gamelist/:id', function(req,res)
{
	return gameModel.findById(req.params.id, function (err, game) {
    if (!err) {
       res.json(game);
    } else {
       console.log(err);
    }
  });
});
app.put("/gamelist/:id", function(req,res)
{
	return gameModel.findById(req.params.id, function (err, game) {
		game.subject = req.body.subject,
		game.age = req.body.age;
		game.type = req.body.type,
		game.participants = req.body.participants,
		game.description = req.body.description

    return game.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.json(game);
    });
  });

});


app.listen(process.env.PORT || 8000);
console.log('server running on port 8000');