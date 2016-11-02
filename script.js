const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

const todos = [
    {
        message:'Go To Star Gym',
        completed:false,
        id:Math.random()
    },
    {
        message:'Do Homework',
        completed:false,
        id:Math.random()
    }
];

http.createServer(function (req,res) {
    const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query);
    const method = req.method;



    if(method === 'GET') {
        if(req.url.indexOf('/todos') === 0) {
            //res.setHeader('Content-Type', 'application/json');
            var localTodos = todos;

            if(parsedQuery.searchtext) {
                localTodos = localTodos.filter(function(obj) {
                    return obj.message.indexOf(parsedQuery.searchtext) >= 0;
                });
            }
           // return res.end(JSON.stringify(todos));
            return res.end(JSON.stringify(localTodos));
        }
    }

    fs.readFile('./'+req.url,function (err,data) {
        res.end(data);
    });
}).listen(8888);