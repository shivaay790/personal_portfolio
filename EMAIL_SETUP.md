# 📧 Email Setup Guide

## How the Contact Form Works

When someone fills out your contact form with their name, email, and message, here's what happens:

1. **Form Submission**: User submits the contact form
2. **API Call**: Frontend calls `/api/send-contact-email` endpoint
3. **Email Service**: Backend uses Resend to send emails
4. **Two Emails Sent**:
   - **To You**: Notification with contact details
   - **To Them**: Confirmation email with your info

## Setup Steps

### 1. Get Resend API Key
1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Go to API Keys section
4. Create a new API key
5. Copy the API key

### 2. Configure Environment Variables
Create a `.env` file in your project root:

```env
# Email Configuration
RESEND_API_KEY=your-actual-resend-api-key-here

# Update these with your actual domain
FROM_EMAIL=contact@yourdomain.com
REPLY_EMAIL=shivaay@yourdomain.com

# Portfolio URL
PORTFOLIO_URL=https://your-portfolio-url.com
```

### 3. Update Email Templates
Edit `src/api/email-service.js` and update:
- `contact@yourdomain.com` → Your actual domain
- `shivaay@yourdomain.com` → Your actual domain
- `https://your-portfolio-url.com` → Your actual portfolio URL

### 4. Install Dependencies
```bash
npm install
```

## Alternative Email Services

If you prefer not to use Resend, you can use:

### Option A: EmailJS (Client-side)
1. Sign up at [https://www.emailjs.com/](https://www.emailjs.com/)
2. Create email templates
3. Update the `sendEmailWithAlternativeService` function in `email-service.js`

### Option B: Formspree (No backend needed)
1. Sign up at [https://formspree.io/](https://formspree.io/)
2. Create a form endpoint
3. Update the contact form to use Formspree's endpoint

### Option C: Netlify Forms (If deploying to Netlify)
1. Add `name` attributes to form inputs
2. Netlify automatically handles form submissions
3. Configure email notifications in Netlify dashboard

## Testing

1. Start your development server: `npm run dev`
2. Fill out the contact form
3. Check your email for the notification
4. Check the sender's email for the confirmation

## Troubleshooting

- **API Key Issues**: Make sure your Resend API key is correct
- **Domain Issues**: Verify your domain is configured in Resend
- **CORS Issues**: The API endpoint is handled by Vite plugin, so CORS shouldn't be an issue
- **Email Not Received**: Check spam folder and Resend dashboard for delivery status

## Security Notes

- Never commit your `.env` file to version control
- Add `.env` to your `.gitignore` file
- Use environment variables for sensitive data
- Consider rate limiting for the contact form endpoint
