# Uncle Thomas Minimart App

![Logo](readme_assets\uncle_thomas_minimart_logo.png)

#### Objectives (MVP)

- Satisfy user stories based on client needs and developer recommendations
- Address and resolve client pain points
- Enhance security measures

#### Add-on (Stretch Goals)

- Data analysis page for client to understand his online business performance

#### Personas (Fictional Person)

- **Client:** Uncle Thomas

- **Role:** Minimart owner with several chains in the neighborhood.

- **Age:** 60+

#### Pain Points

1. **Loyal Customer Loss:**
   Uncle Thomas is concerned about losing loyal customers who have moved away from the area where his physical store is located. He believes these customers are also unhappy about not being able to support his business, which they have enjoyed for its friendly service.
   <br/>

2. **Business Succession and Modernization:**
   As Uncle Thomas ages, he is eager to pass his business on to his children. However, his children are hesitant to take over due to:
   <br/>
   - **Business Model Concerns:** They do not believe that the current business model will grow and are concerned that it may not be sustainable in the long term, especially with the rise of e-commerce.
     <br/>
   - **E-Commerce Interest:** They suggest that if Uncle Thomas invests in e-commerce, they would be more interested in taking over and managing that aspect of the business.

#### User Stories

1. As a consumer, I want to browse products by category
   I want to see a list of product categories and browse items within a selected category.
   <br />
2. As a consumer, I want to search for products by keyword
   I want to search for products by entering a keyword to quickly find what I need.
   <br />
3. As a consumer, I want to view detailed information about a product
   I want to be able to click on a product to see more details about it before purchasing.
   <br />
4. As a consumer, I want to add items to my cart and manage my cart
   I want to be able to add items to my cart and review or update the items before purchasing.
   <br />
5. As a consumer, I want to proceed to checkout and enter my shipping details
   I want to provide my shipping address and payment details to complete the purchase.
   <br />
6. As a consumer, I want to view my order history
   I want to see all my previous orders in one place so I can track them or reorder.
   <br />
7. As a registered user, I want to log in and manage my profile
   I want to log in with my credentials to access my profile and order history.
   <br />
8. As an admin, I want to manage the product inventory
   I want to add, edit, or remove products in the store to keep the inventory up to date.
   <br />
9. As an admin, I want to process customer orders
   I want to view and manage customer orders to fulfill them.
   <br />
10. (Stretch Goal) As an admin, I want to view business analytics
    I want to see sales data and reports to analyze the performance of the minimart.

#### UI/UX Wireframing

- **Figma**: [View Wireframes](https://www.figma.com/design/RkYVGK7fwjMo69p2ts1xDt/Uncle-Thomas-Minimart?m=auto&t=MHsQcLfRoKFhCT4z-1)

![alt text](readme_assets\image.png)

#### Data Model - ERD

- **dbDiagram.io**: [View ERD](https://dbdiagram.io/d/Uncle-Thomas-Minimart-15-Sep-2024-66e5bfe26dde7f41491dd8be)
  <br/>
  ![alt text](readme_assets\image-1.png)

#### Frontend

- **React JS (Vite)**: Modern JavaScript framework for building user interfaces.

- **React-Bootstrap**: For pre-designed UI components.

#### Backend

- **Python**: Programming language for backend development.
- **Flask**: Web framework for creating the backend API.
- **Flask-CORS**: Extension for handling Cross-Origin Resource Sharing (CORS).
- **Flask-Bcrypt**: Library for password hashing.
- **Flask-JWT-Extended**: Extension for handling JSON Web Tokens (JWT).
- **Psycopg3**: PostgreSQL adapter for Python.
- **Amazon S3**: File Storage (for product images)
- **Stripe**: Payment API

#### Backend Database

- **PostgreSQL**: For backend database needs

#### Security

- **User Route Protection:** Prevents unauthorized access to protected routes.

- **Token Revocation:** Uses JTI blacklist to revoke JWTs.

#### Backend API Tester

- **Postman:** For backend API route testing

#### References

Flask

- How to setup Flask and Psycopg
  https://blog.teclado.com/first-rest-api-flask-postgresql-python/
  https://www.psycopg.org/psycopg3/docs/api/cursors.html
- How to setup Flask
  https://flask.palletsprojects.com/en/3.0.x/quickstart/
- How to deploy Flask App with render.com
  https://docs.render.com/deploy-flask
- Flask JWT Extended
  https://flask-jwt-extended.readthedocs.io/en/stable/
- JWT Revoking
  https://flask-jwt-extended.readthedocs.io/en/stable/blocklist_and_token_revoking.html

- SQLAlchemy (not used in this project)
  https://dev.to/francescoxx/build-a-crud-rest-api-in-python-using-flask-sqlalchemy-postgres-docker-28lo

Python Command Line Arg

- https://medium.com/pythons-gurus/python-sys-module-beginner-guide-e7585684c26c
- https://www.geeksforgeeks.org/command-line-arguments-in-python/

Stripe Payment API

- https://docs.stripe.com/payments/accept-a-payment

Amazon S3 API

- Amazon S3 with Flask
  https://flask-s3.readthedocs.io/en/latest/

How to build API Routes in Flask

- https://www.turing.com/kb/build-flask-routes-in-python

#### React

Axios Library
https://axios-http.com/docs/example

#### PostgreSQL

https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/
https://www.datacamp.com/cheat-sheet/postgre-sql-basics-cheat-sheet
