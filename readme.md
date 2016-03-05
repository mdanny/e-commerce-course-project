#Under construction....

##Saving users session:

The session stores data like user-id in temporary memory store, temp, local, mongodb or redis.
The cookie parser will parse the cookie header and handle cookie separation and encoding, take the session data, encrypt it and send it to browser.

* install db for storing the session (library connect-mongo)
* mongo store library is depending on express-sesion, w/o express-session (session) it won’t work)
* instead of saving anything to a temporary memory store, we want to save the session into MongoDB database
* every session will be saved into DB, which is MongoDB
* MongoStore in our case specifically stores the session on the server-side 
 
##Now, on the authentication library part:

* The library we will use is passport.js
* We will use passport.js
* if we want to use passport library in one of our routes, which is login, we need to configure it first
* we can think of it as setting up a new rule in a config file, so that login route will use it (middleware)
* We require two libraries in the passport file:
* passport - for authentication
* localstrategy - it is simply one of passport's libraries, for the sake of local login
* There are three sections in this file:
* serialize/deserialize user objects
* middleware that will process the login mechanism
* custom function to validate if a user is logged in or not

**Serialization** is the process of translating data structures or object states into a format that can be stored. We want to translate the data structure, which is user object and we want to translate it into a format that can be stored. Thus, we will store it in connect-mongo. So, the key of this object is provided into the 2nd argument of the callback function in serializeUser, which is user._id. Serialize function will be saved into session and it is used to retrieve the whole object via deserialize function.

**Serialize function** means that data from the user object should be stored in the session. In our case, we want to store the id only and the result of the serializeUser method will be attached to the session as request with user._id --> req.user._id. Later on, if we want to access a user that we just logged in, we will type req.user. 

In **deserialize** function we provide as first argument of deserialize function the same key of user object that was given to done func in serializeUser call. So, the whole object is retrieved with the help of the key. 

* First, we want to give middleware a name, so it can be recognized, later on in another route, which is local-login
* Create a new anonymous instance of LocalStrategy object
* Then pass it the required fields (LocalStrategy user name and password, we override also email instead of name and also add passReqToCallback)
* Also add an anonymous function and then we want to validate it, pass the req, email, password and callback
* in the anonymous function, we want to find in our DB if the user is found by the matching email
* When we return the last callback, it returns the user object
* later on we can request ```req.user_id```
* req.user.profile.name
* in every request, this object (user) will be stored in a session, so it can be used in any page that requires you to log in

* Lastly - the validation function that checks if the user is authenticated, if not redirects to login page

###Now, in ```routers/user.js``` we added two routes:

* ```router.get(‘/login’)```
* ```router.post(‘/login’)```
* we are using the middleware we created, namely local-login in passport and then we pass in an object to this second parameter, successRedirect to profile url, or if failure, than redirect to /login url

###In ```server.js```

* We have to initialize the passport and also we need to add passport.session
* Passport.session acts as a middleware to alter the req object and change the user value that is currently the session id from the client cookie, into the true deserialize user object


###Now, we have login route, and profile

* In ```server.js``` when we add the following line:
```javascript
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});
```
* the user object will get available for all the routes 
* this is instead of specifying manually (redundantly) in every needed route, an user object, like: 
* ```user: req.user```
* every route will have the user object by default
* ```res.locals.user``` , ```locals = local``` variable and user is the object we want to use and we want to make it equal to req.user, because once logged in you will have req.user based on serialize and deserialize method

* The req.login from the user.js file, in the router.post ```(‘/signup’)``` route, is essentially adding the session to the server and the cookie to the browser by using the login function
* the user object obj is based on the result of the new user creation which we created here: User.findOne({email: req.body,email…
* the user, save object, is then passed to the login function, so the user will have the session and cookie on the browser and the session on the server

##Gravatar functionality

* when user clicks/or is redirected onto its profile page, an avatar called gravatar should be displayed
* it is made by creating a custom method inside the user model file, called gravatar
* it checks the size of the avatar, and the existance of the user’s email
* if the user doesn’t have email for some reason, a default gravatar is provided
* otherwise, a unique gravatar is created for each user profile based on the md5digest of the user’s email

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


Now, we are going to create routes for adding product category, and it will be under admin.js, because this is the responsibility of only an admin
* ```admin/add-category``` route will get a page from the server with an extra data which is message
* next, is a post route and it is relying on Category Schema because we instantiate a new object from the category
* next we want to save the data in the category name field and it will be equal to input
* save data to DB

Create ```.ejs``` for the specific route

We will add a security layer, so that only admin account can access the page of add-category!

* now we will add another middleware to our express app, so that it learns how to use a new variable which is categories, because we want to render the categories on the nav-bar
* first in the app.use (category) middleware specified in server.js
* first we want to find all the categories ```(find({}))```, search through every document in DB
* if err return callback with err
* store the list of categories in a local var called categories

##USE a new library ~ Async

* handles asynchronous code
* we use waterfall models, where a function depends on another chain function


Create our first API, so we can store all product data in the database in api.js
* we want to search for the name of the cateogry, which exists in the DB


###In main.js
* in route ```/products/:id``` - a parameter like a double dot is used if we want to get to a specific url
* so instead of adding ```router.get(‘/products/foods_id’)```, ```router.get(‘/products/gadgets_id’)```, ```router.get(‘/products/books_id’)``` we just add the ```:``` parameter
* ```req.params```, so it could be accessed in dependance of the id of the category
* ```req.params.id```, is the way to access the parameter in the routes (:id)
* ```populate``` - we can only use populate if the data type is an object id (Schema.Types,ObjectId)
* populate shows not only the id but also the information about the category
* exec executes the anonymous function on all of the above methods, e.g. on all the .find methods


###Productspage.ejs

* created another rout in main, to display a single page for the specified product, based on the id of the product


##Search feature

* install elastic search
* brew install elasticsearch
* not as sudo, or java runtime error

###Add plugin to our product schema:
* mongoosastic ~ a library which uses elasticsearch to replicate the data from mongoDB to elasticsearch
* so you can search specific data using mongoosastic feature, w/o writing additional code to connect mongoosastic and mongodb
* all within elastic search product set
* so, we can later on use Product.search
* or Product.createMapping

###the mapping code is to:
* map between product DB and elasticS, so that it creates a “bridge” between ES replica set and Product DB

###Next we want to stream the whole data from the product to ES
* it will replicate all data and put in ES
* three methods event-driven


###Next we are creating a route where we will search for products;
* ```router.post(‘/search’)``` pass the req.body.q alongside with the request

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
(recommended to run the following command:
```npm init``` from the project directory.

This command will install all the dependencies from the file **package.json**.

A **package.json** file contains meta data about your app or module. Most importantly, it includes the list of dependencies to install from npm when running npm install . If you're familiar with Ruby, it's similar to a Gemfile.


```
├── api
├── config
├── models
├── node_modules
│   ├── async
│   ├── connect-mongo
│   ├── cookie
│   ├── cookie-parser
│   ├── cookie-signature
│   ├── ejs
│   ├── ejs-mate
│   ├── elasticsearch
│   ├── express
│   │   ├── lib
│   ├── express-flash
│   │   └── lib
│   ├── express-session
│   │   └── session
│   ├── faker
│   ├── mongodb
│   │   └── lib
│   ├── mongoosastic
│   │   ├── example
│   ├── mongoose
│   │   ├── examples
│   │   ├── lib
│   ├── morgan
│   │   └── node_modules
│   ├── passport
│   │   └── lib
├── public
│   ├── css
│   └── js
├── routes
└── views
    ├── accounts
    ├── admin
    ├── main
    └── partials
```








##Instalation

In order to run our web application you will need to do several steps:

0. clone the repository (```git clone / wget```)
1. install nodejs (brew install node for OSX users)
2. install elasticsearch (brew install elasticsearch for OSX users)
3. from the terminal cd into the "e-commerce-course-project"
4. Get MongoDB, in our example we used free clound mongoDB services that offers [www.mlab.com](https://mlab.com)
5. Get Stripe accaunt www.stripe.com
6. configure the application
⋅⋅* edit ```config/secret.js``` with your mongoDB credentials that can be created on [www.mlab.com](https://mlab.com)
⋅⋅* edit ```public/js/custom.js``` with your Stripe test public key that can be created [www.stripe.com](https://dashboard.stripe.com/account/apikeys)
..* edit ```/routes/main.js``` with your Stripe test secrete key that can be created on [www.stripe.com](https://dashboard.stripe.com/account/apikeys)
7. from the terminal run "elasticsearch" (OSX users)
8. from the terminal in a new tab from the same location "e-commerce-course-project" run node server.js
9. open this URL [http://localhost:3000](http://localhost:3000) from the browser

