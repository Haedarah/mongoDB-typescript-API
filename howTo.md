# MongoDB typescript API
## Overview
This project provides a REST API built on top of a MongoDB database. The database consists of four collections, each representing the loyalty points data for different company's users.

## Setup
### Database:
To prepare the database for the API, follow these steps:

1) In MongoDB Compass, create a new database named `COMPANIES`, starting with `Company1` as the initial collection.


2) Add three more collections to the `COMPANIES` database: `Company2`, `Company3`, and `Company4`.

3) Navigate to the **Companies_collections_documents** directory. Each file in this directory represents one of the four collections (`Company1`, `Company2`, `Company3`, and `Company4`). Import these files into MongoDB Compass to populate each collection with sample data.

Once imported, your database is ready. Let’s proceed with setting up the API.

### API:
To set up the API layer on top of the `COMPANIES` database, follow these steps:

1) Clone this repository and navigate to the project directory. Run the following command to install all necessary dependencies:

    `npm install`    

2) In the project root, create a **.env** file. Use **.env.example** for guidence.

    > For local setup, you may ignore <DB_USER> and <DB_PASSWORD>. They are needed only for deployment.

    >If your database is hosted locally, set <MONGO_URI> to your local connection string, followed by `/COMPANIES`.

    To start the API server, run:

    `npm start`

Once these steps are complete, the API should be running and ready for use.

### POSTMAN:
You can use Postman to start querying the database via the API. Here are some examples:


1) GET - points_details - params: `?username` `?phone` `?email`

    Examples:

    `http://localhost:3000/Company1/api/points_details?username=Alice01`

    `http://localhost:3000/Company2/api/points_details?email=bob@example.com`

    `http://localhost:3000/Company3/api/points_details?phone=%2B912121212121`

2) GET - all_points - params: `?username` `?phone` `?email`

    Examples:

    `http://localhost:3000/Company1/api/all_points?phone=%2B911212121212`

    `http://localhost:3000/Company2/api/all_points?username=AwesomeBob`

    `http://localhost:3000/Company3/api/all_points?email=darwin@example.com`
    
3) GET - total_points - params: `?username` `?phone` `?email`

    Examples:

    `http://localhost:3000/Company1/api/total_points?phone=%2B911212121212`

    `http://localhost:3000/Company2/api/total_points?username=AwesomeBob`

    `http://localhost:3000/Company3/api/total_points?email=darwin@example.com`
    
4) PUT - put - params: `?username` `?phone` `?email`

    body:

    For adding points: `{"points" : positive_number, "expiry": date}`

    For deducting points: `{"points" : negative_number}`

    Examples:

    `http://localhost:3000/Company1/api/put?email=alice@example.com`

    >body: `{"points": 50, "expiry": 2024-12-31}`

    `http://localhost:3000/Company2/api/put?phone=%2B911231231231`
    
    > body: `{"points": 30, "expiry": 2024-11-30}`

    `http://localhost:3000/Company3/api/put?username=Darwin123`

    > body: `{"points": -100 }`


*ensure that you specify the respective API key in the headers of your requests. The format is:

`api-key = {COMPANY_API_KEY}`