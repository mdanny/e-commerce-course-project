app server:
IP Address: 46.101.103.101:3000

web server: (proxy)
IP Address: 46.101.165.140

# Ecommerce website project

This project is using the following technology stack:

  - Node.js Runtime Environment
  - Express framework (web framework for Node.js)
  - EJS template engine (embedded javascript)
  - MongoDB database (document based)
  - Elastic Search (opensource search library)
  - jQuery (for the frontend)
  - Stripe (payment gateway)

This project resembles an ecommerce website with full features such as user authentication and authorization, session managing, search and payment features. Our team is: [person1], [person2], [person3], [person4] and [person5][df1]

> The README is structured as a self-contained
> book, where each chapter reveals details
> of implementation and functionality of
> different features within the website.
> The project created by us is only for
> illustration purpose, however, if wanted
> we may launch it in production.

### Version
1.0

### Table of Contents

1. [Installation](#installation)
2. [User Authentication](#user-authentication)
3. [Products and Category functionality](#products-and-category-functionality)
4. [Cart and payment feature](#cart-and-payment-feature)
5. [Facebook login](#facebook-login)

## Installation
---

In order to run our web application you will need to do several steps:

0. clone the repository (```git clone / wget```)
1. install nodejs (brew install node for OSX users)
2. install elasticsearch (brew install elasticsearch for OSX users)
3. from the terminal cd into the "e-commerce-course-project"
4. get MongoDB, in our example we used free clound mongoDB services that offers [www.mlab.com](https://mlab.com)
5. get Stripe accaunt www.stripe.com
6. configure the application
⋅⋅* edit ```config/secret.js``` with your mongoDB credentials that can be created on [www.mlab.com](https://mlab.com)
⋅⋅* edit ```public/js/custom.js``` with your Stripe test public key that can be created [www.stripe.com](https://dashboard.stripe.com/account/apikeys)
..* edit ```/routes/main.js``` with your Stripe test secrete key that can be created on [www.stripe.com](https://dashboard.stripe.com/account/apikeys)
7. from the terminal run "elasticsearch" (OSX users)
8. from the terminal in a new tab from the same location "e-commerce-course-project" run node server.js
9. open this URL [http://localhost:3000](http://localhost:3000) from the browser

## User Authentication
---

#### User Schema
For user authentication we have used *morgan* library with the aim of logging the user requests to the webserver (e.g. access to different routes).
For the User Schema we use mongoose, which is an *Object Relational Mapper*, which is like a virtual object database, that can be used within Node itself. Basically it connects our Node.js project with MongoDB database, without the need to implicitly connect them using additional code.

The User Schema is defined as follows:
```javascript
var UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, lowercase: true},
    password: String,

    profile:{
        name: { type: String, default: ''},
        picture: { type: String, default: ''}
    },

    address: String,
    history: [{
        date: Date,
        paid: { type: Number, default: 0},
    }]
})
```
From the Schema we can derive that the User entity is described by five characteristics:
1. email
2. password
3. profile
4. address
5. history

In the next chapter we will explain how these characteristics are implemented and used.

#### MongoDB

Our MongoDB database is a single-node deployment, hosted on ```https://mlab.com```. Here is a useful representation of our database.

|     Name    |                                                                                                                                                                           Description                                                                                                                                                                           |   Value   |
|:-----------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------:|
| collections | Number of collections in this database                                                                                                                                                                                                                                                                                                                          | 9         |
| objects     | Number of documents in this database                                                                                                                                                                                                                                                                                                                            | 307       |
| indexes     | Number of indexes in this database                                                                                                                                                                                                                                                                                                                              | 10        |
| numExtents  | Number of filesystem extents allocated for this database                                                                                                                                                                                                                                                                                                        | 13        |
| avgObjSize  | Average document size for this database. This is the dataSize divided by the objects.                                                                                                                                                                                                                                                                           | 0.30 KB   |
| dataSize    | Total size of all documents stored in this database, including the padding factor (does not include indexes).                                                                                                                                                                                                                                                   | 93.33 KB  |
| storageSize | Total amount of space allocated for data for this database (does not include index storage). This number is larger than dataSize because it includes additional space (preallocation within data files as well as space left by deleted or moved documents).                                                                                                    | 392.00 KB |
|             |                                                                                                                                                                                                                                                                                                                                                                 |           |
| indexSize   | Total size of all indexes created on this database                                                                                                                                                                                                                                                                                                              | 95.81 KB  |
| fileSize    | Total size of storage files used for this database. This represents the overall storage footprint for this database on disk. For servers running with the smallfiles option (we use this option on our Shared plans), the first file allocated is 16MB, the second 32MB, the third 64MB... until 512MB is reached at which point each subsequent file is 512MB. | 16.00 MB  |


Our database is comprised of the following collections:

* carts
* categories
* products
* sessions
* users

Each collection contains relevant documents, for instance ```carts``` collection contains cart for each of the registerde user. The document schema of ```cart``` model is defined below:

```javascript

{
    "_id": {
        "$oid": "cartHashString"
    },
    "owner": {
        "$oid": "userHashString"
    },
    "items": [],
    "total": 0,
    "__v": 0
}
```

#### Usage of EJS


Let’s take a look at how we can use EJS to include repeatable parts of our site (partials) and pass data to our views.

We have to set EJS as the view engine for our Express application using:

```app.set('view engine', 'ejs');```

Notice how we send a view to the user by using ```res.render()```. It is important to note that ```res.render()``` will look in a views folder for the view.


#### Adding Twitter Bootstrap

Bootstrap is a frontend framework that provides the necessary CSS and Javascript to make your websites responsive and nice looking. A clear advantage of using Bootstrap is that it accelerates web development process by letting you focus on building the application’s functionality instead of tinkering with (hopefully) cross-browser load of styling rules and media.

In our web application we downloaded Bootstrap CSS/JS and serve it from the application’s public folder.

The general idea in order to serve Bootstrap from the web application instead of using CDN is to first download Bootstrap CSS, icon fonts and JS files, place them somewhere in the application’s “public” folder – the one that will be visible from the internet – and reference them in the view templates.

#### Signup and Login

* The library we use is passport.js
* If we want to use passport library in one of our routes, which is login, we need to configure it first
* We can think of it as setting up a new rule in a config file, so that login route will use it (middleware)

* We require two libraries in the passport file:
  1. passport - for authentication
  2. Localstrategy - it is one of passport's libraries, used for the local login

* There are three sections in this file:
 1. Serialization/deserialization and user objects
 2. Middleware that will process the login mechanism
 3. Custom function to validate if a user is logged in or not

**Serialization** is the process of translating data structures or object states into a format that can be stored. We want to translate the data structure, which is the ```user``` object and we want to translate it into a format that can be stored. Thus, we will store it in connect-mongo. So, the key of this object is provided into the 2nd argument of the callback function in ```serializeUser```, which is ```user._id```. Serialize function will be saved into session and it is used to retrieve the whole object via deserialize function.

**Serialize function** means that data from the user object should be stored in the session. In our case, we want to store the id only and the result of the ```serializeUser()``` method will be attached to the session as request with user._id --> req.user._id. Later on, if we want to access a user that we just logged in, we will type ```req.user```.

In **deserialize function** we provide as first argument the same key of user object that was given to done func in ```serializeUser()``` call. So, the whole object is retrieved with the help of the key.


#### In ```routers/user.js``` we added two routes:
```
1. router.get(‘/login’)

2. router.post(‘/login’)
```
* We are using the middleware we created, namely ```local-login``` in passport and then we pass in an object to this second parameter, successRedirect to profile url, or if failure, than redirect to /login url

#### In ```server.js```

* We have to initialize the passport and also we need to add passport.session
* Passport.session acts as a middleware to alter the req object and change the user value that is currently the session id from the client cookie, into the deserialize user object

As a consequence, we have login  and profile routes.

* In ```server.js``` when we add the following line:
```javascript
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});
```
* The user object will get available for all the routes
* This is instead of specifying manually (redundantly) in every needed route, an user object, like ```user: req.user```
* Every route will have the user object by default
* ```res.locals.user``` - we want to make it equal to req.user, because once logged in we will have req.user based on serialize and deserialize method
* The ```req.logIn``` from the user.js file, in the router.post ```(‘/signup’)``` route, is essentially adding the session to the server and the cookie to the browser by using the login function
* The user object ```obj``` is based on the result of the new user creation which we created here: ```User.findOne({email: req.body,email…```
* The user as a saved object, is then passed to the login function, so the user will have the cookie on the browser and the session on the server


#### Cookie and Session usage

The session stores data like ```user-id``` in temporary memory store (temp, local, redis, or in our case mongodb).
The cookie parser will parse the cookie header and handle cookie separation and encoding, take the session data, encrypt it and send it to browser.

Few steps are required to set up the cookie and session functionality:

* install db for storing the session (library connect-mongo)
* mongo store library is depending on express-sesion, without express-session (session) it won’t work
* instead of saving anything to a temporary memory store, we want to save the session into MongoDB database
* every session will be saved into DB, which is MongoDB
* MongoStore in our case specifically stores the session on the server-side



## Products and Category functionality
---

#### Product and Category models

* The product model:
```javascript
var ProductSchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: 'Category'},
  name: String,
  description: String,
  price: Number,
  image: String
});
```

* The category model
```javascript
var CategorySchema = new Schema({
  name: { type: String, unique: true, lowercase: true}
});
```


#### The Admin route

Now, the routes for adding product category are located in ```admin.js```, because this is the responsibility of only an admin

* ```admin/add-category``` route will get a page from the server with an extra data which is message
* We have also a post route and it is relying on Category Schema because we instantiate a new object from the category
* we want to save the data in the category name field so that it is equal to the input of the request and afterwards save the respective data to the database

We have created the corresponding ```add-category.ejs``` for the above route.

We've also added a security layer, so that only ```admin``` account can access the page of ```add-category```


#### Async waterfall model

This is a js module, which runs an array of functions in series, each passing their results to the next in the array. However, if any of the functions pass an error to the callback, the next function is not executed and the main callback is immediately called with the error.

*Installation*

* Just include async-waterfall before your scripts.
* npm install async-waterfall if you’re using node.js.

*Usage*

* waterfall(tasks, optionalCallback);
* tasks - An array of functions to run, each function is passed a callback(err, result1, result2, ...) it must call on completion. The first argument is an error (which can be null) and any further arguments will be passed as arguments in order to the next task.
* optionalCallback - An optional callback to run once all the functions have completed. This will be passed the results of the last task's callback.

```javascript

var waterfall = require('async-waterfall');
waterfall(tasks, callback);

waterfall([
  function(callback){
    callback(null, 'one', 'two');
  },
  function(arg1, arg2, callback){
    callback(null, 'three');
  },
  function(arg1, callback){
    // arg1 now equals 'three'
    callback(null, 'done');
  }
], function (err, result) {
  // result now equals 'done'
});
```


#### Faker API usage

You can use faker from within your browser or on the server with Node. In our case, we present the usage of faker api in node:

```javascript
 var faker = require('faker');

 //some basic faker methods
 var name = faker.name.findName();
 var randomEmail = faker.internet.email();
 ```

 Let’s say we wanted to create a product on the fly. We want this product to have a category, name, description, price and even an image.

In Node, all we would have to do is:

```javascript

var product = new Product();
        product.category  = category._id;
        product.name = faker.commerce.productName();
        product.description = faker.lorem.paragraph();
        product.price = faker.commerce.price();
        product.image = faker.image.image();

        product.save();
```
Notice that we create the product object by assigning to the product variable an instance of Product(), which is defined in the ```Product``` model. Consequently, we use the ```faker``` api to use the corresponding methods for generating fake data.

Just like that, we have a whole product object that we can use within our application! The above code will yield:

```javascript
{
    "_id": {
        "$oid": fakerProductHashString
    },
    "image": fakerHostedImage,
    "price": fakerPrice,
    "description": fakerDescription,
    "category": {
        "$oid": fakerCategoryHashString
    },
    "__v": mongoDBVersionRevisionKey
}

```

#### Elastic Search

Install elastic search as follows:

* brew install elasticsearch
* not as sudo, otherwise you get a java runtime error

Add plugin to our product schema:

* mongoosastic ~ a library which uses elasticsearch to replicate the data from mongoDB to elasticsearch
* it lets you search specific data using mongoosastic feature, w/o writing additional code to connect mongoosastic and mongodb
* all within elastic search product set
* logic defined in Product.search and Product.createMapping

The mapping code maps between product DB and elasticSearch, so that it creates a “bridge” between ES replica set and Product DB. Finally we want to stream the whole data from the product to ES, so that it will replicate all data and put in ES.



## Cart and payment feature
---
#### Cart Schema

```javascript
var CartSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User'},
  total: { type: Number, default: 0},
  items: [{
    item: { type: Schema.Types.ObjectId, ref: 'Product'},
    quantity: { type: Number, default: 1},
    price: { type: Number, default: 1},
  }]
});
```


#### Cart Middleware

The cart middleware is defined in ```./middlewares/middleware.js``` and embeds the whole logic of the cart inside the ```module.exports``` function. The function has a key check:
```javascript
if (req.user)
```
which checks if the user is authenticated and if positive, it finds the corresponding cart of the assigned owner by querying MongoDB using ```findOne()``` method. An important aspect here is the logic behind the total items variable generation, which is exported as a global variable using the following command, so that it becomes accessible in all the routes:
```javascript
//logic
res.locals.cart = total;
```

#### Cart features
Aenean a ante sit amet libero luctus feugiat nec ac magna. Mauris at mi erat. Phasellus finibus at purus et efficitur. Aliquam et luctus arcu. Nunc ornare blandit neque vel auctor. Nulla lectus augue, consequat ac nulla quis, lacinia varius urna. Vivamus eu vestibulum turpis. Praesent interdum semper justo ac maximus. Nulla quis lacus in quam lobortis sagittis.


#### Payment
Donec porttitor ante porta leo feugiat vestibulum. Etiam sit amet velit faucibus, sagittis nunc tincidunt, fermentum dolor. Integer tristique varius mi vitae maximus. Morbi viverra lobortis tellus, in sagittis nisi viverra et. Praesent blandit sapien ultrices consequat vestibulum. Morbi in dapibus mi, vitae porta quam. Aenean et turpis in orci pharetra facilisis.


#### History page
Nullam laoreet euismod diam molestie egestas. Proin interdum semper congue. Nulla lobortis tincidunt dolor nec placerat. Integer tristique metus nunc, in varius nibh auctor sed. Vestibulum eu faucibus nisi, quis porta massa. Nam aliquet sapien ac tellus maximus efficitur. Etiam nec sapien nec orci aliquet condimentum. Integer aliquet odio nulla, et congue massa feugiat nec. Phasellus finibus tincidunt tincidunt.


## Facebook login
---

#### Facebook developer settings
In consectetur tincidunt sodales. Nunc metus nisl, auctor sed convallis tincidunt, porta eu diam. Nullam eget ligula felis. Nunc arcu libero, posuere eu viverra eget, rhoncus aliquet lacus. Vestibulum pulvinar neque sem, vitae facilisis orci egestas et. Phasellus vestibulum leo sit amet neque blandit volutpat. Praesent fringilla nisi gravida, aliquam diam vel, lacinia orci. Nullam a purus mattis, iaculis neque sed, imperdiet nunc. Nullam sagittis arcu non egestas eleifend. Nullam vel facilisis massa. Donec pulvinar metus eu mauris finibus bibendum. Nunc vulputate molestie bibendum. Quisque congue mi sed consectetur ullamcorper.


#### Config on Node.js side
Etiam eleifend ante porta elementum cursus. Integer eu nunc elementum velit luctus aliquet non quis velit. Vivamus auctor venenatis posuere. Morbi bibendum odio dui, vitae blandit lectus tincidunt ut. Duis turpis sapien, dignissim eu nisl at, convallis mollis diam. Aliquam a dolor bibendum, ornare nulla a, accumsan metus. Vestibulum non dui ut arcu aliquam commodo sit amet id erat.


#### Adding Middleware
Duis tincidunt tempor orci, quis ultrices mi gravida accumsan. Sed euismod tortor at auctor venenatis. Quisque interdum elit id ante porta sagittis sed ac lectus. Ut ornare, diam eu finibus dignissim, erat magna feugiat libero, aliquam aliquam ante lacus in quam. Nulla non justo porta, dapibus nisl at, maximus orci. Nunc congue tortor et nisi vehicula pretium. Duis id magna fermentum, interdum justo varius, viverra lorem.



[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [dill]: <https://github.com/joemccann/dillinger>
   [git-repo-url]: <https://github.com/joemccann/dillinger.git>
   [john gruber]: <http://daringfireball.net>
   [@thomasfuchs]: <http://twitter.com/thomasfuchs>
   [df1]: <http://daringfireball.net/projects/markdown/>
   [marked]: <https://github.com/chjj/marked>
   [Ace Editor]: <http://ace.ajax.org>
   [node.js]: <http://nodejs.org>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [keymaster.js]: <https://github.com/madrobby/keymaster>
   [jQuery]: <http://jquery.com>
   [@tjholowaychuk]: <http://twitter.com/tjholowaychuk>
   [express]: <http://expressjs.com>
   [AngularJS]: <http://angularjs.org>
   [Gulp]: <http://gulpjs.com>

   [PlDb]: <https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md>
   [PlGh]:  <https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md>
   [PlGd]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>
   [PlOd]: <https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md>


##Gravatar functionality

* When the user clicks or is redirected to its profile page, an avatar called gravatar should be displayed
* It is made by creating a custom method inside the user model file, called ```UserSchema.methods.gravatar```
* This method checks the existance of the size of the avatar and the existance of the user’s email
* If the user doesn’t have the email for any reason, a default gravatar is provided
* Otherwise, a unique gravatar is created for each user profile based on the md5digest of the user’s email

##Edit-profile

* the user types in the req.body.name, or the request to be changed, and according to the name of the body, the user.profile data structure is being modified accordingly
* then simply the user data is saved and flash the message, and store the flash in the session
* so that it can be used in other routes that have success as the name of the flash as is the route ```router.get(‘/edit-profile’)``` which contains the actual render of the edit-profile.ejs file
* redirect user back to edit-profile page

##Laying down new models:

* category.js
* create a new Schema, called Category
* this will be a model for category part
* we want to separate between the category and a product just in case that a category model grows bigger (hundreds), you don’t want to put in in the product schema
* next module product
* a reason why we reference the product based on category ID is so that later on we can populate the data inside the category schema




* now we will add another middleware to our express app, so that it learns how to use a new variable which is categories, because we want to render the categories on the nav-bar
* first in the app.use (category) middleware specified in server.js
* first we want to find all the categories ```(find({}))```, search through every document in DB
* if err return callback with err
* store the list of categories in a local var called categories


###In main.js
* in route ```/products/:id``` - a parameter like a double dot is used if we want to get to a specific url
* so instead of adding ```router.get(‘/products/foods_id’)```, ```router.get(‘/products/gadgets_id’)```, ```router.get(‘/products/books_id’)``` we just add the ```:``` parameter
* ```req.params```, so it could be accessed in dependance of the id of the category
* ```req.params.id```, is the way to access the parameter in the routes (:id)
* ```populate``` - we can only use populate if the data type is an object id (Schema.Types,ObjectId)
* populate shows not only the id but also the information about the category
* exec executes the anonymous function on all of the above methods, e.g. on all the .find methods


Npm is the node package manager and you will need to install the following modules using it:

```javascript
"dependencies": {
    "async": "^1.5.2",
    "bcrypt-nodejs": "0.0.3",
    "body-parser": "^1.15.0",
    "connect-mongo": "^1.1.0",
    "cookie-parser": "^1.4.1",
    "ejs": "^2.4.1",
    "ejs-mate": "^2.3.0",
    "express": "^4.13.4",
    "express-flash": "0.0.2",
    "express-session": "^1.13.0",
    "faker": "^3.0.1",
    "mongoosastic": "^4.0.2",
    "mongoose": "^4.4.5",
    "morgan": "^1.7.0",
    "passport": "^0.3.2",
    "passport-local": "^1.0.0",
    "stripe": "^4.4.0"
  }
```
(recommended to run the following command: ```npm install``` from the project directory.)

This command will install all the dependencies from the file **package.json**.

A **package.json** file contains meta data about your app or module. Most importantly, it includes the list of dependencies to install from npm when running npm install . If you're familiar with Ruby, it's similar to a Gemfile.


```
├── api
├── config
├── models
├── node_modules
│   ├── async
│   ├── connect-mongo
│   ├── cookie
│   ├── cookie-parser
│   ├── cookie-signature
│   ├── ejs
│   ├── ejs-mate
│   ├── elasticsearch
│   ├── express
│   │   ├── lib
│   ├── express-flash
│   │   └── lib
│   ├── express-session
│   │   └── session
│   ├── faker
│   ├── mongodb
│   │   └── lib
│   ├── mongoosastic
│   │   ├── example
│   ├── mongoose
│   │   ├── examples
│   │   ├── lib
│   ├── morgan
│   │   └── node_modules
│   ├── passport
│   │   └── lib
├── public
│   ├── css
│   └── js
├── routes
└── views
    ├── accounts
    ├── admin
    ├── main
    └── partials
```












## We would like to thank Arash Yahya for his course on Udemy that guided this small project
