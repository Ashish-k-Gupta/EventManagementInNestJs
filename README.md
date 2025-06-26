Ending on 17-june

I'm trying to create a slug for the catergory of an event.
The slug is seo friendly in a website. 
It goes in the url;
https://example.com/blog/seo-tips-for-2025

here in below link "seo-tips-for-2025" is a slug, don't get confused with routes like "/blog/" here those are different.


ending on 20-June

I was able to create slug, 
It's nothing more than creating any other module > includes create, findall, findbyId, delete, update etc.
I have wrote all the code using gemini, I will write the same code next time as well.


22nd-june
Done with category module, but still need to test it.
Tested the userService, delete and update is pending.
THere is an issue with udpate, where when you update a use it will return you raw password inthe response, need to check if this error and if yes, we will have to fix this.

# Ending
Working on login module from this article there are still problem for me in understanding of how all of this working.
Tomorrow I will start working on this again, from the begining, need to fix these errors.
I need more practice on this, till the time it is wired in my head.

Link: https://medium.com/@camillefauchier/implementing-authentication-in-nestjs-using-passport-and-jwt-5a565aa521de


24th june
Still working on the user Service there are few problems in it. 
Can't let a user update password in the with the like rest of the user details, 
Need to create seprate function to update password, where it asks for old password or there will another method for forget password.
Also dto of min-max length is not working on create user, check why is that and fix that
 

Then we still have the work pending from the 22nd june. 


26th june, I don't know what I did today. But I had issue where I was not sending the password in the update request. But it was still un-hashing the password in the database. Which is solved now also there was this issue that even after not selecting the password in the update it was returning it in the response (as hashed password). This is also solved now using validation pipe in the main.ts file at global level that need to be fixed also.
I'm too tired to work anymore. Going to sleep. 23:23