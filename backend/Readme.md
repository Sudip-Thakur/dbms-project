# VideoHub: A Video Sharing App

Welcome to VideoHub, a platform where users can upload, share, and discover videos. This README provides an overview of the technologies used in the project, details about the backend and frontend components, and instructions on how to run the project.

## Tech Used

- **JavaScript**
- **ReactJS**
- **Node.js and Express**
- **PostgreSQL**
- **Cloudinary**
- **JWT (JSON Web Token)**
- **bcrypt**

## Backend

### Completed Tasks:
- [x] Create and update user profiles
- [x] Create, update, upload, and delete videos
- [x] Create, edit, and delete comments
- [x] Like, unlike, and list all liked videos
- [x] Create playlists, add videos to playlists, and edit playlists
- [x] Manage subscriptions similar to YouTube
- [x] Track and delete watch history
- [x] Optimize database queries


### Further Improvements:
- [ ] Implement video recommendations in more enhanced way
- [ ] Enhance security features
- [ ] Improve error handling and logging

## Frontend

### Completed Tasks:
- [x] Home page
- [x] Show liked videos
- [x] Subscription page
- [x] Watch history page
- [x] Login page
- [x] Signup page
- [x] Video upload form
- [x] Search page
- [x] Create page for individual channels


### Further Improvements:
- [ ] Create page for playlists
- [ ] Improve responsive design
- [ ] Add loading indicators and error messages

## How to Run the Project

### Frontend

1. Clone the repository:
    ```bash
    git clone https://github.com/Sudip-Thakur/videoHub.git
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

### Backend

1. Clone the repository (replace with your backend repo link):
    ```bash
    git clone https://github.com/Sudip-Thakur/dbms-project.git
    ```

2. Navigate to the project directory:
    ```bash
    cd backend
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Start the development server:
    ```bash
    npm run dev
    ```

### Note

- Ensure CORS settings in the backend are properly configured.
- Check and set the base URL in the frontend to point to your backend server.
- Ensure all necessary environment variables are set.

## Environment Variables

- **Backend:**
  - `PORT` - Port number the server will run on (e.g., `8000`)
  - `ACCESS_TOKEN_SECRET` - Secret key for JWT access tokens
  - `ACCESS_TOKEN_EXPIRY` - Expiry time for access tokens
  - `REFRESH_TOKEN_SECRET` - Secret key for JWT refresh tokens
  - `REFRESH_TOKEN_EXPIRY` - Expiry time for refresh tokens
  - `CLOUDINARY_CLOUD_NAME` - Cloud name for Cloudinary
  - `CLOUDINARY_API_KEY` - API key for Cloudinary
  - `CLOUDINARY_API_SECRET` - API secret for Cloudinary
  - `DB_URL` - PostgreSQL database URL


## Additional Information

- Make sure to regularly check and update your dependencies to avoid security vulnerabilities.
- Consider setting up automated tests for both frontend and backend to ensure the stability of the application.


## Links

- **Frontend Repository:** [VideoHub Frontend](https://github.com/Sudip-Thakur/videoHub)
- **Live Site:** [VideoHub](https://video-hub-beta-ecru.vercel.app)
