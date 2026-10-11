# Semester Project 2 - Auction Website

## Project Description

This project is part of my delivery for the Front-End Development studies at Noroff. The goal is to build a fully functional auction website using all the skills we've learned throughout the studies.

The website allows visitors to register, create auctions, bid on other users' listings, and manage their own profile. The application is built with a modular file structure, semantic HTML for the base structure, Tailwind CSS for styling and responsive layout, and JavaScript to handle interaction and functionality.

## Goal

> Build a modern auction website where users can buy and sell items through a credit-based bidding system.

## Features

- "View more" button to load more listings
- Search for listings in the navbar/on the front page.
- Hero banner with buttons to start bidding and create listing
- Explore category section links users to listings sorted by category containing certain keywords
- "How it works" section explaining three steps to get started
- Register user CTA section, register now or learn more:
- About page with information about the site
- Footer with quicklinks 
- Users can bid on listings
- Clicking a View Details navigates to a detailed view:
- Item title, description, time left, image gallery
- See current bid, place a bid if logged in
- See bid history with user, amount, and time
- Profile page:
- Username, credit balance, listing, bio
- Sort content on profile page by: current bids, users listings, wins
- Edit listing (modal), delete listing (modal/alert)
- Edit profile button
- Create new listing modal
- Edit profile page:
- Update avatar, banner and bio
- User updates profile information and images, then saves the changes
- Contact page with a validated contact form


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

- HTML5
- JavaScript (ES6 modules)
- Tailwind CSS v4
- Vite
- Noroff API
- ESLint
- Prettier
- Husky
- lint-staged
- Google Fonts
- Netlify (hosting)

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

### Testing

There is currently no automated test suite configured. The `npm run test` script remains a placeholder and will exit with an error.

## Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_NOROFF_API_KEY=your-noroff-api-key-here
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format supported files with Prettier
