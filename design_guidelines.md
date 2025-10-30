# Celebrity Admin Panel - Design Guidelines

## Design Approach

**Selected Framework:** Design System Approach - Modern Admin Dashboard Pattern
**Primary Inspiration:** Linear's clean data tables + Notion's form layouts + Stripe Dashboard's efficiency
**Core Principle:** Information clarity and workflow efficiency over decorative elements

---

## Typography System

**Font Stack:**
- Primary: 'Inter' (Google Fonts) - entire interface
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

**Hierarchy:**
- Page Titles: text-3xl font-bold
- Section Headers: text-xl font-semibold
- Card Titles: text-lg font-semibold
- Table Headers: text-sm font-semibold uppercase tracking-wide
- Body Text: text-base font-normal
- Labels: text-sm font-medium
- Helper Text: text-sm font-normal
- Metadata/Stats: text-xs font-medium

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Micro spacing (form elements): p-2, gap-2
- Component padding: p-4, p-6
- Section spacing: mb-8, mb-12
- Page margins: p-8, p-12, p-16

**Grid Structure:**
- Dashboard Container: max-w-7xl mx-auto
- Two-column sidebar layout: Sidebar (w-64 fixed) + Main content (flex-1)
- Form layouts: Two-column grid on desktop (grid-cols-2), single column mobile
- Table: Full-width responsive with horizontal scroll on mobile

---

## Component Library

### 1. Admin Shell Structure

**Sidebar Navigation (Fixed Left):**
- Width: w-64
- Full height: h-screen
- Sections: Logo area (h-16), Navigation links, Bottom metadata
- Navigation items: p-3 with icon + label, rounded-lg hover states
- Active state: Visual indicator with different background treatment

**Main Content Area:**
- Top bar: h-16 with breadcrumbs, search, user profile
- Content padding: p-8 on desktop, p-4 mobile
- Maximum width: max-w-7xl centered

### 2. Dashboard Overview (Landing)

**Stats Cards Row:**
- 4-column grid on desktop (grid-cols-4), 2 on tablet, 1 mobile
- Each card: p-6, rounded-lg, border
- Content: Large number (text-3xl font-bold), label (text-sm), trend indicator

**Celebrity Table:**
- Full-width with rounded borders
- Columns: Image (w-12 h-12 rounded-full), Name, Category, Location, Price Range, Featured (toggle), Actions
- Row height: p-4
- Hover state on rows
- Action buttons: Edit (icon), Delete (icon)
- Pagination: Bottom center with page numbers
- Search bar above table: w-full max-w-md with icon

**Filter Section:**
- Horizontal filters above table
- Category dropdown, Price range dropdown, Featured toggle
- Clear filters button

### 3. Add/Edit Celebrity Form

**Layout:**
- Two-column grid for related fields (grid-cols-2 gap-6)
- Single column for wide fields (bio, achievements)
- Form sections with headers (mb-8 spacing between sections)

**Form Sections:**

**Basic Information:**
- Name (full width on mobile, half width desktop)
- Slug (auto-generated from name, editable)
- Category (dropdown)
- Gender (dropdown)

**Media:**
- Profile Image URL (text input with preview - show rounded image below when URL entered)
- Video URL (text input with helper text about YouTube embed format)

**Details:**
- Bio (full-width textarea, h-32)
- Location (text input)
- Price Range (dropdown)
- Languages (multi-select with tags - shows selected as dismissible chips)
- Event Types (multi-select with checkboxes in a grid-cols-2 layout)

**Achievements (Dynamic Array):**
- List of text inputs
- "+ Add Achievement" button to append new field
- X button to remove each achievement
- Minimum 1 achievement required

**Social Links (Dynamic Array):**
- Platform dropdown (Instagram, YouTube, Twitter, Facebook) + URL input in row
- "+ Add Social Link" button
- Remove button per link

**Settings:**
- Is Featured (large toggle switch with label)

**Form Actions:**
- Bottom of form: Two buttons - "Cancel" (secondary) and "Save Celebrity" (primary)
- Buttons: Full width on mobile, auto width on desktop (float right)

### 4. Delete Confirmation Modal

**Overlay:** Fixed full screen with backdrop
**Modal Card:** max-w-md centered, p-6
- Icon at top (warning icon)
- Title: text-xl font-semibold
- Description: Celebrity name + confirmation text
- Two buttons: "Cancel" and "Delete" (danger variant)

### 5. Image Preview Component

**For Profile Image:**
- When URL provided: Show rounded-lg image below input (max-h-40)
- Placeholder state when empty: Dashed border box with icon and "No image uploaded" text

### 6. Input Components

**Text Input:**
- Border, rounded-lg, p-3
- Label above (text-sm font-medium mb-1)
- Helper text below (text-sm)
- Focus state with border change

**Textarea:**
- Same styling as text input
- Minimum height specified

**Dropdown/Select:**
- Full-width, same height as text input
- Icon indicator on right

**Multi-select Tags:**
- Selected items shown as pills with X button
- Dropdown opens below with checkboxes

**Toggle Switch:**
- Standard height switch
- Label to the right

**Action Buttons:**
- Primary: px-6 py-3, rounded-lg, font-medium
- Secondary: px-6 py-3, rounded-lg, font-medium, border
- Icon buttons (in table): p-2, rounded

---

## Responsive Behavior

**Desktop (lg:):**
- Sidebar visible
- Two-column forms
- Stats in 4 columns
- Table shows all columns

**Tablet (md:):**
- Collapsible sidebar
- Two-column forms for some fields
- Stats in 2 columns
- Table scrolls horizontally

**Mobile:**
- Hidden sidebar (hamburger menu)
- All forms single column
- Stats stacked
- Table shows essential columns only, horizontal scroll

---

## Accessibility Standards

- All form inputs have associated labels (not placeholders as labels)
- Focus states clearly visible on all interactive elements
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for celebrity images
- ARIA labels for icon-only buttons
- Keyboard navigation for modals and dropdowns
- Error states with descriptive messages below inputs

---

## Images

**Profile Images:**
- Celebrity headshots displayed as rounded-full thumbnails (w-12 h-12) in table
- Full profile images in edit form preview (rounded-lg, max-h-40)
- Placeholder icon shown when no image URL provided

**No hero images needed** - this is a utility-focused admin interface prioritizing function over visual marketing.