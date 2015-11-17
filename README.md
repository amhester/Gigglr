# Gigglr
## Overview

A long time ago in a galaxy far, far away the name Gigglr was first used to describe a small woodland creature native to the planet Kepler-442b.  Unfortunately, there was nothing funny about that.  In more recent times, the Gigglr name has become associated with an innovative way of allowing people to find and share funny things on the Internet, and allow users to be matched with others with similar tastes in interwebz.

## Motivation

This project was created for the 2015 Geofeedia HAckaTh0n, and also because we thought it would be cool. So yeah... have fun searching Gigglr!!!

## Installation

* Clone this project locally.
* Make sure you have node/npm installed on your machine. Open up a terminal, cd into the directory you cloned the project and run `npm install`.
  * This will install all the necessary node modules that the service requires. Then to run, simply run `node [service-name:api].js` in the terminal (make sure you are in your project's directory) and the service should now be running in your terminal.
* One more thing to note is that we use a logger called bunyan which is a really nice json logger, however its normal console output isn't very readable/pretty, so to overcome this they have a cli tool that will prettify the output and allow some other cool log searching/filtering capabilities. To download, open a terminal and run `npm install -g bunyan`. Then when you go to run the service use this command instead to make sure the output is prettified: `node [service-name:api].js | bunyan`. There are more ways you can use bunyan that can be very useful, but the above command is the most basic and probably what you'll want 90% of the time.

## Technologies Used

###Front-End
* React/Flux
* Material Design
* Google Sign-In
* ECMAScript2015(es6)
* Babel
* sass

###Server
* Nodejs
* Restify 
* gremlin-client
* gulp
* natural-node (nlp)

###Database
* TitanDB

###API's
* Google Custom Search Engine API

## API Reference

Here are the endpoints our service exposes:

* `/search/:q`, This is our main route for performing searches:
  * `q`, A string which will be used as the search term or phrase.

##Features

* Search
  * Search for funny content on the web based on whatever term or phrase you enter.
  * Enhance results if tied to an account by analyzing your likes.
* Favorite
  * Allow people signed in to their google account to favorite content.
  * This will be used for storing your favorites and also improving your results.

##Stretch Goals

* Giggle Buddies
  * be able to add 'giggle buddies' who share similar humor and share favorited content between them.
* Real-Time alerting when stuff comes in for you
* Infinite Scrolling of content.
* Utilize TensorFlow for advanced recommendation engine.
* Get Will a girlfriend.

##Issues Encountered

## Tests

No tests yet :(

## Contributors

Alex Hester, Will Jaynes, Daniel Mallinak, Jon Scott, Juan Faustd

###Special Thanks
Steven Schweibold
