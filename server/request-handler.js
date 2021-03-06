/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var messages = {results: [{ username: 'ChatBot', text: 'Welcome to the chatroom', roomname: 'lobby', createdAt: '7/25/2017, 11:52:57 AM', objectId: 1501009400000 }]};

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/         && request.url === '/classes/messages'
  
  
  // var message1 = {
  //   createdAt: '2017-06-25T19:00:06.705Z',
  //   objectId: 'jSxKdWnQPZ',
  //   username: 'anonymous',
  //   roomname: 'lobby',
  //   text: 'here is a test',
  //   updatedAt: '2017-06-25T19:00:06.705Z'
  // };
  
  // var message2 = {
  //   createdAt: '2017-06-25T19:00:07.705Z',
  //   objectId: 'jSxKdWnQZZ',
  //   username: 'billy',
  //   roomname: 'lobby',
  //   text: 'here is a test',
  //   updatedAt: '2017-06-25T19:00:07.705Z'
  // };
  
  
  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'application/json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // response.writeHead(statusCode, headers);


  if (request.method === 'OPTIONS') {
    if (request.url.slice(0, 17) === '/classes/messages') {
      response.writeHead(200, headers);
      response.end();
    }
  }

  if (request.method === 'GET') {
    if (request.url.slice(0, 17) === '/classes/messages') {
      response.writeHead(200, headers);
      response.end(JSON.stringify(messages));
    } else {
      response.writeHead(404, headers);
      response.end();
    }
  }
  
  if (request.method === 'POST') {
    if (request.url.slice(0, 17) === '/classes/messages') {
      response.writeHead(201, headers);
      var requestBody = '';
      request.on('data', function(chunk) {
        requestBody += chunk.toString();
        if (requestBody[0] !== '{') {
          requestBody = '{"' + requestBody + '"}';
          requestBody = requestBody.split('');
          for (var i = 0; i < requestBody.length; i++) {
            if (requestBody[i] === '=') {
              requestBody.splice(i, 1, '": "');
            }
            if (requestBody[i] === '&') {
              requestBody.splice(i, 1, '", "');
            }
            if (requestBody[i] === '+') {
              requestBody.splice(i, 1, ' ');
            }
          }
          requestBody = requestBody.join('');
        }
        var parsedBody = JSON.parse(requestBody);
        parsedBody.createdAt = new Date().toLocaleString();
        parsedBody.objectId = Date.now();
        messages.results.push(parsedBody);
        response.end(JSON.stringify(messages.results));
      });
    }
  }
  
  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end('Hello, World!');
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

module.exports.requestHandler = requestHandler;