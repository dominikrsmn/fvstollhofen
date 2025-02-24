# Product Requirement Document (PRD)

## 1. Product Overview

The goal of this project is to develop a modern, user-friendly website for a local football club. The website will serve as the club's digital hub, providing information about teams, membership, sponsorship opportunities, and events. It will also enhance engagement with fans, players, and sponsors by integrating multimedia content such as match videos.

The website will be coded in English, but all user-facing text must be in German to ensure accessibility for the club's community. The platform will be responsive, ensuring an optimal experience across desktop and mobile devices.

Key Objectives:

- Clear navigation & structure: Organize content logically for easy access.
- User-friendly design: Ensure a smooth experience for all visitors.
- Multimedia integration: Embed match videos and other dynamic content.
- Sponsorship promotion: Highlight sponsorship opportunities effectively.
- Scalability: Allow for future expansions, such as additional sports or club activities.

## 2. Tech Stack

- Package Manager: pnpm
- Framework: Next.js
- UI Components: shadcn
- Styling: Tailwind CSS
- CMS: FrontAid CMS
- Swiper: "swiper/react" [Docs](https://swiperjs.com/react)

Content Structure:

- Content is saved in /cms/content.json.
- The Schema for content is saved in /cms/model.json.

## 3. Core Functionalities & Features

### 3.1 Layout

- max-width 1200px mx-auto

#### 3.1.1 Navbar

- flexbox row justify between
- 1st: club logo
- 2nd:
  - right:
    - use mock data for now
    - no game running: next game announcement
      - content format "MM.DD Clubname - OpposingClubName"
    - game running:
      - content format "Clubname GoalsNum:GoalsNum OpposingClubName
      - bottom right:
        - absolutely positioned box slightly out of liveticker box
        - primary background, primary-foreground text
        - content format: "minute'", example: "22'"
    - game interrupted:
      - content format "Clubname GoalsNum:GoalsNum OpposingClubName
      - bottom right:
        - absolutely positioned box slightly out of liveticker box
        - primary background, primary-foreground text
        - content format: "Interruption", example: "22'"
  - left: navigation
    - use shadcn navigation
    - look at navigation structure in cms/model.json
    - navigation points / links (in cms/content.json)

#### 3.1.2 Footer

##### **General Layout**
- Full width with max-width 1200px and auto margins
- Horizontal line at the top (border-t)
- Flexbox layout with space between
- Padding: 2rem 0

##### **Left Section**
- Flex container with items aligned to start
- Content:
  - Club logo (circle)
  - Club name "FV 1920 Stollhofen e.V."
  - Row of social media icons (3 square icons)

##### **Right Section**
- Grid layout with 3 columns
- Data source: `content.json` → `footer.kategorien`
- Each column represents a category from data:
  - Title: Category title from data
  - List of links from category's links array
  - Typography:
    - Category title: `text-foreground font-medium mb-2`
    - Links: `text-muted-foreground hover:text-foreground`
  - Spacing between links: 0.5rem

##### **Football Icon**
- Absolutely positioned
- Top right corner of footer
- Size: ~60px
- Overlaps the top border
- Half above, half below the border

##### **Responsive Behavior**
- **Desktop** (default):
  - Three-column layout for navigation
  - Logo and social icons on left

- **Tablet** (`md`):
  - Two-column layout for navigation
  - Maintain left section layout

- **Mobile** (`sm`):
  - Stack all elements vertically
  - Center-align logo section
  - Single column for navigation categories
  - Maintain football icon position

### 3.2 Homepage

#### 3.2.1 Hero

- The hero will just be a swiper of news.
- It will be the image in full width with ca. an height of 80vh.
- At the bottom left there should be the title of the current news
- primary Text in a primary-foreground box with enough padding
- rotated 10 degrees
- if the title is longer than ca. 2-3 words, split it up into two lines

#### 3.2.2 Next game

- Below the hero should be a box with primary color corners
- use mock data for now
- in the box:
  - top: "Nächstes Spiel"
  - middle:
    - left side: club logo
    - middle:
      - Day in Format "Sonntag, 03.03"
      - Time in Format "15:30 Uhr"
    - right side: opposing club logo
  - bottom right: "weiter spiele" external link

#### 3.2.3 Completed Games

- Badges for filtering the teams "Herren 1", "Herren 2", "Junioren", "Damen", "Alte Herren"
- use mock data for now
- horizontal list of completed games
- completed game:
  - gray corners
  - header: date at the right side in format "3. Februar 2025"
  - content:
    - top side:
      - left: club name
      - right: scored goals
    - divider
    - bottom side:
      - left: opposing club name
      - right: scored goals

#### 3.2.4 Facebook Feed

- Add Facebook Feed with "Mehr" button that links to the Facebook page

#### 3.2.5 Instagram Feed

- Add Instagram Feed with "Mehr" button that links to the Facebook page


### 3.3 Mitgliedschaft Page

#### **General Styling**
- The page follows the predefined max-width (`max-width: 1200px; margin: 0 auto;`).
- Uses **ShadCN UI components** for all interactive elements.
- Typography follows the design system.
- Colors adhere to the corporate design, using predefined tokens for UI consistency.
- **All user-facing text remains in German.**

---

#### **Page Layout**

The page consists of **three main sections**:

1. **Mitglied werden (left column, ~60%)**  
   - Title (`"Mitglied werden"`)  
   - FAQ section with collapsible elements  

2. **Mitgliedschafts-Auswahl (right column, ~40%)**  
   - Membership type selection  
   - `"Weiter"` button  

⬇ **Below (full width)**  
3. **Mitgliedschaft verwalten**  
   - Next payment information  
   - Membership cancellation option  

##### **Grid Structure**
- **Desktop (`md` and larger)**:  
  - `grid grid-cols-2 gap-8` for the top two sections.  
  - Membership management in full width below.  
- **Mobile (`sm` and smaller)**:  
  - `flex flex-col` → Content stacked vertically.  
  - FAQ collapsibles closed by default.  

---

#### **Component Styling (Using ShadCN)**

##### **1. Mitglied werden**
- **Title "Mitglied werden"**  
  - `<h2>` element with `text-2xl font-bold text-foreground`.  
  - Left-aligned.  

- **FAQ Section (Collapsible Elements)**  
  - Uses `<Accordion>` from ShadCN.  
  - **Question Titles**: `text-lg font-medium flex justify-between items-center text-foreground`.  
  - **Content**: `text-sm text-muted-foreground`, visible when expanded.  
  - **Accordion border**: `border border-border rounded-md`.  

##### **2. Mitgliedschafts-Auswahl**
- **Membership Type Cards**  
  - Uses `<Card>` from ShadCN.  
  - `bg-card text-card-foreground border border-border rounded-lg p-4`.  
  - On hover: `hover:bg-muted transition-all`.  
  - Selected state: `border-primary ring-2 ring-primary`.  

- **"Weiter" Button**  
  - Uses `<Button variant="default">` from ShadCN.  
  - `bg-primary text-primary-foreground py-2 px-4 rounded-md w-full`.  
  - On hover: `hover:bg-primary/90`.  
  - On focus: `ring ring-ring`.  

##### **3. Mitgliedschaft verwalten**
- **Next Payment Notice**  
  - `text-sm text-muted-foreground`.  
  - Time remaining highlighted: `text-primary font-medium`.  

- **Cancellation Section**  
  - Uses `<Card>` from ShadCN with `variant="destructive"`.  
  - `bg-destructive/10 border border-destructive text-destructive-foreground p-4 rounded-md flex justify-between items-center`.  
  - **Cancel Button**  
    - Uses `<Button variant="destructive">`.  
    - `bg-destructive text-destructive-foreground py-2 px-4 rounded-md`.  
    - On hover: `hover:bg-destructive/90`.  

---

#### **Responsive Behavior**
- **Mobile (`sm` and smaller)**:  
  - `flex-col` instead of `grid-cols-2` for membership options.  
  - FAQ sections collapsed by default.  
- **Tablet & Desktop (`md` and larger)**:  
  - `grid grid-cols-2 gap-8` layout for main content.  

#### 3.3.1 Modal

- Multiple step modal
- first step, personal data:
  - first name
  - last name
  - date of birth
  - adress
  - PLZ / ort
- second step, contact data:
  - add a plus button to add a contact method
    - when click, show a list of possible contact methods:
      - email (only one)
      - landline phone (only one)
      - mobile phone (multiple)
        - selectable which is primary
- third step IF family membership is selected
  - add a plus button to add family members
    - when click, add a new entry into the list
    - first name, second name, role
      - possible roles:
        - spouse
        - parent
        - children (checkbox for selecting underage)
        - sibling (checkbox for selecting underage)

  - third / fourth sstep:
    - SEPA Lastschrftmandat
    - show mandatsreferenz and gläubiger id and that its a recurring payment
    - full name of account holder
    - IBAN
    - BIC
  - last step:
    - checkbox for correct contact and personal data
    - checkbox for verifying SEPA Lastschriftmandat and read those rules (add a link to pdf file I'm going to add later)
    - checkbox for reading Datenschutz & Persönlichkeitsrechte (add a link to pdf file I'm going to add later)
    - checkbox for "Informationspflicht nach Artikel 13 und 14 DSGVO" (add a link to pdf file I'm going to add later)
    - submit button in primary background and primary-foreground text color

### 3.4 Clubhaus Page

#### **General Styling**
- The page follows the predefined max-width (`max-width: 1200px; margin: 0 auto;`).
- Uses **ShadCN UI components** for all interactive elements.
- Typography follows the design system.
- Colors adhere to the corporate design, using predefined tokens for UI consistency.
- **All user-facing text remains in German.**

---

#### **Page Layout**

The page consists of **three main sections**:

1. **Hero Section**
   - **Left side** → Large image showcasing the venue.  
   - **Right side** →  
     - **Title** `"Deine Eventlocation"`.  
     - **Subtitle** `"Im Herzen Rheinmünsters"`.  
   - **Booking Form**  
     - Positioned underneath the heading but **overlapping the bottom of the image**.  

2. **Amenities Overview**
   - A row of **icons with labels** showing available equipment.  
   - A list of **additional amenities** (kitchen, sound system, TV, WiFi).  
   - A second image below the amenities.  

---

#### **Component Styling (Using ShadCN)**

##### **1. Hero Section**
- **Hero Layout**  
  - Uses **CSS Grid (`grid-cols-2`)** for a **two-column layout**.  
  - On **mobile (`sm`)**, switches to **stacked layout** (`grid-cols-1`).  

- **Left Side: Image**
  - Uses `<Card>` component for a structured look.  
  - `bg-card text-card-foreground border border-border rounded-lg p-4 w-full h-[300px]`.  

- **Right Side: Heading & Subtitle**
  - `"Deine Eventlocation"`  
    - `<h2>` with `text-2xl font-bold text-foreground`.  
    - Positioned at the top right.  
  - `"Im Herzen Rheinmünsters"`  
    - `<p>` with `text-lg text-muted-foreground font-medium`.  

- **Booking Form (Overlapping Image)**
  - Uses `<Card>` from ShadCN with `absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 w-3/4 bg-muted/10 rounded-lg shadow-md p-4`.  
  - Contains:  
    - **"Zweck" Dropdown** (`<Select>`).  
    - **"Von - Bis" Date Range Picker** (`<DateRangePicker>`).  
    - **"Anzahl Gäste" Input** (`<Input type="number">`).  
    - **"Angebot" Button** (`<Button variant="default">`).  

---

##### **2. Amenities Overview**
- **Icons with Labels**
  - Uses `<Card variant="outline">` for each icon.  
  - `w-20 h-20 flex flex-col items-center justify-center bg-card border border-border rounded-lg`.  
  - **Icon**: `text-primary w-8 h-8 mb-2`.  
  - **Label**: `text-sm text-foreground`.  

- **Amenities List**  
  - `<ul>` with `list-disc text-muted-foreground ml-4 text-sm`.  
  - Includes `"Küche"`, `"Musikanlage"`, `"TV"`, `"WLAN"`.  

- **Second Image**
  - Another `<Card>` component below the amenities list.  
  - `bg-card text-card-foreground border border-border rounded-lg p-4 w-full h-[200px]`.  

---

#### **Responsive Behavior**
- **Mobile (`sm` and smaller)**:  
  - **Stacked layout**: Image → Heading → Booking Form → Icons → List → Second Image.  
  - Booking form spans **full width** instead of overlapping the image.  
- **Tablet & Desktop (`md` and larger)**:  
  - **Grid layout** (`grid-cols-2`):  
    - Image on the left, heading on the right.  
    - Booking form **overlaps image at the bottom**.  
  - Icons remain in a **row**, maintaining equal spacing.  

### 3.5 Vorstandschaft page

- heading with "Die Vorstandschaft des FV 1920 Stollhofen e.V."
- badges to filter through functions
- list of "person components"
- data is in /cms/content.json
  - vorstand: list of { "name": string, "funktion": string}
- people component
  - portrait image in 3:4 aspect ratio
  - name of person
  - function of person

### 3.6 chronik page

- heading with Chronik
- timeline in the middle
- events should have a point on the timeline with event details next to it
- events shoud be alternating between on the right side (and left aligned) and on the left side (and right aligned)
- the point on the timeline where the mouse is vertically the nearst, should be made bigger
- if there's an image, show it beneath the html content
- data is in /cms/content.json: chronik is a list of objects
- example object
    {
      "datum": "25. November 1920",
      "inhalt": "<h1>Gründung des Vereins</h1><p>Am 25. November 1920 gründeten 51 Fußballbegeisterte unseren Fußballverein 1920 Stollhofen. Zum ersten Vorstand wurde <strong>Wendelin Köppel</strong> gewählt.</p>"
      "image": "optional, src to image"
    },
example code:
<Timeline>
  <Event date="25. November 1920">
    <h1>HTML Header</h1>
    <p>HTML content</p>
  </Event>
</Timeline>

### 3.7 Vereinsatzung page

- content in cms/content.json: vereinssatzung is a list of objects
- example object: 
    {
      "punkt": "§1",
      "inhalt": "<p>Der am 25.11.1920 gegründete Verein führt den Namen Fußballverein 1920 Stollhofen e.V. Er hat seinen Sitz in Rheinmünster und ist im Vereinsregister des Amtsgerichts Mannheim (Registergericht) eingetragen. Das Geschäftsjahr des Vereins ist das Kalenderjahr. Die Vereinsfarben sind rot / weiß. Der Verein ist Mitglied des Badischen Sportbundes Freiburg e.V. und des Südbadischen Fußballverbandes e.V. mit Sitz in Freiburg...</p>"
    },
- the point should be very very big
- the inhalt is next to it

### 3.8 Mannschaft pages

#### **General Layout**
- Route: `/mannschaft/:kategorie`
- Data source: `content.json` → `mannschaftstypen`
- Max width 1200px with auto margins (following global layout)
- All text in German

#### **Page Structure**

##### **1. Team Images Section**
- Flex container taking full width
- Two possible layouts:
  - **Two images**: Side by side with equal width (50% each)
  - **Single image**: Full width stretch
- Each image container:
  - Aspect ratio maintained
  - Bottom right overlay:
    - White background box
    - Contains "Liga" and "Zusatz" information
    - Padding: 0.5rem
    - Rounded corners

##### **2. Team Information Grid**
- Grid layout with two main sections:
  - Left section (~75%): Team staff/personnel
  - Right section (~25%): Location and training times

##### **Left Section: Team Staff**
- Grid of person components (3x2)
- Each person component: (already developed)
  - Portrait image 
  - Name below image
  - Function/role below name
  - Gap between components: 1rem
- Data from `verantwortlich` array in content

##### **Right Section: Information**
- Two cards stacked vertically:

###### **Location Card ("Spiel- & Trainingsort")**
- Uses data from `ort` object
- Title: "Spiel- & Trainingsort"
- Content:
  - Multiple locations separated by divider
  - Each location name from `ort.name`
  - If `bemerkung` exists, show below location

###### **Training Times Card**
- Uses data from `termine` object
- Shows training schedule:
  - Days from `termine.tage`
  - Time from `termine.uhrzeit`
  - Format: "19:00 - 20:30"
- Background: white
- Border: light gray
- Rounded corners

#### **Responsive Behavior**
- **Desktop**:
  - Two-column layout for images (when applicable)
  - 3x2 grid for person components
  - Side-by-side layout for location and training info

- **Tablet** (`md`):
  - Stack images vertically if two present
  - 2x3 grid for person components
  - Maintain side-by-side info cards

- **Mobile** (`sm`):
  - Single column layout
  - Stack all components vertically
  - Person components in 1x6 grid
  - Full-width info cards 

### 3.9 Partner page

#### **General Layout**
- Route: `/partner`
- Data source: `content.json` → `partner`
- Max width 1200px with auto margins (following global layout)
- All text in German

#### **Page Structure**

##### **1. Header Section**
- Small text above title: "GÖNNER"
- Main title: "Unsere Partner"
- Both left-aligned
- Typography:
  - "GÖNNER": `text-sm text-muted-foreground uppercase tracking-wider`
  - "Unsere Partner": `text-4xl font-bold text-foreground mb-8`

##### **2. Partner Grid**
- Grid layout: 3 columns by 3 rows
- Gap between items: 1.5rem (gap-6)
- Each grid item:
  - Aspect ratio: 16/9
  - Background: white
  - Border: 1px solid border color
  - Rounded corners (rounded-md)
  - Red accent line at top (h-1 bg-primary at top of card)

##### **Partner Logo Cards**
- First 8 slots:
  - Center-aligned logo images
  - Padding: 1.5rem
  - Hover effect:
    - Slight scale increase (1.02)
    - Subtle shadow
    - Smooth transition
  - Clickable - links to partner website

##### **"Sponsor werden" Card**
- Last slot (bottom right)
- Background: primary color
- Text: "Sponsor werden" in white
- Center-aligned text
- Same dimensions as partner cards
- Hover effect:
  - Slight darkening of background
  - Cursor: pointer
- Links to sponsorship information/contact

#### **Responsive Behavior**
- **Desktop** (default):
  - 3x3 grid
  - Cards maintain 16/9 aspect ratio

- **Tablet** (`md`):
  - 2x5 grid layout
  - "Sponsor werden" card spans full width at bottom

- **Mobile** (`sm`):
  - Single column layout
  - Stack all cards vertically
  - Maintain aspect ratio
  - Reduced padding in cards 

### 3.10 Partner Werden page

#### **General Layout**
- Route: `/partner/partner-werden`
- Max width 1200px with auto margins (following global layout)
- Two-column layout with text content and image
- All text in German

#### **Page Structure**

##### **1. Header Section**
- Small text above title: "GÖNNER"
- Main title: "Partner werden"
- Both left-aligned
- Typography:
  - "GÖNNER": `text-sm text-muted-foreground uppercase tracking-wider`
  - "Partner werden": `text-4xl font-bold text-foreground mb-6`

##### **2. Content Layout**
- Two-column grid:
  - Left column (~60%): Text content
  - Right column (~40%): Image

##### **Left Column: Content**
- Three text paragraphs:
  1. Introduction paragraph about financing through partnerships
  2. Vision and youth development paragraph
  3. Call-to-action paragraph about supporting tradition
- Typography:
  - Paragraphs: `text-muted-foreground leading-relaxed mb-6`

##### **Sponsoring Options Section**
- Title: "Sponsoring"
- Grid layout: 3 columns by 3 rows
- Gap between items: 1rem (gap-4)

###### **Option Cards**
- Eight sponsoring options plus action button:
  1. "Abteilungssponsoring" (pre-selected)
  2. "Teamsponsoring"
  3. "Bandenwerbung"
  4. "Internetwerbung"
  5. "Lautsprecherwerbung"
  6. "Ballspenden"
  7. "Sonstiges"
  8. "Eventsponsoring"
  9. "Weiter" button (primary color)

- Card styling:
  - Border: 1px solid border color
  - Rounded corners (rounded-md)
  - Padding: 1rem
  - Radio button on left
  - Option text center-aligned
  - Selected state:
    - Primary color border
    - Slightly darker background
  - Hover effect:
    - Slight background color change
    - Cursor: pointer

##### **Right Column: Image**
- Large image container
- Aspect ratio: 4/3
- Border radius to match cards
- Object-fit: cover

#### **Responsive Behavior**
- **Desktop** (default):
  - Two-column layout
  - 3x3 grid for sponsoring options

- **Tablet** (`md`):
  - Stack content and image
  - Image below text content
  - 2x4 grid for options
  - "Weiter" button full width

- **Mobile** (`sm`):
  - Single column layout
  - Stack all elements vertically
  - Options in single column
  - Increased spacing between elements
  - Full-width buttons and cards 

### 3.11 Aktuelles Detail page

#### **General Layout**
- Route: `/aktuelles/:id`
- Data source: `content.json` → `aktuelles`
- Max width 1200px with auto margins (following global layout)
- Single column layout
- All text in German

#### **Page Structure**

##### **1. Hero Image**
- Full-width image container
- Height: 50vh
- Image styling:
  - `object-fit: cover`
  - `object-position: center`
- No padding/margin to container edges

##### **2. Content Section**
- Padding top: 2rem
- Container width: 800px (`max-w-[800px] mx-auto`)

###### **Article Header**
- Date: 
  - Format: "DD. Month YYYY"
  - Typography: `text-sm text-muted-foreground mb-2`
- Title:
  - Typography: `text-4xl font-bold text-foreground mb-6`

###### **Article Content**
- Rich text content from CMS
- Typography:
  - Paragraphs: `text-muted-foreground leading-relaxed mb-4`
  - Headers:
    - h1: `text-3xl font-bold mb-4`
    - h2: `text-2xl font-bold mb-3`
    - h3: `text-xl font-bold mb-2`
  - Lists:
    - Unordered: `list-disc ml-4 mb-4`
    - Ordered: `list-decimal ml-4 mb-4`
  - Links:
    - Color: primary
    - Underline on hover
- Images within content:
  - Full width of content container
  - Rounded corners
  - Margin: 2rem 0

#### **Responsive Behavior**
- **Desktop** (default):
  - Content width: 800px
  - Large hero image

- **Tablet** (`md`):
  - Content width: 90% of viewport
  - Maintain hero image height

- **Mobile** (`sm`):
  - Content width: 95% of viewport
  - Reduced hero image height (40vh)
  - Increased spacing between elements
  - Smaller typography scale 