# Global Warming for Dummies (Milestone Project 2)

Welcome to my Stream Two Project: Interactive Frontend Development - Code Institute!

Global Warming for Dummies is a website which interacts with anyone (target age <+ 12years) that my be interested in the subject. 
It provides basic information as well as a basic infographic (which have become a quite fashionable way to display data) to show CO2 data emissions per different sectors. 

This website is part of my portfolio to present to prospective employers.

Please note this is merely a course project, and then the information on the side is used for that purpose alone. I only use publicly available data for this purpose.
CO2 Data used on this example = https://ourworldindata.org/grapher/global-carbon-dioxide-emissions-by-sector
Data can be filtered by country, sector and year. 
world_countries file for the WorldMap https://github.com/jdamiani27/Data-Visualization-and-D3/blob/master/lesson4/world_countries.json

## Demo

You can check out the website [here]( https://grisselfaura.github.io/Milestone-Second-Project-Interactive-Frontend-Development//)!
![Responsive mockup](https://raw.githubusercontent.com/grisselfaura/Milestone-Second-Project-Interactive-Frontend-Development/master/assets/images/read-mockups/Mock-up-responsive-test.PNG "Responsive mockup")

## UX

- My goal on the website design was to make it as easy as possible for the potential viewers to access the information on the site while striving for a simple layout approach. 

- The design color scheme was inherited from the Bootstrap landing page to create a consistent and  visual impactful yet straighforward easy-for-the-eye feeling. 

- For the basic viewers, I wanted to provide them with an overview of the  general concepts on global warming and its importance, together with videos and news to make it easy to follow and to connect with the subject. 
  A contact form was also added for keeping contact and making a database of interested viewers via a user friendly design.
  This way, they would be able to get a glimpse of the information and a voluntary request for signing up. For this exercise GDPR legal terms were not taken into account. 
  In the 'Sign Up' section, I wanted them to be able to quickly reach out and connect with this website using a voluntary and transparent approach. 
 
- For advance viewers, I wanted to provide them with a dashboard overview showing data visualization graphs regarding CO2 emissions. In addition 
 'Sign up form' section where they can suscribe them for further information. 
 The footer shows links to other institutions with further and more in-depth information. 
  *[In future and when available to the general public real live Co2 database will be further used for the infographic].

- Wireframes available.

## Features

- ### Existing Features 
- This site uses the Scrolling Nav feature in Bootstrap with an extra feature which highlights the nav bar that is being selected by the user. Further work is need to maintained highlighted the tab that has been accessed.
- The navbar is fixed to the top that collapses on scroll. 
- Buttons are named after corresponding section to promote user friendly approach. In addition hover feature has been added all buttons to highlight user interaction with potential action.

- ### Features Left to Implement
* Further work is need to add feature that highlights active pages for example uses the scrollSpy which highlights activated sections.
* In the future i would like to add a a choropath map direcly using dc.js instead of generated using d3.js so as multiple charts can be quickly drawn (code is already started under test_script_chloro_DC_worldmap.html) but due to time limitation is yet pending to integrate all the functions to generate the infographic).
* In addition the about us and links from the footnote are yet to be connected.
* Furthermore the links to social media are not linked for the purpose of this exercise.
* Lastly, I would like to be able to have real life data feeding the info-charts. The Database choosed only contained CO2 data for the purpose of this exercise. However on a real case scenario will be more graphics showing additional parameters like temperature and water melting. 

## Technologies Used

In this section, you should mention all of the languages, frameworks, libraries, and any other tools that you have used to construct this project. For each, provide its name, a link to its official site and a short sentence of why it was used.

1. HTML
2. CSS
3. Bootstrap (4.4.1)
3.1. Scrolling Nav
3.2. Landing Page
4. Font-awesome (4.7.0) and fonts.googleapis.com used<!--********would u call this a technology********-->
5. [JQuery](https://jquery.com) The project uses **JQuery** to simplify DOM manipulation.
6. JavaScript to embedd facebook videos in both the Home and reduce tabs.
7. Dc.js, crossfilter, queue, topojson and D3.js for the data visualization (graph and world data map)
* this website is only available in english
8. Email.js to send Email Directly From JavaScript

## Testing
HTML and CSS code checked for coding errors.
CSS prefixes were checked against https://autoprefixer.github.io/

By clicking on the links in the navbar, the scrollSpy effect will work regardless of whether or not you're viewing the sections in the same order they are listed in the dropdown navbar. 

In the about us section, they can read a bit about the organization background.
They can view both the general products category in the "Product" section and specific information of the each product by clicking on the Readmore buttons (website under construction). 

1. Contact form:
-Go to the "Contact Us" page
-If you try to submit the contact form with an invalid email address, there will be an error noting the invalid email address. 
-If you try to to enter text in the mobile and dni field, it would only allow numbers in these fields.
-Furthermore, the 'required' attribute is added to all the fields, so if those fields are not filled in, the form will not submit.
-If all field are valid, the page will reload. If an potential buyer is interested in contacting Agronut Perú, they will have to fill out all fields in order for the form to go through.

In addition other-interested people are able to see colaboration posibilities with the Agronut Perú via the buttons-sections in the "Join us" section. 
They are also able to view the address location of the company via clicking on the map in the footer. 

All links will open in a new tab using 'target="_blank" to an under construction page (currently). 
All links have been manually tested to ensure that they are pointing to the correct destination.

-This site was tested across multiple browsers (Chrome, Safari, Internet Explorer, FireFox) and on multiple mobile devices (iPhone 4, 5, 7: Chrome and Safari, iPad, Samsung Galaxy) to ensure compatibility and responsiveness. During the testing phase, I realized that ```background-attachment: fixed``` was not compatible with iOS browsers. On Chrome and Safari in iOS, the background photos appeared zoomed-in and blurry. To fix this, the ```background-attachment: scroll``` property value was added in a media query.
In addition, the site  was tested via  http://ami.responsivedesign.is/ to review how the project looks and works on different screen sizes.

Section with interesting bugs or problems discovered during testing:
- sections not empalming with each others.
- about us icon losing configuration during responsive (fixed)
- H1 tittle does not fit screen on iphone 4 even with media query (fixed).
- background header images for sections reponsive for >md screens (fixed) not yet debugged to scale down for <sm screens.


## Testing

In this section, you need to convince the assessor that you have conducted enough testing to legitimately believe that the site works well. Essentially, in this part you will want to go over all of your user stories from the UX section and ensure that they all work as intended, with the project providing an easy and straightforward way for the users to achieve their goals.

Whenever it is feasible, prefer to automate your tests, and if you've done so, provide a brief explanation of your approach, link to the test file(s) and explain how to run them.

For any scenarios that have not been automated, test the user stories manually and provide as much detail as is relevant. A particularly useful form for describing your testing process is via scenarios, such as:

1. Contact form:
    1. Go to the "Contact Us" page
    2. Try to submit the empty form and verify that an error message about the required fields appears
    3. Try to submit the form with an invalid email address and verify that a relevant error message appears
    4. Try to submit the form with all inputs valid and verify that a success message appears.

In addition, you should mention in this section how your project looks and works on different browsers and screen sizes.

You should also mention in this section any interesting bugs or problems you discovered during your testing, even if you haven't addressed them yet.

If this section grows too long, you may want to split it off into a separate file and link to it from here.

## Deployment

This site is hosted using GitHub pages, deployed directly from the master branch. 
The deployed site will update automatically upon new commits to the master branch.
In order for the site to deploy correctly on GitHub pages, the landing page must be named `index.html`.

To run locally, you can clone this repository directly into the editor of your choice by pasting
```
 `git clone  https://github.com/grisselfaura/Milestone-Second-Project-Interactive-Frontend-Development/.git` into your terminal. 
```
To cut ties with this GitHub repository, type `git remote rm origin` into the terminal.

## Contribution
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Credits

### Content
The original text for the entired site was taken from already published website as this is only an educational exercise. They can be provided if required.

### Media
The photos used in this site were taken from already published website as this is only an educational exercise.

### Acknowledgements

Regarding the subject I am very deeply concerned about global warming in general and therefore i was motivated to based this project on this theme.
For the project itself I received inspiration from my tutor and also from other students via Slack. 
The Bootstrap Nav tutorial was found through this tutorial [here](https://startbootstrap.com/templates/scrolling-nav/).
The Bootstrap landing page and footer inspiration [here](https://startbootstrap.com/themes/landing-page/).
The sign up form was inspired on this model [here](https://www.climaterealityproject.org/joinreality?promo_name=Join%20Reality&promo_creative=navig%20ation&promo_position=homepage_top).


## License
[MIT](https://choosealicense.com/licenses/mit/)