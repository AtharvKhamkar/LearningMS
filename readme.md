# Learning Management System

Welcome to [Your Learning Management System Name], a cutting-edge platform designed to revolutionize the way you learn and teach. Our platform empowers users to explore a vast array of courses, connect with instructors and peers, and create personalized learning experiences tailored to their goals and interests.

---

## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environement.

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v18.19.0

    $ npm --version
    10.2.3

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###

### Yarn installation

After installing node, this project will need yarn too, so just run the following command.

      $ npm install -g yarn

---

## Install

    $ gh repo clone AtharvKhamkar/LearningMS
    $ cd LearningMS
    $ npm install

## Configure app

### Required environment variable

- DATABASE_URL
- PORT
- CORS_ORIGIN
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- ACCESS_TOKEN_SECRET
- ACCESS_TOKEN_EXPIRY
- REFRESH_TOKEN_SECRET
- REFRESH_TOKEN_EXPIRY
- RESEND_API_KEY

## Running the project

    $ npm run dev

## Schema Design
- link - https://app.eraser.io/workspace/t9GxdDYCBtM1ir31uWZX?origin=share

## Project live url

- Project - https://learningms.onrender.com

## Swagger documentation url
- link - https://learningms.onrender.com/api-docs/