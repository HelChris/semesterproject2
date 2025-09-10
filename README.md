# Semester Project 2 - Auction Website

## Project Description

This project is part of my delivery for the Front-End Development studies at Noroff. The goal is to build a fully functional auction website using all the skills we've learnd throughout the studies.

The website allows visitor to register users, users to create auctions, bid on others' listings, and manage their own profile. The application is built with a modular file structure, semantic HTML for proper base structure, tailwind CSS for styling + responsive layout and javascript to handle interaction and functionality.

## Goal

> Build a modern auction website where users can buy and sell items through a credit-based bidding system.

## Features

- Carousel on the front page with latest auctions
- "View more" button to load more listings
- Search for listings in the navbar/on the front page.
- Hero banner with buttons to start bidding and create listing
- Explore category section links users to listings sorted by category containing certain keywords
- Carousel with some listings
- "How it works" section explaining three steps to get started
- Featured Auction of the week section
- Register user CTA section, register now or learn more:
- About page with information about the site
- Footer with quicklinks and newsletter subscription signup
- Users can bid directly from auction cards 
- Clicking a card navigates to a detailed view:
- Item title, description, time left, image gallery
- See current bid, place a bid if logged in
- See bid history with user, amount, and time
- Profile page:
- Username, member since, number of listings, credit balance
- Sort content on profile page by: current bids, users listings, wins
- Edit listing (modal), delete listing (modal/alert)
- Edit profile button
- Create new listing button with modal
- Edit profile page:
- Update avatar, banner and bio
- User updates information, image, (wishlist?) saves changes (and can delete account?)
- Contact page with a validated contact form
- Uses .env for configuration
- Unit testing with Vitest
- E2E testing with Playwright

## User Stories

- A user with a stud.noroff.no email may register
- A registered user may login and logout
- A registered user may update their avatar
- A registered user may view their credit balance
- A registered user may create and edit or delete their listing
- A registered user may add a bid to other users’ listings
- A registered user may view bids made on a listing
- An unregistered user may search through listings

## Tech Stack

- HTML 5
- Javascript (ES6 modules)
- Tailwind 4
- Vite
- Vitest
- Playwright
- ESLint
- Prettier
- Husky
- Netlify (hosting)
- Hotjar (user behavior tracking)

## Prerequisites

- Node.js (v20+)
- npm

## Getting Started

### Installation

```bash
npm install
```

### Running the project

```bash
npm run dev
```

### Running tests

```bash
npm run test
```

## Environment Variables

Create a `.env` file in the root directory:

```bash
API_KEY=your-api-key-here
BASE_URL=https://example.com/api
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

