
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