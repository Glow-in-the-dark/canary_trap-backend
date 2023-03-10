# Canary TRAP

## _Exposing and Prevention of Information Leakage_

## _Traceable deterrence_

Canary TRAP prevents and exposes information leakages, by leaving visually undetectable but traceable footprints to the naked eye in the digital documents.

Here’s how a canary trap works: The process of a canary trap involves distributing a memo containing confidential information to a group of individuals, also referred to as canaries. However, the phrasing in each memo copy is slightly altered. If the information becomes exposed to an unauthorized individual, the leaked text discloses which version of the memo was disclosed and thus, the source of the leak is exposed.

#### What we do:

We embedded visually undetectable information into your digital documents. In the event when the confidential information is leaked, or shared, it would be possible to trace the leakage.

This repository is for the backend. You may find the frontend repository [HERE](https://github.com/Glow-in-the-dark/canary_trap).

## Technologies Used

Main:

1. React - for frontend.
2. Redux - for State management
3. MongoDB / Mongoose- the database for the backend.
4. Express - for the middleware.
5. Multer - middleware to transport image buffer between frontend & backend
6. JIMP - for pixel manipulation
7. nodemailer - for automated email + attaching IMGs to email.

Other smaller packages: 8. Axios - for fetching 9. Tailwind - for styling. 10. React router - routing to different pages, for the NavBar. 11. jsonwebtoken - to enable JWT token 12. jwt-decode - for decoding JWT tokens 13. UUID - for unique ID 14. bcrypt - encryption for password 15. dotenv - for private enviroment variables 16. heroicons - for icons 17. buffer - for use images buffer

## General Approach

1. Create the schema for Mongo DB
2. used JIMP to do image manipulation and make sure it works.
   - passed image as buffer from frontend to backend using "multer"
   - convert buffer into JIMP image.
   - decomposed JIMP image into pixels array.
   - write Checks to ensure image comparison works.
3. Creating the controllers for endpoints for function call from the frontend

## Limitations & Future work

- Add in additional features e.g PDF conversion compatability)
- Add in capabilites to allow image tracebility even if image is cropped / skewed. (Current feature only work on full image)
- use matrix package for better computational efficiency.
- redo database schema, for better stripping of redundant infomation being fed to frontend, which can result in slower initial loading time, and rendering of state.
