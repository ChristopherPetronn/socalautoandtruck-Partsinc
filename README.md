# SoCal Auto & Truck Parts, Inc. Website

A responsive multi-page website for automotive and truck parts sourcing inquiries.

## Included
- 21 standalone website pages in `public/`
- Original SVG logo, favicon and social image
- Product category browse and parts inquiry forms
- Separate Terms, Privacy and Refund pages
- Express serverless contact API using SMTP/Nodemailer
- Vercel configuration and environment example

## Important content notes
- The product category pages are inquiry paths, not live inventory. No stock levels, prices, part numbers or fitment data are fabricated.
- The company contact details are the owner-supplied details in this project.
- Legal pages are business drafts and must be checked against the actual sales, returns, warranty, payment and privacy practices by the business owner and California counsel before launch.

## Local development
1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and enter valid SMTP settings.
4. Run `npm start`.
5. Open `http://localhost:3000`.

For local static serving, you can also use any static server against `public/`, but contact submissions require the Express API.

## Vercel deployment
- Import the GitHub repository into Vercel.
- Root Directory: project root (the folder containing `package.json`, `server.js`, `vercel.json` and `public/`).
- Framework Preset: Other / Express auto-detection.
- Do not set a custom output directory; static assets are in `public/`.
- Add the SMTP environment variables from `.env.example` in Vercel Project Settings.
- Deploy to Production and test `/api/health` and the contact form.

## Email settings
Required: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`. Optional: `SMTP_REQUIRE_TLS`, `CONTACT_TO`. The default recipient is `contact@socalautoandtruckpartsinc.com`.

The API returns an error if mail settings are missing or the provider does not accept the message. It never reports successful email delivery based only on a form click.

## Launch checklist
- Confirm the public website domain before publishing. The current `sitemap.xml` and `robots.txt` use `socalautoandtruckpartsinc.com` based on the supplied email domain; replace it if the actual website domain is different.
- Confirm that `contact@socalautoandtruckpartsinc.com` is active and monitored.
- Review the Terms, Privacy and Refund pages against actual sales, return, warranty, billing and data-handling practices. These are drafts, not legal advice.
- The company should confirm which product categories, brands, delivery/pickup options and business-account terms it actually offers before adding them as firm claims.

## Testing limits
Static pages, asset paths, local links, JavaScript syntax and configuration JSON were checked in the build environment. npm dependency installation timed out in that environment, so the Express API was syntax-checked but not exercised with a live SMTP account. Real email delivery must be tested after SMTP variables are configured in Vercel.
