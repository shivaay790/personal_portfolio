// Email service for contact form
// This will be used by the Vite plugin to handle email sending

import { Resend } from 'resend';

// Initialize Resend with your API key
// Get your API key from: https://resend.com/api-keys
const resend = new Resend(process.env.RESEND_API_KEY || 'your-resend-api-key-here');

export async function sendContactEmail(formData) {
  try {
    const { name, email, message } = formData;
    
    // Send email to you
    const result = await resend.emails.send({
      from: 'Portfolio Contact <contact@yourdomain.com>', // Update with your domain
      to: ['shivaaydhondiyal23@gmail.com'], // Your email
      subject: `New Contact from ${name} - Portfolio`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #007bff;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; color: #0056b3;">
              <strong>Quick Actions:</strong><br>
              • Reply directly to: <a href="mailto:${email}">${email}</a><br>
              • View portfolio: <a href="https://your-portfolio-url.com">Portfolio</a>
            </p>
          </div>
        </div>
      `,
    });

    // Send confirmation email to the person who contacted you
    await resend.emails.send({
      from: 'Shivaay Dhondiyal <shivaay@yourdomain.com>', // Update with your domain
      to: [email],
      subject: 'Thanks for reaching out! - Shivaay Dhondiyal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thanks for reaching out, ${name}! 👋</h2>
          
          <p>I've received your message and will get back to you as soon as possible.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Your Message:</h3>
            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #28a745;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <p>In the meantime, feel free to:</p>
          <ul>
            <li>Check out my <a href="https://github.com/shivaay790">GitHub</a> for more projects</li>
            <li>Connect with me on <a href="https://www.linkedin.com/in/shivaay-dhondiyal/">LinkedIn</a></li>
            <li>Explore my portfolio for more details about my work</li>
          </ul>
          
          <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; color: #0056b3;">
              <strong>Best regards,</strong><br>
              Shivaay Dhondiyal<br>
              AI/ML & Full-Stack Developer
            </p>
          </div>
        </div>
      `,
    });

    return {
      success: true,
      message: 'Email sent successfully',
      data: result
    };
    
  } catch (error) {
    console.error('Email sending failed:', error);
    return {
      success: false,
      message: 'Failed to send email',
      error: error.message
    };
  }
}

// Alternative: Simple email service using a different provider
export async function sendEmailWithAlternativeService(formData) {
  try {
    const { name, email, message } = formData;
    
    // You can use services like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Nodemailer with Gmail SMTP
    
    // Example with fetch to a service like EmailJS or similar
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'your-service-id',
        template_id: 'your-template-id',
        user_id: 'your-user-id',
        template_params: {
          from_name: name,
          from_email: email,
          message: message,
          to_email: 'shivaaydhondiyal23@gmail.com'
        }
      })
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Email sent successfully'
      };
    } else {
      throw new Error('Email service request failed');
    }
    
  } catch (error) {
    console.error('Alternative email sending failed:', error);
    return {
      success: false,
      message: 'Failed to send email',
      error: error.message
    };
  }
}
