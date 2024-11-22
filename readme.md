# API Documentation
## Introduction
Welcome to the **Company1 API**. This API allows you to view and add/deduct users points in Company1's loyalty database.

**Base URL**: `https://mongodb-typescript-api.onrender.com/Company1/api`

## Authentication
Include your API key in the request headers:

`api-key : YOUR-API-KEY`

## Endpoints

### Get User Points History
**URL**: `/api/all_points`

**Method**: `GET`

**Description**: Retrieves details of a user's loyalty points. You can search for a user by one of the following parameters: `username`, `phone`, or `email`.

#### Request Parameters:

| Parameter     | Type      | Required      | Description               |
|:-------------:|:---------:|:-------------:|:--------------------------|
| `username`    | string    | optional      | id of the user            |
| `phone`       | string    | optional      | phone number of the user  |
| `email`       | string    | optional      | email of the user         |
> **Note**: At least one of these parameters is required to retrieve user details.

#### Example Requests:

##### Example-1
Retrieve user points by `username`:

**GET** `/all_points?username=Alice01` HTTP/1.1

**Authorization:** api-key : YOUR-API-KEY

##### Example-2
Retrieve user points by `phone`:

**GET** `/all_points?phone=%2B911212121212` HTTP/1.1

**Authorization:** api-key : YOUR-API-KEY

##### Example-3
Retrieve user points by `email`:

**GET** `/all_points?email=alice@example.com` HTTP/1.1

**Authorization:** api-key : YOUR-API-KEY

#### Responses:

##### Success(200) OK
```json
{
    "points": [
        {
            "points": "150",
            "issuance": "2024-07-10T00:00:00.000Z",
            "expiry": "2024-10-31T00:00:00.000Z",
            "current_points": "150",
            "tx_id": "Add-Alice01-001",
            "_id": "6738facd9fa3882e77fb97e3"
        },
        {
            "points": "77",
            "issuance": "2024-08-06T20:00:00.000Z",
            "expiry": "2024-11-30T00:00:00.000Z",
            "current_points": "77",
            "tx_id": "Add-Alice01-002",
            "_id": "6738facd9fa3882e77fb97e5"
        },
    ]
}
```

##### Error(400) Bad Request
```json
{
    "error": "Missing query parameter"
}
```

##### Error(403) Forbidden
```json
{
    "error": "Forbidden: Invalid API key"
}
```

##### Error(404) Not Found
```json
{
    "error": "User not found"
}
```

##### Error(500)
```json
{
    "error": "Server error"
}
```

### Get User Total Points
**URL**: `/api/total_points`

**Method**: `GET`

**Description**: Retrieves the total available loyalty points of a user. You can search for a user by one of the following parameters: `username`, `phone`, or `email`.

#### Request Parameters:

| Parameter     | Type      | Required      | Description               |
|:-------------:|:---------:|:-------------:|:--------------------------|
| `username`    | string    | optional      | id of the user            |
| `phone`       | string    | optional      | phone number of the user  |
| `email`       | string    | optional      | email of the user         |
> **Note**: At least one of these parameters is required to retrieve user details.

#### Example Requests:

##### Example-1
Retrieve user points by `username`:

**GET** `/total_points?username=Alice01` HTTP/1.1

**Authorization:** api-key : YOUR-API-KEY

##### Example-2
Retrieve user points by `phone`:

**GET** `/total_points?phone=%2B911212121212` HTTP/1.1

**Authorization:** api-key : YOUR-API-KEY

##### Example-3
Retrieve user points by `email`:

**GET** `/total_points?email=alice@example.com` HTTP/1.1

**Authorization:** api-key : YOUR-API-KEY

#### Responses:

##### Success(200) OK
```json
{
    "totalPoints": 77
}
```

##### Error(400) Bad Request
```json
{
    "error": "Missing query parameter"
}
```

##### Error(403) Forbidden
```json
{
    "error": "Forbidden: Invalid API key"
}
```

##### Error(404) Not Found
```json
{
    "error": "User not found"
}
```

##### Error(500)
```json
{
    "error": "Server error"
}
```

### Get User Active Points
**URL**: `/api/points_details`

**Method**: `GET`

**Description**: Retrieves the details of the user active points. This is a more useful version of `/all_points`. You can search for a user by one of the following parameters: `username`, `phone`, or `email`.

#### Request Parameters:

| Parameter     | Type      | Required      | Description               |
|:-------------:|:---------:|:-------------:|:--------------------------|
| `username`    | string    | optional      | id of the user            |
| `phone`       | string    | optional      | phone number of the user  |
| `email`       | string    | optional      | email of the user         |
> **Note**: At least one of these parameters is required to retrieve user details.

#### Example Requests:

##### Example-1
Retrieve user points by `username`:

**GET** `/points_details?username=Alice01` HTTP/1.1

**Authorization:** api-key : YOUR-API-KEY

##### Example-2
Retrieve user points by `phone`:

**GET** `/points_details?phone=%2B911212121212` HTTP/1.1

**Authorization:** api-key : YOUR-API-KEY

##### Example-3
Retrieve user points by `email`:

**GET** `/points_details?email=alice@example.com` HTTP/1.1

**Authorization:** api-key : YOUR-API-KEY

#### Responses:

##### Success(200) OK
```json
{
    "total_points": 77,
    "points": [
        {
            "points": "77",
            "expiry": "2025-01-01T00:00:00.000Z"
        }
    ]
}
```

##### Error(400) Bad Request
```json
{
    "error": "Missing query parameter"
}
```

##### Error(403) Forbidden
```json
{
    "error": "Forbidden: Invalid API key"
}
```

##### Error(404) Not Found
```json
{
    "error": "User not found"
}
```

##### Error(500)
```json
{
    "error": "Server error"
}
```

### Update User Points (add more points OR user some of the active points)
**URL**: `/api/put`

**Method**: `PUT`

**Description**: Adds a new element to the points array in a user profile. You can update a user's points by one of the following parameters: `username`, `phone`, or `email`.

#### Request Parameters:

| Parameter     | Type      | Required      | Description               |
|:-------------:|:---------:|:-------------:|:--------------------------|
| `username`    | string    | optional      | id of the user            |
| `phone`       | string    | optional      | phone number of the user  |
| `email`       | string    | optional      | email of the user         |
> **Note**: At least one of these parameters is required to retrieve user details.

#### Example Requests:

##### Example-1
Add points by `username`:

**PUT** `/put?username=Alice01` HTTP/1.1

**Authorization:** api-key : YOUR-API-KEY

**Body:**
```json
{
    "points" : 50,
    "expiry" : "2024-12-31"
}
```

##### Example-2
Deduct points by `phone`:

**PUT** `/put?phone=%2B911212121212` HTTP/1.1

**Authorization:** api-key : YOUR-API-KEY

**Body:**
```json
{
    "points" : -20
}
```

##### Example-3
Add points by `email`:

**PUT** `/put?email=alice@example.com` HTTP/1.1

**Authorization:** api-key : YOUR-API-KEY

**Body:**
```json
{
    "points" : 40,
    "expiry" : "2025-01-01"
}
```
#### Responses:

##### Success(200) OK
```json
{
    "message": "Points updated successfully",
    "tx_id": "MONET-add_202411211607510778",
    "id": "6740ac5791f958ed45ae9dae"
}
```

##### Error(400) Bad Request
```json
{
    "error": "Missing query parameter"
}
```

##### Error(403) Forbidden
```json
{
    "error": "Forbidden: Invalid API key"
}
```

##### Error(404) Not Found
```json
{
    "error": "User not found or no update performed"
}
```

##### Error(500)
```json
{
    "error": "Server error"
}
```