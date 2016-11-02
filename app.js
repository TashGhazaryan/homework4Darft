const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

const todos = [
    {
        message:'Go To gym',
        completed:false,
        id:Math.random()+''
    },
    {
        message:'Do Homework',
        completed:false,
        id:Math.random()+''
    }
    ];


http.createServer(function (req,res) {

    const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query);
    const method = req.method;

    //draw list
     if(method === 'GET') {
         if (req.url.indexOf('/todos') >= 0) {
             return res.end(JSON.stringify(todos));
         }
     }
    //add to list
    if (method === 'POST') {
        if (req.url.indexOf('/todos') >= 0) {
            var body = '';
            req.on('data', function (chunk) {
                body += chunk;
            });
            req.on('end', function () {
                var jsonObj = JSON.parse(body);
                jsonObj.id = Math.random() + '';
                todos[todos.length] = jsonObj;

                return res.end(JSON.stringify(jsonObj));
            });
        }
    }

    // search in list
    if (method === 'POST') {
        if (req.url.indexOf('/search') >= 0) {
            var search = '';
            req.on('data', function (chunk) {
                search += chunk;
            });
            req.on('end', function () {
                var obj = JSON.parse(search);
                var newArray = [];
                for (var i = 0; i < todos.length; ++i) {
                    if(todos[i].message.indexOf(obj.searchtext) !== -1) {
                        newArray.push(todos[i]);
                    }
                }
                 return res.end(JSON.stringify(newArray));
            });
        }
    }


    if(method === 'DELETE') {
        if(req.url.indexOf('/todos/') >= 0) {
            var id =  req.url.substr(7);
            for(var i = 0; i < todos.length; i++) {
                if(id == todos[i].id) {
                    todos.splice(i, 1);
                    res.statusCode = 200;
                    return res.end('Successfully removed');
                }
            }
        }
    }


    if (method === 'PUT') {
        if(req.url.indexOf('/todos/') >= 0){
            var updId = req.url.substr(7);
            for(var j = 0; j < todos.length; ++j) {
                if(updId == todos[j].id) {
                    if (todos[j].completed === false) {
                        todos[j].completed = true;
                    } else {
                        todos[j].completed = false;
                    }
                    res.statusCode = 200;
                    return res.end('Successfully updated');
                }
            }
        }
    }

    else {
        fs.readFile('./'+req.url,function (err,data) {
            res.end(data);
        });
    }
}).listen(8080);

