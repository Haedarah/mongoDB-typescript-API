# MongoDB typescript API
## Overview
<p>
    This project provides a REST API built on top of a MongoDB database. The database consists of four collections, each representing the loyalty points data for different company's users.
</p>

## Setup
### Database:
<p>To prepare the database for the API, follow these steps:</p>
<ol>
    <li style="margin-bottom:5px">
        In MongoDB Compass, create a new database named <code style="color: lime">COMPANIES</code>, starting with <code style="color: yellow">Company1</code> as the initial collection.
    </li>
    <li style="margin-bottom:5px">
        Add three more collections to the <code style="color: lime">COMPANIES</code> database: <code style="color: yellow">Company2</code>, <code style="color: yellow">Company3</code>, and <code style="color: yellow">Company4</code>.
    </li>
    <li style="margin-bottom:5px">
        Navigate to the <strong>Companies_collections_documents</strong> directory. Each file in this directory represents one of the four collections (<code style="color: yellow">Company1</code>, <code style="color: yellow">Company2</code>, <code style="color: yellow">Company3</code>, and <code style="color: yellow">Company4</code>). Import these files into MongoDB Compass to populate each collection with sample data.
    </li>
</ol>
<p>Once imported, your database is ready. Let’s proceed with setting up the API.</p>

### API:
<p>To set up the API layer on top of the <code style="color: lime">COMPANIES</code> database, follow these steps:</p>
<ol>
    <li style="margin-bottom:5px">
        Clone this repository and navigate to the project directory. Run the following command to install all necessary dependencies:<br>
        <code>npm install</code>    
    </li>
    <li style="margin-bottom:5px">
        In the project root, create a <Strong><i>.env</i></strong> file. Use <strong><i>.env.example</i></strong> as a guide.<br> ~For local setup, you may ignore <i>DB_USER</i> and <i>DB_PASSWORD</i>, as they are needed only for deployment.<br>
        ~If your database is hosted locally, set <i>MONGO_URI</i> to your local connection string, followed by "/COMPANIES".
    </li>
    <li style="margin-bottom:5px">
        To start the API server, run:<br>
        <code>npm start</code>
    </li>
</ol>
<p>
    Once these steps are complete, the API should be running and ready for use.
</p>

### POSTMAN:
<p>You can use Postman to start querying the database via the API. Here are some examples:</p>
<ol>
    <li>
        GET - points_details - params: <code>?username</code> <code>?phone</code> <code>?email</code><br>
        Examples: <br>
        <code>http://localhost:3000/Company1/api/points_details?username=Alice01</code><br>
        <code>http://localhost:3000/Company2/api/points_details?email=bob@example.com</code><br>
        <code>http://localhost:3000/Company3/api/points_details?phone=%2B912121212121</code><br>
    </li>
    <li>
        GET - total_points - params: <code>?username</code> <code>?phone</code> <code>?email</code><br>
        Examples: <br>
        <code>http://localhost:3000/Company1/api/total_points?phone=%2B911212121212</code><br>
        <code>http://localhost:3000/Company2/api/total_points?username=AwesomeBob</code><br>
        <code>http://localhost:3000/Company3/api/total_points?email=darwin@example.com</code><br>
    </li>
    <li>
        PUT - put - params: <code>?username</code> <code>?phone</code> <code>?email</code><br>
        body:<br>
        For adding points: <code>{"points" : positive_number, "expiry": date}</code><br>
        For deducting points: <code>{"points" : negative_number}</code><br>
        Examples: <br>
        <code>http://localhost:3000/Company1/api/put?email=alice@example.com</code><br>
        &emsp;&emsp;=> body: <code>{"points": 50, "expiry": 2024-12-31}</code><br>
        <code>http://localhost:3000/Company2/api/put?phone=%2B911231231231</code><br>
        &emsp;&emsp;=> body: <code>{"points": 30, "expiry": 2024-11-30}</code><br>
        <code>http://localhost:3000/Company3/api/put?username=Darwin123</code><br>
        &emsp;&emsp;=> body: <code>{"points": -100 }</code><br>
    </li>
</ol>
    <p>*ensure that you specify the respective API key in the headers of your requests. The format is: <code>api-key = {COMPANY_API_KEY}</code></p>