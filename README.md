# Server for my react-blog

## Quick introduction:mount_fuji::sunrise_over_mountains::
This is express api for my other repository called "React-blog".

***Presently sign in, log in, log out, add blog, get blogs functionality works.***

Api uses tokens authorization, stores images using "imagekit.io" and sends email message while user is signing in.
### Deployed app:
 - https://tranquil-conkies-c8f7c2.netlify.app/

## Get started:

1. At first clone or fork this repository;

2. Than run "npm i" command in terminal to install
all dependencies;

3. You need to decide where will be stored your database. After you have made a decision, go to "config" folder and import database dump to a choosen place ( database dump is a file with .sql extension);

4. Add ".env" file. This file stores your private information( api keys, passwords );

### Add variables into ".env" file.
This table contains description about some variables and what they are used for
| Variable | Description |
| -------- | ------------ |
| PORT | port on which your server starts (5000 for instance) |
| CLIENT_URL | url to frontend part of react-blog |
| trebble variables | I use "trebble" middleware in this project. "trebble.com" allows to see all requests that are sent to server and makes auto-documentation. If you are not interested in this, remove "useTrebble" from index.js and don't specify env variables for trebble. Or if you want to have a taste, go to "trebble.com", make an account for free and specify your api key and project id in .env file.|
| tokens | These two variables store your secret keys - random strings, that are used to generate and validate access and refresh tokens. |
| email | This project sends activation code to users email when user's signing in. You need to configure smtp in your email account, and get there info for env variables. |
| imagekit variables | "imagekit.io" is a service that provides 20gb storage for photos and videos, applies auto-optimization and also have api that allows to save images. You need to create an account and get your keys for variables in account settings.|
```
# this is how .env looks with all variables added.   
    
    # basic variables
    PORT=5000
    CLIENT_URL=http://localhost:3000


    # connection to database
    DB_PORT=3003
    DB_NAME=blog
    DB_USER=dbUser
    DB_PASSWORD=dbPassword
    DB_HOST=localhost


    # treblle 
    TREBLLE_API_KEY=trebble.comApiKey
    TREBLLE_PROJECT_ID=trebble.comProjectId


    # tokens
    JWT_ACCESS_SECRET_KEY=your_random_string
    JWT_REFRESH_SECRET_KEY=your_random_string


    # email 
    SMTP_HOST=smtp.host.eu
    SMTP_PORT=879
    SMTP_USER=userUKJLllp
    SMTP_PASSWORD=fjdkInl


    # imagekit
    IMAGEKIT_PUBLIC_KEY="youeererSDFDS"
    IMAGEKIT_PRIVATE_KEY="private_dsfjdJHKL:iudf="
    IMAGEKIT_URL=https://ik.imagekit.io/yourImages

```

### After you've done all mentioned above, run ***npm start*** in a root directory and your server is started :stars::rocket::star2: