Design a complete production-ready SaaS web application called:

DIGITAL WARRANTY & PRODUCT OWNERSHIP TRACKER

The application is a modern dashboard-style web application used to manage owned products, warranties, receipts, manuals, maintenance records, warranty reminders, and ownership information.

The UI must look like a professional SaaS product.

Examples of style inspiration:

* Stripe Dashboard
* Linear
* Notion
* Vercel Dashboard
* Clerk Dashboard

Important:

* Prioritize usability over creativity
* Minimalistic design
* Easy to implement in React + Tailwind CSS
* No fancy animations
* No glassmorphism
* No neumorphism
* No complex illustrations
* No futuristic cyberpunk style
* Clean white theme
* Professional enterprise software appearance

---

## GLOBAL LAYOUT

Desktop layout:

Left sidebar:

* fixed width 260px
* application logo at top
* navigation links below

Top navigation bar:

* search bar
* notification bell
* user avatar
* user dropdown menu

Main content area:

* responsive
* card-based layout
* max width 1600px

Sidebar navigation items:

* Dashboard
* Products
* Notifications
* Settings

Use Lucide icons.

---

## DESIGN SYSTEM

Primary color:
#2563EB

Success:
#22C55E

Warning:
#F59E0B

Danger:
#EF4444

Background:
#F8FAFC

Cards:
White
16px border radius
Subtle shadow

Buttons:

Primary Button:
Blue background
White text

Secondary Button:
White background
Gray border

Danger Button:
Red background

Inputs:

48px height
Rounded corners
Subtle border

Tables:

Modern SaaS table style
Hover effect
Pagination

Badges:

Active = Green
Expiring Soon = Yellow
Expired = Red

---

## LOGIN PAGE

Centered authentication card

Logo

Heading:
Welcome Back

Description:
Manage your products and warranties in one place.

Fields:

Email

Password

Remember Me checkbox

Forgot Password link

Login button

Link:
Create Account

Right side desktop illustration showing:
products
receipts
warranty tracking

---

## REGISTER PAGE

Centered card

Fields:

Email

Password

Confirm Password

Register button

Link:
Already have an account?

---

## DASHBOARD PAGE

Page title:
Dashboard

Subtitle:
Overview of your products and warranties

Top section:

5 summary cards

Card 1:
Total Products

Card 2:
Total Asset Value

Card 3:
Active Warranties

Card 4:
Expiring Soon

Card 5:
Expired

Each card contains:

Icon
Value
Description

---

## DASHBOARD CHART SECTION

Row 1:

Products by Category
Bar chart

Warranty Status Distribution
Pie chart

Asset Value by Category
Pie chart

---

## DASHBOARD EXPIRING PRODUCTS

Card title:
Expiring Soon

Table columns:

Product Name

Category

Warranty End Date

Days Left

Status

View Button

---

## PRODUCTS PAGE

Page title:
Products

Top actions bar:

Search input

Category filter

Status filter

Sort dropdown

Add Product button

---

## PRODUCT TABLE

Columns:

Image Thumbnail

Product Name

Category

Price

Purchase Date

Warranty End Date

Days Left

Status Badge

Actions Menu

Actions:

View

Edit

Delete

---

## ADD PRODUCT PAGE

Large form card

Section 1:
Basic Information

Fields:

Product Name

Category Dropdown

Purchase Date

Price

Serial Number

Warranty Months

Notes

Section 2:
Documents

Receipt Upload

Warranty Card Upload

Manual Upload

Section 3:
Buttons

Save Product

Cancel

---

## PRODUCT DETAIL PAGE

Header:

Product Name

Category Badge

Edit Button

Delete Button

---

## PRODUCT OVERVIEW CARD

Display:

Name

Category

Price

Purchase Date

Warranty Months

Warranty End Date

Days Remaining

Serial Number

Warranty Status Badge

---

## DOCUMENTS SECTION

Card title:
Documents

Upload Button

Document table:

Document Name

Document Type

Upload Date

Download Button

Delete Button

---

## MAINTENANCE SECTION

Card title:
Maintenance History

Add Maintenance Button

Maintenance Table:

Date

Description

Cost

Service Provider

Edit

Delete

Below table:

Total Maintenance Cost

---

## ADD MAINTENANCE MODAL

Fields:

Date

Description

Cost

Service Provider

Save Button

Cancel Button

---

## NOTIFICATIONS PAGE

Page title:
Notifications

Top actions:

Mark All Read

Filter:
All
Unread
Read

---

## NOTIFICATION LIST

Each notification card contains:

Icon

Title

Message

Created Date

Read Status

Product Link

Example:

Warranty expires in 14 days

Samsung Odyssey G6 warranty expires on May 10, 2027

Unread badge

---

## SETTINGS PAGE

Page title:
Settings

---

## NOTIFICATION SETTINGS CARD

Enable Email Notifications

Toggle Switch

Description:
Receive email reminders before warranty expiration.

Reminder Thresholds

Checkboxes:

30 Days

14 Days

7 Days

Save Settings Button

---

## MOBILE RESPONSIVE DESIGN

Mobile layout:

Sidebar collapses into hamburger menu.

Dashboard cards become stacked.

Tables become cards.

Forms become single-column.

Maintain all functionality.

---

## COMPONENTS TO GENERATE

Generate complete reusable design system:

Buttons

Inputs

Selects

Textareas

Cards

Tables

Badges

Dropdowns

Pagination

Modals

Tooltips

Sidebar

Navbar

Notification Bell

Empty States

Loading States

Error States

Generate all screens in high-fidelity desktop and mobile versions.

The final result should look like a real SaaS application ready for implementation in React + TypeScript + Tailwind CSS.
