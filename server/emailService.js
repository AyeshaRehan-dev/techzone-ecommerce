const nodemailer = require('nodemailer');

// Setup transporter with placeholder credentials
// User will provide these to enable live email delivery
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || '', // e.g. ayesha@gmail.com
    pass: process.env.EMAIL_PASS || '', // 16 character App Password
  },
});

const sendWelcomeEmail = async (userEmail, username) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Skipping welcome email: Credentials missing in .env');
    return;
  }

  const mailOptions = {
    from: `"TechZone Shop" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: 'Welcome to TechZone!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #3b82f6;">Welcome to TechZone, ${username}! 📱💻</h2>
        <p>Thank you for joining our community of tech enthusiasts. Your account is now active and ready for your first order.</p>
        <p>Browse our latest gadgets and accessories with our brand new secure checkout.</p>
        <br>
        <p style="color: #666;">Happy Shopping,<br>The TechZone Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to: ${userEmail}`);
  } catch (error) {
    console.error(`Error sending welcome email: ${error.message}`);
  }
};

const sendOrderConfirmation = async (userEmail, orderData) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Skipping order confirmation email: Credentials missing in .env');
    return;
  }

  const itemsHtml = orderData.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.quantity} x $${item.price}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: `"TechZone Orders" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Order Confirmed - #${orderData._id || 'Success'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #10b981;">Your Order is Confirmed! 🎉</h2>
        <p>Hi ${orderData.username}, your order has been successfully placed and is being processed.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="background-color: #f9f9f9;">
            <th style="padding: 10px; text-align: left;">Item</th>
            <th style="padding: 10px; text-align: right;">Price</th>
          </tr>
          ${itemsHtml}
          <tr>
            <td style="padding: 10px; font-weight: bold;">TOTAL:</td>
            <td style="padding: 10px; font-weight: bold; text-align: right; color: #3b82f6;">$${orderData.totalPrice.toFixed(2)}</td>
          </tr>
        </table>

        <div style="margin-top: 30px; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
          <p style="margin: 0; font-weight: bold;">Shipping to:</p>
          <p style="margin: 5px 0; color: #4b5563;">
            ${orderData.shippingAddress.address}<br>
            ${orderData.shippingAddress.city}, ${orderData.shippingAddress.postalCode}<br>
            ${orderData.shippingAddress.country}
          </p>
        </div>

        <p style="margin-top: 20px; color: #666;">You can track your order status in the "My Orders" section of your profile.</p>
        <p>Thank you for shopping at TechZone!</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation sent to: ${userEmail}`);
  } catch (error) {
    console.error(`Error sending order email: ${error.message}`);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmation,
};
