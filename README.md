# Foodiee - Online Food Ordering System

A comprehensive full-stack web application designed to facilitate online food ordering, restaurant management, and delivery tracking. Built with the MERN stack (MongoDB (Atlas), Express.js, React-concepts/HTML/JS, Node.js).

## Project Overview
Foodiee serves as a platform connecting three key stakeholders:
1.  **Customers**: Can browse menus, place orders, and track delivery status.
2.  **Partners (Restaurants)**: Can manage their business profile and view incoming orders.
3.  **Administrators**: Have full oversight of the system, including partner approvals and platform analytics.

## Features
*   **User Authentication**: Secure Login and Signup for Users, Partners, and Admins.
*   **Dynamic Menu**: Real-time fetching of menu items from the database.
*   **Ordering System**: Complete flow from Cart to Order Confirmation.
*   **Order History**: Users can view their past orders.
*   **Admin Dashboard**: Centralized control to manage content and users.
*   **Partner Dashboard**: Detailed statistics and order management for restaurants.
*   **Responsive Design**: Mobile-friendly interface powered by Tailwind CSS.

## Tech Stack
*   **Frontend**: HTML5, CSS3, JavaScript, Tailwind CSS.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB Atlas.
*   **Tools**: VS Code, Git, Postman.

## Setup Instructions
1.  **Clone the repository**:
    ```bash
    git clone <repository_url>
    cd Foodiee/College-Project
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Create a `.env` file in the root directory and add your MongoDB connection string:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    PORT=3000
    ```

4.  **Run the Server**:
    ```bash
    npm start
    ```
    Or for development with auto-reload:
    ```bash
    npm run dev
    ```

5.  **Access the Application**:
    Open `http://localhost:3000` in your browser.

## Project Structure
*   `/assets`: Static images and CSS files.
*   `/`: HTML pages for all views.
*   `server.js`: Main backend entry point containing all API routes.
*   `PROJECT_REPORT.md`: Detailed system requirements and design documentation.

## Team
Developed by:
1.  Karthikeyan
2.  Abirami
3.  Nithiya
4.  Suganya
5.  Natherdeen
6.  Dinesh
