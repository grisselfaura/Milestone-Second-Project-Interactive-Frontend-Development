# Global Warming for Dummies (Milestone Project 2)

Welcome to my Stream Two Project: Interactive Frontend Development - Code Institute!

Global Warming for Dummies is a website which interacts with anyone (target age <+ 12years) that my be interested in the subject. 
It provides basic information as well as a basic infographic (which have become a quite fashionable way to display data) to show CO2 data emissions per different sectors. 

This website is part of my portfolio to present to prospective employers.

Please note this is merely a course project, and then the information on the side is used for that purpose alone. I only use publicly available data for this purpose.
CO2 Data used on this example = https://ourworldindata.org/grapher/global-carbon-dioxide-emissions-by-sector
Data can be filtered by country, sector and year. One disadvantage is that a few countries are missing from this database which will be shown in the map as gray.
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
- The navbar is fixed to the top and includes an dropdown Menu for the md-screen that collapses when selected. 

- ### Features Left to Implement
* In the future i would like to add a a choropath map direcly using dc.js instead of generated using d3.js so as multiple charts can be quickly drawn (code is already started under test_script_chloro_DC_worldmap.html) but due to time limitation is yet pending to integrate all the functions to generate the infographic). 
Fixed with the help from mentor during last session. However the generated map is not centered on the div and cant not be target via css.
* In addition the "About us" and links from the footnote are yet to be constructed.
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

By clicking on the links in the navbar, the background effect will confirm to the user which tab has been selected. All tabs can be independently accessed without having to go back to the HOME tab. 
*The footnote and social media links as well as the "About us" tab are pending to be developed (future construction) as for the purpose of this project they will not add any further skill . 

1. HOME TAB
-If you try to click on the embeded facebook link it will start displaying and can be paused from the same screen.
-All navigations link work and will redirect you to the desire tab.
-If you try to do a quick sign up for news from the quick CALL TO ACTION FORM, it will redirect you to the Sign up Tab and will prefill you email to the new form.
*Country is by default showing Afghanistan as the country form is being shown in alfabetical display.

2. DASHBOARD TAB
-The infographics is interactive. The user can search for any given country from the database.
-In addition hover feature has been added to the charts to highlight user interaction with potential action. The hover over on any pie slice/bar chart/country will display detailed data information.

3. REDUCE TAB
-If you try to click on the embeded facebook link it will start displaying and can be paused from the same screen.
-A color scale map was also added for easy and fun visualization comparing the data of all countries in one single view.

4. SIGN UP TAB
-If you try to submit the contact form with an invalid email address, there will be an error noting the invalid email address. 
-Furthermore, the 'required' attribute is added to all the fields, so if those fields are not filled in, the form will not submit. There will be an error indicating to the user what it is missing.
-When form is submitted a loading gif will be show to indicate the user that the website is loading. Furthermore when submission is successfull the user will see an alert message confirming that submission was or not successfull.

All links will open in a new tab using 'target="_blank" except for the ones that are not yet developed further as previously indicated. 
All links have been manually tested to ensure that they are pointing to the correct destination with exception to the links that are not yet developed/connected as aboved indicated.

-This site was tested across multiple browsers (Chrome, Safari, Internet Explorer, FireFox) and on multiple mobile devices (iPhone 4, 5, 7: Chrome and Safari, iPad, Samsung Galaxy) to ensure compatibility and responsiveness. 
In addition, the site  was tested via  http://ami.responsivedesign.is/ to review how the project looks and works on different screen sizes.

Tabs and sections with interesting bugs or problems discovered during testing:
- Section padding was to big for the UX desing of this project. This was fixed by modifying the scrolling css from Bootstraap as per our needs (fixed).
- * Further work is need to add feature that highlights active pages for example using similar system than the scrollSpy which highlights activated sections (fixed). 
- The required attribute with the select element in a single choice form needs an empty value attribute or first child element with no text for our sign-in form (fixed).
- Footnote on dashboard was not centered. This was achieved with using the correct grid option from Bootstraap (fixed).
- Showcase and reduce images were all different sizes and therefore dificult to scale up for responsiveness design without using targetting images individually. Aspect ratio strategy was not a successful approach to scale them up at once.
- WordlMap responsiveness needs to be address and removed from the header div to avoid shadow bug inside the worldmap div (fixed).
- Facebook embeeded videos are loading are taking very long time to load in the REDUCE TAB (fixed).
- Pie charts not smootly loading (fixed).


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