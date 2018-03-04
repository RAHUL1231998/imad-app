 var express = require('express');
var morgan = require('morgan');
var path = require('path');
var pool = require('pg').pool;

var config = {
    user: 'rapr16cs',
    database: 'rapr16cs',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
}


var app = express();
app.use(morgan('combined'));

var articles = {
    'article-one' : {    
        title: 'Article One | Deepak Kumar',
        heading: 'Article One',
        date: 'feb 21,2018',
        content: `
        <p>
            This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article.
        </p>
        <p>
            This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article.
        </p>
        <p>
            This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article.
        </p>`
        
    },
    'article-two' : {
        title: 'Article Two | Deepak Kumar',
        heading: 'Article Two',
        date: 'feb 22,2018',
        content: `
        <p>
            This is the content for my second article. This is the content for my second article. This is the content for my second article. This is the content for my second article. This is the content for my second article. This is the content for my second article.
        </p>`
    },
    'article-three' : {
        title: 'Article Three | Deepak Kumar',
        heading: 'Article Three',
        date: 'feb 23,2018',
        content: `
        <p>
            This is the content for my third article.
        </p>`
    }
};
  
function createTemplate(data){
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;
    
    var htmlTemplate=`
    <html>
        <head>
            <title>
                Article One | Deepak Kumar
            </title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link href="/ui/style.css" rel="stylesheet" />
        </head>
    <body>
        <div class="container">
        <div>
            <a href="/">Home</a>
        </div>
        <hr/>
        <h3>
          ${heading}
        </h3>
        <div>
          ${date}
        </div>
        <div>
          ${content}
        </div>
        </div>
    </body>    
    </html>
    `;
    return htmlTemplate;
}

app.get('/' , function (req , res) {
   res.sendFile(path.join(__dirname, 'ui', 'index.html')); 
});

var pool = new Pool(config);
app.get('/test-db', function(req,res){
    //make a request\
    //return the resposnse with results
   pool.query('SELECT*FROM Test', function(err,result){
       if(err){
           res.status(500).send(err.toString());
       }
       else{
           res.send(JSON.stringify(result));
       }
   }); 
});

var counter = 0;
app.get('/counter', function (req, res) {
   counter = counter + 1;
   res.send(counter.toString());
});

var names = [];
app.get('/submit-name', function(req, res) {
    //get the name from request
    var name = req.query.name;
    
    names.push(name);
    //JSON: Javascript Object Notation
    res.send(JSON.stringify(names));
}); 

app.get('/articles/:articleName', function (req, res) {
    //article == article-one
    //articles[articleName] == {} content object for article one
    var articleName = req.params.articleName;
    pool.query("SELECT*FROM article WHERE tilte = "+ req.params.articleName, function(err,result){
        if(err){
           res.status(500).send(err.toString());
       }
       else{
           if(result.rows.length === 0){
            res.status(404).send('Article not found');
           }
           else{
               var articleData = result.rows[0];
               res.send(createTemplate(articleData));
           }
       }
    });
    res.send(createTemplate(articleData));
});
 
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});