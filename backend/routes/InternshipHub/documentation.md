# Internship Hub API Documentation

This document provides details about the endpoints available in the Internship Hub API. These endpoints allow you to manage companies and internship offers.

## Endpoints

### 1. **Register Company**
- **URL**: `/register`
- **Method**: `POST`
- **Description**: Registers a new company with its logo and images.
- **Body Parameters**:
  - `logo`: Image (max count: 1)
  - `images`: Images (max count: 6)
- **Authentication**: Required (Authenticated users only)
- **Middleware**: `UploadImage`, `isAuthenticated`
  
### 2. **Update Company**
- **URL**: `/update_company/:id`
- **Method**: `PUT`
- **Description**: Updates the company details (logo and images) based on the company ID.
- **URL Parameters**:
  - `id`: The ID of the company to update.
- **Body Parameters**:
  - `logo`: Image (max count: 1)
  - `images`: Images (max count: 6)
- **Authentication**: Required (Authenticated users only)
- **Middleware**: `UploadImage`, `isAuthenticated`

### 3. **Get All Companies**
- **URL**: `/get_all_companies`
- **Method**: `GET`
- **Description**: Retrieves a list of all registered companies.
- **Authentication**: Not required

### 4. **Get One Company**
- **URL**: `/get_one_company/:id`
- **Method**: `GET`
- **Description**: Retrieves details of a specific company by its ID.
- **URL Parameters**:
  - `id`: The ID of the company to retrieve.
- **Authentication**: Not required

### 5. **Upload Internship Offer**
- **URL**: `/upload_internship_offer`
- **Method**: `POST`
- **Description**: Allows an authenticated user to upload an internship offer.
- **Authentication**: Required (Authenticated users only)
- **Middleware**: `UploadInternshipOffer`

### 6. **Get All Internship Offers**
- **URL**: `/get_all_internship_offers`
- **Method**: `GET`
- **Description**: Retrieves a list of all internship offers.
- **Authentication**: Not required

### 7. **Delete Internship Offer**
- **URL**: `/delete_internship_offer/:id`
- **Method**: `DELETE`
- **Description**: Deletes a specific internship offer by its ID.
- **URL Parameters**:
  - `id`: The ID of the internship offer to delete.
- **Authentication**: Required (Authenticated users only)

### 8. **Update Internship Offer**
- **URL**: `/upload_internship_offer/:id`
- **Method**: `POST`
- **Description**: Updates an internship offer based on the offer ID.
- **URL Parameters**:
  - `id`: The ID of the internship offer to update.
- **Authentication**: Required (Authenticated users only)

### 9. **Get One Internship Offer**
- **URL**: `/get_one_internship_offer/:id`
- **Method**: `GET`
- **Description**: Retrieves details of a specific internship offer by its ID.
- **URL Parameters**:
  - `id`: The ID of the internship offer to retrieve.
- **Authentication**: Not required

## Middlewares

- **UploadImage**: Handles the uploading of images (logo and additional images) using `multer` middleware.
- **isAuthenticated**: Verifies if the user is authenticated before allowing access to certain endpoints.
- **UploadInternshipOffer**: Handles uploading internship offer data.

## Example Usage

1. **Register a Company**
   ```bash
   POST /register
   Body:
   {
     "logo": [file],
     "images": [file1, file2, file3, file4, file5, file6]
   }
