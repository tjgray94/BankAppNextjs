# BankAppNextjs
BankApp is a Next.js based user application for managing banking functionalities, such as creating accounts, logging in, viewing account balances, performing various transactions like deposits, withdrawals, and fund transfers. BankApp also has transaction logging to keep track of bank interactions. This project is developed with user experience in mind, ensuring smooth and responsive interactions. 

### Features
- **Account Creation**: Users can register by filling in their information and selecting account types.
- **User Authentication**: Secure login system for user authentication.
- **Account Management**: Users can view details of their checking and savings accounts.
- **Transaction Management**:
  - **Deposits and Withdrawals**: Users can deposit into or withdraw from their accounts.
  - **Transfers**: Transfer funds between accounts if both checking and savings accounts are available.
  - **Logging**: All transactions(deposits, withdrawals, and transfers) are logged and can be viewed upon successful login
- **Form Validation**: Uses react-hook-form for front-end validations on all forms.

### Technology Stack
- **Frontend**: Next.js, TypeScript, HTML, Tailwind CSS
- **HTTP Client**: Prisma
