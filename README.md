
Step one, complete and update the visuals. Write them inside divs, use scss (sass) and nodejs for help.
To do this, I will write in pure html/css/js for demo purposes only. 
The node.js will not be needed until I complete the visuals and need to move it to the plugin. 

the current settings are expecting that dist/ exist. 

ideal directory:
```
index.html - home page
/admin
	attendee
	presenter
	session
/user
	userfacing
/css - change the setting to expect css
/scss
	# all scss files
/js
	# modular files for now, move to compiled after.
```
### Rules
1. Keep all html in divs.
2. All CSS must be classes and have a prefix.
3. This JS only exists for making visuals and testing, not for actual implementation.
	1. But write endpoints expecting for future reference.
4. 
The idea is to first focus on the html as much as possible, then write the css, then the js.

What is the order to work on the pages?
1. Session Table
2. Attendee Table
3. Presenter Table
4. Individual Attendee's Page
5. User Facing Attendee's Page
6. Home Page

What is the system of approach?
1. Write all the html possible for the page fill in with static dummy data
	1. break modals into their respective divs
2. Add needed spots for features.
3. Add CSS
4. Go to the next page.



# For addtional AI Context

You wanted much less up-front styling than I initially inferred.
You wanted boilerplate HTML first, then CSS only when strictly needed.
You were fine using proper semantic table elements instead of forcing everything into divs.
You preferred minimal edits to the exact TODO, not a fuller “first pass” of the page.
You wanted me to avoid expanding the scope beyond the specific placeholder/task at hand.
You were feeling out the structure as you built, so the right approach was incremental and reversible, not “complete the whole visual block.”
So the practical adjustment was:

from “build the section as a styled static mockup”
to “make the smallest possible HTML change, then add only the CSS required to unblock layout”
The main thing I had to correct was scope. I read the README as permission to do a broader static-demo pass, but your actual working style was more stepwise and lower-ceremony than that.


npm run build:js (production, minified)
npm run build:js:dev (development, sourcemaps)
npm run watch:js