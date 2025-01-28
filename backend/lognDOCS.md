# Internship Hub API Documentation

This document describes the available API endpoints for managing companies and internship offers in the Internship Hub. Each section includes the request format, expected responses, and detailed explanations of the actions.

## Base URL

All requests should be made to the base URL (replace `BASE_URL` with your actual server address):

```
BASE_URL/internship-hub
```

---

## Endpoints

### 1. **Register Company**

- **URL**: `/register`
- **Method**: `POST`
- **Description**: Registers a new company with its logo and images. Only authenticated users can register companies.

#### Request:

- **Headers**:
  - `Authorization: Bearer <token>` (Authenticated user required)
- **Body** (Form-data):
  - `logo`: The company's logo image (max count: 1)
  - `images`: Up to 6 images for the company (max count: 6)

#### Example Request:

```bash
POST /register
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "logo": <file>,  # image file for logo
  "images": [<file1>, <file2>, <file3>]  # multiple image files
}
```

#### Response:

- **Success**:
  - **Status Code**: `201 Created`
  - **Body**:
    ```json
    {
      "message": "Company registered successfully",
      "company": {
        "id": 1,
        "name": "Example Company",
        "logo": "<url-to-logo>",
        "images": ["<url-to-image1>", "<url-to-image2>"]
      }
    }
    ```
- **Error**:
  - **Status Code**: `400 Bad Request`
  - **Body**:
    ```json
    {
      "message": "Invalid input, please check the data."
    }
    ```

---

### 2. **Update Company**

- **URL**: `/update_company/:id`
- **Method**: `PUT`
- **Description**: Updates an existing company. Requires the company ID in the URL and can update the logo and images.

#### Request:

- **Headers**:
  - `Authorization: Bearer <token>` (Authenticated user required)
- **URL Parameters**:
  - `id`: The ID of the company to update.
- **Body** (Form-data):
  - `logo`: New logo image (max count: 1)
  - `images`: New images for the company (max count: 6)

#### Example Request:

```bash
PUT /update_company/1
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "logo": <new-logo-file>,
  "images": [<new-image1>, <new-image2>]
}
```

#### Response:

- **Success**:
  - **Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "message": "Company updated successfully",
      "company": {
        "id": 1,
        "name": "Updated Company",
        "logo": "<url-to-new-logo>",
        "images": ["<url-to-new-image1>", "<url-to-new-image2>"]
      }
    }
    ```
- **Error**:
  - **Status Code**: `400 Bad Request`
  - **Body**:
    ```json
    {
      "message": "Invalid company ID or input data."
    }
    ```

---

### 3. **Get All Companies**

- **URL**: `/get_all_companies`
- **Method**: `GET`
- **Description**: Fetches a list of all registered companies.

#### Request:

- **Headers**: No authentication required.

#### Example Request:

```bash
GET /get_all_companies
```

#### Response:

- **Success**:
  - **Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "companies": [
        {
          "id": 1,
          "name": "Company 1",
          "logo": "<url-to-logo1>",
          "images": ["<url-to-image1>"]
        },
        {
          "id": 2,
          "name": "Company 2",
          "logo": "<url-to-logo2>",
          "images": ["<url-to-image2>"]
        }
      ]
    }
    ```

---

### 4. **Get One Company**

- **URL**: `/get_one_company/:id`
- **Method**: `GET`
- **Description**: Retrieves the details of a specific company by its ID.

#### Request:

- **URL Parameters**:
  - `id`: The ID of the company to retrieve.

#### Example Request:

```bash
GET /get_one_company/1
```

#### Response:

- **Success**:
  - **Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "company": {
        "id": 1,
        "name": "Example Company",
        "logo": "<url-to-logo>",
        "images": ["<url-to-image1>", "<url-to-image2>"]
      }
    }
    ```
- **Error**:
  - **Status Code**: `404 Not Found`
  - **Body**:
    ```json
    {
      "message": "Company not found."
    }
    ```

---

### 5. **Upload Internship Offer**

- **URL**: `/upload_internship_offer`
- **Method**: `POST`
- **Description**: Allows authenticated users to upload an internship offer.

#### Request:

- **Headers**:
  - `Authorization: Bearer <token>` (Authenticated user required)
- **Body**:
  - Internship offer details (title, description, duration, etc.)

#### Example Request:

```bash
POST /upload_internship_offer
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Software Engineer Intern",
  "description": "An internship to work on full-stack development.",
  "companyId": 1,
  "duration": "3 months",
  "location": "Remote"
}
```

#### Response:

- **Success**:
  - **Status Code**: `201 Created`
  - **Body**:
    ```json
    {
      "message": "Internship offer uploaded successfully",
      "internshipOffer": {
        "id": 1,
        "title": "Software Engineer Intern",
        "companyId": 1,
        "duration": "3 months",
        "location": "Remote"
      }
    }
    ```

---

### 6. **Get All Internship Offers**

- **URL**: `/get_all_internship_offers`
- **Method**: `GET`
- **Description**: Retrieves a list of all internship offers.

#### Request:

- **Headers**: No authentication required.

#### Example Request:

```bash
GET /get_all_internship_offers
```

#### Response:

- **Success**:
  - **Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "internshipOffers": [
        {
          "id": 1,
          "title": "Software Engineer Intern",
          "companyId": 1,
          "duration": "3 months",
          "location": "Remote"
        },
        {
          "id": 2,
          "title": "Marketing Intern",
          "companyId": 2,
          "duration": "6 months",
          "location": "New York"
        }
      ]
    }
    ```

---

### 7. **Delete Internship Offer**

- **URL**: `/delete_internship_offer/:id`
- **Method**: `DELETE`
- **Description**: Deletes a specific internship offer by its ID.

#### Request:

- **Headers**:
  - `Authorization: Bearer <token>` (Authenticated user required)
- **URL Parameters**:
  - `id`: The ID of the internship offer to delete.

#### Example Request:

```bash
DELETE /delete_internship_offer/1
Authorization: Bearer <token>
```

#### Response:

- **Success**:
  - **Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "message": "Internship offer deleted successfully."
    }
    ```

---

### 8. **Update Internship Offer**

- **URL**: `/upload_internship_offer/:id`
- **Method**: `POST`
- **Description**: Updates an existing internship offer based on the internship offer ID.

#### Request:

- **Headers**:
  - `Authorization: Bearer <token>` (Authenticated user required)
- **URL Parameters**:
  - `id`: The ID of the internship offer to update.
- **Body**:
  - Updated internship offer details.

#### Example Request:

```bash
POST /upload_internship_offer/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Software Engineer Intern",
  "description": "Updated description for the internship role.",
  "duration": "4 months"
}
```

#### Response:

- **Success**:
  - **Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "message": "Internship offer updated successfully",
      "internshipOffer": {
        "id": 1,
        "title": "Updated Software Engineer Intern",
        "companyId": 1,
        "duration": "4 months",
        "location": "Remote"
      }
    }
    ```

---

### 9. **Get One Internship Offer**

- **URL**: `/get_one_internship_offer/:id`
- **Method**: `GET`
- **Description**: Retrieves details of a specific internship offer by its ID.

#### Request:

- **URL Parameters**:
  - `id`: The ID of the internship offer to retrieve.

#### Example Request:

```bash
GET /get_one_internship_offer/1
```

#### Response:

- **Success**:
  - **Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "internshipOffer": {
        "id": 1,
        "title": "Software Engineer Intern",
        "companyId": 1,
        "duration": "3 months",
        "location": "Remote"
      }
    }
    ```

---

## Notes:

- **Authentication**: For all protected routes, you must provide a valid bearer token in the `Authorization` header.
- **File Uploads**: Image uploads use `multer` middleware, with specified limits on file counts and types.
- **Responses**: All responses include status codes, messages, and relevant data for success or failure.
