var http = require('http');
var url = require('url');
var fs = require("fs");
var AWS = require("aws-sdk");
http.createServer(function (req, res) 
{
          res.writeHead(200, {'Content-Type': 'text/plain'});
          var q = url.parse(req.url, true);
          var q2 = url.parse(req.url,true).query;
        let awsConfig = {
          "region": "us-east-1",
          "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
          "accessKeyId": "AKIAIB6AEKGB7VQBZHFQ", "secretAccessKey": "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"
            };
            AWS.config.update(awsConfig);
            let docClient = new AWS.DynamoDB.DocumentClient();
          switch (q.pathname) 
          {
                case "/Add":
                    var id =q2.txtID+"";
                    var name = q2.txtTen;
                    var params = {
                        TableName:"Movie",
                        Item:{
                            "ID": id,
                            "title": name,
                        }
                    };
                    docClient.put(params, function(err, data) {
                        if (err) {
                            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                        } else {
                            res.writeHead(200, {'Content-Type': 'text/html'})
                            var text = "<!DOCTYPE html>" +
                                "<html lang=\"en\">" +
                                "<head>" +
                                "    <meta charset=\"UTF-8\">" +
                                "    <title>Title</title>" +
                                "</head>" +
                                "<body>" +
                                "<nav aria-label='breadcrumb'>"+
                                "<ol class='breadcrumb'>"+
                                "<li class='breadcrumb-item'><a href='#'>Home</a></li>"+
                                "<li class='breadcrumb-item'><a href='/Add'>Add</a></li>"+
                                "<li class='breadcrumb-item'><a href='/GetAll'>List</a></li>"+
                                "<li class='breadcrumb-item active' aria-current='page'>Help</li>"+
                                "</ol>"+
                                "</nav>"+
                                "<form action='/Add'  method='put' name='form1'>"+
                            //    "<div class='alert alert-primary' role='alert'>A simple primary alert—check it out! </div>"+
                                "</p>Nhap Ten </br>"+
                                "<input type= 'text' name='txtID' value='"+id+"'></p>"+
                                "<input type= 'text' name='txtTen' value='"+name+"'></p>"+
                                "<button type='submit' class='btn btn-info'>Submit</button>"+
                                "</form></br>"
                            res.write(text);
                            res.end();
                            return;
                        }
                    });
                    break;
                case "/Delete":
                    var id = q2.txtID;
                    var name = q2.txtTen;
                    var params = {
                        TableName:"Movie",
                        Key:{
                            "ID": id,
                            "Name": name
                        },
                    };
                    docClient.delete(params, function(err, data) {
                        if (err) {
                            console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
                        } else {
                            res.writeHead(200, {'Content-Type': 'text/html'})
                            console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
                            res.end();
                            return;
                        }
                    });
                    break;
                case "/GetAll":
                    var params = {
                      TableName: "Movie",
                      ProjectionExpression: "#yr, title",
                      ExpressionAttributeNames: {
                          "#yr": "ID",
                      }
                  };
                    docClient.scan(params, onScan);
                      function onScan(err, data) {
                          if (err) {
                              console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
                          } else {
                              console.log("Scan succeeded.");
                              res.writeHead(200, {'Content-Type': 'text/html'})
                              var text = "<!DOCTYPE html>" +
                                  "<html lang=\"en\">" +
                                  "<head>" +
                                  "    <meta charset=\"UTF-8\">" +
                                  "    <title>Title</title>" +
                                  "<style>table, tr, th {border: 1px solid black;border-collapse: collapse;}</style>"+
                                  "</head>" +
                                  "<body>" +
                                  "<p>Danh sách tất cả các bộ phim </p>"

                                  +"<table style='width:20%'><tr><th>ID</th><th>Name</th><th>Delete</th></tr>";
                              data.Items.forEach(function(item) {
                                  text += "<tr><td>" + item.ID+ "</td>"
                                      + "<td>" + item.title + "</td>"
                                      + "<td><a href='/Delete?txtID=" + item.ID + "&txtTitle="+item.title+"' >Delete</a>\</td>"
                                      +"</tr>";
                                  console.log(" -", item.ID + ": " + item.title );
                              });
                              text +="</table>"+
                                  "</body>" +
                                  "</html>";
                              res.write(text);
                              res.end();
                              return;
                          }
                      }
                    break;
               default:
                         fs.readFile('./html/index.html', function (err, data) {
                            res.writeHead(200, {'Content-Type': 'text/html'})
                             if (err) {
                                res.writeHead(404, {'Content-Type': 'text/html'});
                                return res.end("404 Not Found Home Page");
                            }
                            res.writeHead(200, {'Content-Type': 'text/html'});
                            res.write(data);
                            res.end();
                    });                
             }
}).listen(8081);