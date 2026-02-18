# Project Report: Foodiee - Online Food Ordering System

## 1. Proposed System
The **Foodiee** system is a comprehensive web-based platform designed to facilitate online food ordering and delivery management. Unlike traditional manual ordering systems, Foodiee provides a digital bridge between customers, restaurant partners, and administrators.

### Key Features:
*   **User Module**: Customers can sign up/login, browse a variety of food items (Tea, Snacks, Breakfast, Fast Food), add items to a cart, and place orders. They can also track their order history.
*   **Restaurant Partner Module**: Restaurants can apply to join the platform. Approved partners get a dedicated dashboard to view incoming orders, track earnings, and manage their status.
*   **Admin Module**: A centralized dashboard for administrators to oversee the entire platform. Admins can view all orders, manage partner applications (Approve/Reject), view enquiries, and track job applications.
*   **Dynamic Menu Management**: The menu is stored in a database, allowing for easy updates to prices and availability.
*   **Career & Enquiry Portals**: Dedicated sections for users to contact support or apply for jobs with the company.

### Improvements over Existing Systems:
*   **Unified Ecosystem**: Integrates Customer, Restaurant, and Admin workflows in a single application.
*   **Real-time Data**: Uses a centralized MongoDB database for real-time order and status updates.
*   **Responsive Design**: Built with Tailwind CSS to ensure a seamless experience across mobile, tablet, and desktop devices.

## 2. System Specification

### Software Requirements
*   **Operating System**: Windows / macOS / Linux (Cross-platform).
*   **Frontend Technologies**:
    *   **HTML5**: For semantic structure.
    *   **CSS3 & Tailwind CSS**: For responsive and modern styling.
    *   **JavaScript (ES6+)**: For client-side logic and API interactions.
*   **Backend Technologies**:
    *   **Node.js**: JavaScript runtime environment.
    *   **Express.js**: Web application framework for handling API routes.
*   **Database**:
    *   **MongoDB**: NoSQL database for storing unstructured data (Users, Orders, Menu).
    *   **Mongoose**: ODM library for schema validation.
*   **Tools & Libraries**:
    *   **VS Code**: Integrated Development Environment.
    *   **Git**: Version Control.
    *   **Postman** (Optional): For API testing.

### Hardware Requirements
*   **Processor**: Intel Core i3 or equivalent and above.
*   **RAM**: 4GB minimum (8GB recommended for development).
*   **Storage**: 1GB free disk space.
*   **Network**: Active internet connection (required for MongoDB Atlas connectivity & CDN assets).

## 3. Design Notations

### 3.1 Use Case Diagram (Textual Representation)
**Actors**:
1.  **Customer**: 
    *   Register/Login
    *   Search Food
    *   Add to Cart
    *   Place Order
    *   View Order History
2.  **Partner**:
    *   Register/Login
    *   View Dashboard
    *   Manage Orders
3.  **Admin**:
    *   Login
    *   Manage Partners (Approve/Reject)
    *   View All Orders
    *   Manage Menu

### 3.2 Database Schema (ER Diagram Concepts)
The system uses the following Collections in MongoDB:

*   **User**: `_id`, `username`, `email`, `password`.
*   **Order**: `_id`, `orderId`, `customer_details`, `items`, `total`, `status`, `paymentMethod`.
*   **Partner**: `_id`, `partnerId`, `businessName`, `status`, `password`.
*   **MenuItem**: `_id`, `name`, `price`, `category`, `image`, `bestseller`.
*   **Enquiry** & **JobApplication**: For handling form submissions.

### 3.3 Data Flow (Simplified)
`User` -> `Place Order` -> `Server (Express API)` -> `Save to MongoDB` -> `Admin/Partner Dashboard`

## 4. Design Process
The project followed an **Iterative Development Methodology**, allowing for continuous refinement of features.

### Phases:
1.  **Requirement Gathering**: Identified the need for a digital food ordering platform connecting customers and local restaurants. Defined roles (User, Admin, Partner).
2.  **System Design**: 
    *   Designed the UI layouts for Home, Menu, and Dashboard pages.
    *   Structured the MongoDB database schemas for efficient data retrieval.
3.  **Implementation**:
    *   **Frontend**: Developed responsive pages using HTML and Tailwind CSS.
    *   **Backend**: Built RESTful APIs using Node.js/Express to handle data requests.
    *   **Integration**: Connected frontend forms to backend APIs using `fetch`.
4.  **Testing**: 
    *   Unit Testing: Tested individual API endpoints.
    *   Integration Testing: Verified the full "Order Placement" flow from User to Database.
5.  **Deployment**: Currently hosted on a local development server with cloud database connectivity.

