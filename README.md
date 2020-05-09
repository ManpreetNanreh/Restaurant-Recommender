# Restaurant-Recommender

This web project allows the user to provide a city name and they will be provided a list of local restaurants. For each reataurant, the name, cuisine type and the user rating is displayed.

For the front-end, React.js is used to create the user interface and for the back-end the Zomato API is used. The CSS is done with the help of Bootstrap and custom edits to the CSS file. The search is implemented using Paginated Search method. On the initial search, the user is provided with 20 restaurants and if more are available then they are given the option to "Show more". If "Show more" is clicked, then another GET request is made to the Zomato API and 20 more restaurants are displayed to the user.

There are also test cases written with the help of Enzyme to confirm that all the features are working as they are meant to.
