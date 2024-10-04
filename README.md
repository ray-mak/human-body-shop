# CodeCraft - Custom Booking Solution

CodeCraft is a web development agency specializing in custom solutions for small businesses. This project is a booking system that enables business owners to manage their availability while allowing clients to schedule appointments.

I developed the REST API for availabilities and bookings as well as designed the UI and booking flow for the client facing side.

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- NextJS
- PostgreSQL
- Prisma

## Live Site

[Live site with the integrated booking system.](https://www.thehumanbodyshop.pro/)

## Purpose

This booking app provides service businesses with a fully customizable scheduling solution. Owners can set weekly schedules, special hours, and extended days off.

There's also a very intuitive schedule UI that allows staff members to visualize their weekly schedule. In addition to that, there is also a services section which allows admins to quickly add, edit, or delete services offered by the business.

The client side booking flow is also very intuitive, allowing the user to seamlessly select their provider, service, and appointment date. The interface is fully responsive and includes a dark mode option for enhanced usability.

## The Process

The first step in developing this booking app was creating a front-end interface for admins to submit their availabilities. The form logic and styling was done with React and Tailwind CSS.

Simultaneously, I set up the database and defined models for admins, users, availabilities, appointments, and all other models necessary for the booking flow. I used PostgreSQL as the database and Prisma as the ORM.

Since I was using NextJS, I was able to create server-side actions to handle CRUD operations on availabilities, services and appointments.

After creating the models and back-end logic, I continued working on the front-end UI to create visualizations of the availabilities and services.

I also included an optional integration with Twilio and SendGrid to allow for text message and email notifications for upcoming appointments.

## Problems

Dealing with dates and times are an absolute headache. So instead of reinventing the wheel, I used date-fns. That helped standardize the dates and times, but it was still quite difficult integrating it with the admin schedule and calendar client.

Another hurdle that took quite a bit of time overcoming was showing availabilities based off of the admin's schedule and existing appointments.

I had to spend a lot of time making sure appointments don’t overlap and that availabilities accommodate for the selected service time.

## Lesson Learned

This was the first application that I built for someone else and not myself. I had to be a lot more rigorous when testing different scenarios to make sure appointments and availabilities don't conflict.

With multiple NextJS projects under my belt, I was able to build this application much quicker, with most of the time spent on the date and time logic.
