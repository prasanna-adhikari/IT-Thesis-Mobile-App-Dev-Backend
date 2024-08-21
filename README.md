1. Functional Requirements 

User Management: 

User Registration: 

The system shall allow new users (students and graduates) to register using their student ID, name, email, and password. 

The system shall validate the student ID and email format during registration. 

The system shall assign roles (student, graduate, admin) based on user input. 

User Login: 

The system shall allow users to log in using their email and password. 

The system shall authenticate users and provide a session token upon successful login. 

User Profile: 

The system shall allow users to view and edit their profile information, including name, email, and password. 

The system shall allow graduates to submit verification requests to access the application. 

Manual Verification for Graduates: 

The system shall provide an admin interface to manually verify graduates before granting them access to the application. 

The system shall send a notification to graduates once their verification is complete. 

Club Management: 

Club Creation: 

The system shall allow admins to create new clubs by providing the club name, description, and selecting an admin for the club. 

Club Management: 

The system shall allow club admins to edit club details, post events, and manage club followers. 

Follow/Unfollow Clubs: 

The system shall allow users to follow and unfollow clubs. 

The system shall notify users when they successfully follow or unfollow a club. 

Event Management: 

Event Creation: 

The system shall allow club admins to create new events by providing event details, including title, description, date, time, and location. 

The system shall allow club admins to edit or delete events. 

Event RSVPs: 

The system shall allow users to RSVP to events, choosing from "Yes," "No," or "Maybe." 

The system shall track the number of RSVPs for each event and display this information to the event organizer. 

Event Notifications: 

The system shall notify users when an event they’ve RSVP’d to is approaching. 

Event Feed: 

The system shall display a feed of upcoming events to users, filtered by the clubs they follow. 

Post Management: 

Post Creation: 

The system shall allow club admins to create posts for their followers, including text content and attachments. 

The system shall allow users to comment on posts. 

Post Feed: 

The system shall display a chronological feed of posts from the clubs the user follows. 

Chat Functionality: 

Chat Initiation: 

The system shall allow users to initiate one-on-one chats with other users using their student IDs. 

Real-Time Messaging: 

The system shall support real-time messaging between users. 

The system shall store chat history for later access by both parties. 

Notifications: 

The system shall notify users of new messages and unread chats. 

Search and Filtering: 

Search Clubs: 

The system shall allow users to search for clubs by name or keyword. 

Filter Events: 

The system shall allow users to filter events by date, time, club, and event type. 

Recommendation System: 

The system shall recommend clubs and events to users based on their interests and activities. 

Notifications: 

Event Notifications: 

The system shall notify users about new events, event updates, and reminders for events they have RSVP’d to. 

General Notifications: 

The system shall notify users of important updates, new posts from clubs they follow, and new follower activities. 

Admin Features: 

User and Content Moderation: 

The system shall allow admins to moderate user-generated content, including posts and comments. 

The system shall allow admins to manage user accounts, including suspension and deletion. 

Analytics and Reports: 

The system shall provide analytics and reports on user engagement, event attendance, and club activity to admins. 

2. Non-Functional Requirements 

Performance: 

Response Time: 

The system shall respond to user actions within 2 seconds under normal load. 

Scalability: 

The system shall be able to handle up to 10,000 simultaneous users without performance degradation. 

Security: 

Data Encryption: 

The system shall encrypt all user data in transit and at rest using industry-standard encryption protocols. 

Authentication: 

The system shall implement secure authentication mechanisms, including password hashing and token-based authentication. 

Access Control: 

The system shall ensure that only authorized users can access certain features, such as admin functionalities and graduate verification. 

Usability: 

User Interface: 

The system shall provide an intuitive and user-friendly interface that is easy to navigate for both new and experienced users. 

Accessibility: 

The system shall comply with accessibility standards (e.g., WCAG 2.1) to ensure that users with disabilities can use the application effectively. 

Reliability: 

Availability: 

The system shall be available 99.9% of the time, excluding scheduled maintenance. 

Backup and Recovery: 

The system shall perform daily backups and provide a recovery mechanism in case of data loss. 

Maintainability: 

Code Quality: 

The system shall be developed following clean code principles and be well-documented to facilitate easy maintenance and updates. 

Modularity: 

The system shall be designed in a modular fashion, allowing for easy updates, additions, and removal of features. 

3. Technical Requirements 

Platform Compatibility: 

The application shall be compatible with iOS (version X and above) and Android (version 1 and above). 

Database: 

The system shall use PostgreSQL (or similar) for relational data storage. 

APIs: 

The system shall provide RESTful APIs for all backend services to ensure compatibility with the mobile front-end. 

Real-Time Communication: 

The system shall use WebSockets or a similar technology for real-time chat functionality. 

Hosting and Deployment: 

The system shall be hosted on a cloud platform (e.g., AWS, Heroku) with auto-scaling capabilities. 

 
