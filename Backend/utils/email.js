const {COUNTRIES} =  require('../constants/enums');

const nodemailer = require('nodemailer');
const { decrypt } = require('../plugins/encryptionPlugin');

const mailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 40000,
    
});


async function sendEmail({ to, subject, text, html }) {
    if (!to || !subject || (!text && !html)) {
        throw new Error('Failed to send email: Missing required email fields: to, subject, and either text or html');
    }

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    try {
        const info = await mailTransporter.sendMail(mailOptions);
        console.log(`Email sent successfully: ${info.messageId}`);
    } catch (error) {
        throw new Error(`Failed to send email to ${to}: ${error.message}`);
    }
}

const generateOrderConfirmationEmail = (orderData) => {
  const {
    customerName,
    orderNumber,
    orderDate,
    items, // Array of { product, quantity, price }
    // subtotal,
    // shippingCost,
    // tax,
    total,
    shippingAddress,
    estimatedDelivery,
    slug
  } = orderData;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Order Confirmed!</h1>
                  <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">Thank you for your purchase</p>
                </td>
              </tr>

              <!-- Success Message -->
              <tr>
                <td style="padding: 40px 30px; text-align: center;">
                  <div style="display: inline-block; background-color: #10b981; border-radius: 50%; width: 60px; height: 60px; text-align: center; line-height: 60px; margin-bottom: 20px;">
                    <span style="color: #ffffff; font-size: 30px;">✓</span>
                  </div>
                  <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 24px;">Hi ${customerName},</h2>
                  <p style="margin: 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
            We have received your quotation request successfully. Our team will review the details and get in touch with you shortly for the next steps.
                  </p>
                </td>
              </tr>

              <!-- Order Details -->
              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px; overflow: hidden;">
                    <tr>
                      <td style="padding: 20px;">
                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding-bottom: 10px;">
                              <span style="color: #6b7280; font-size: 14px;">Order Number</span><br>
                              <span style="color: #1f2937; font-size: 16px; font-weight: 600;">#${orderNumber}</span>
                            </td>
                            <td style="padding-bottom: 10px; text-align: right;">
                              <span style="color: #6b7280; font-size: 14px;">Order Date</span><br>
                              <span style="color: #1f2937; font-size: 16px; font-weight: 600;">${orderDate}</span>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="2" style="padding-top: 10px; border-top: 1px solid #e5e7eb;">
                              <span style="color: #6b7280; font-size: 14px;">Estimated Delivery</span><br>
                              <span style="color: #1f2937; font-size: 16px; font-weight: 600;">${estimatedDelivery}</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Order Items -->
              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <h3 style="margin: 0 0 20px 0; color: #1f2937; font-size: 18px; font-weight: 600;">Order Items</h3>
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    ${items.map(item => `
                      <tr>
                        <td style="padding: 15px 0; border-bottom: 1px solid #e5e7eb;">
                          <table role="presentation" style="width: 100%; border-collapse: collapse;">
                            <tr>
                              
                              <td style="padding-left: 15px; vertical-align: top;">
                                <div style="color: #1f2937; font-size: 16px; font-weight: 600; margin-bottom: 5px;">${item.product}</div>
                                <div style="color: #6b7280; font-size: 14px; margin-top: 5px;">Quantity: ${item.quantity}</div>
                              </td>
                              <td style="text-align: right; vertical-align: top;">
                                <div style="color: #1f2937; font-size: 16px; font-weight: 600;">$${item.price}</div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    `).join('')}
                  </table>
                </td>
              </tr>

              <!-- Order Summary -->
              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px; padding: 20px;">
                    <tr>
                      <td style="padding: 15px 20px; color: #1f2937; font-size: 18px; font-weight: 600;">Order Total</td>
                      <td style="padding: 15px 20px; text-align: right; color: #667eea; font-size: 24px; font-weight: 700;">$${total.toFixed(2)}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Shipping Address -->
              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600;">Shipping Address</h3>
                  <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; color: #4b5563; font-size: 15px; line-height: 1.6;">
                    ${shippingAddress.address}<br>
                 
                    ${shippingAddress.city}, ${shippingAddress.zipCode}<br>
                    ${Object.values(COUNTRIES).filter(item=> item.code.trim() === shippingAddress.country.trim()).pop().name }<br>
                    Phone: ${shippingAddress.phone}
                  </div>
                </td>
              </tr>

              <!-- CTA Button -->
              <tr>
                <td style="padding: 0 30px 40px 30px; text-align: center;">
                  <a href="${process.env.CLIENT_URL || 'https://yourstore.com'}/orders" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: 600;">Track Your Order</a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                    Questions? Contact us at <a href="mailto:mark@tankersolutions.co.nz" style="color: #667eea; text-decoration: none;">mark@tankersolutions.co.nz</a>
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    © ${new Date().getFullYear()} Tanker Solution. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

const generateAdminOrderNotificationEmail = (orderData) => {
  const {
    customerName,
    orderNumber,
    orderDate,
    items, // Array of { product, quantity, price }
    total,
    shippingAddress,
    estimatedDelivery,
    customerEmail,
    orderId
  } = orderData;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Received</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">New Quotation Request</h1>
                  <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">Action Required</p>
                </td>
              </tr>

              <!-- Alert Message -->
              <tr>
                <td style="padding: 40px 30px; text-align: center;">
                  <div style="display: inline-block; background-color: #f59e0b; border-radius: 50%; width: 60px; height: 60px; text-align: center; line-height: 60px; margin-bottom: 20px;">
                    <span style="color: #ffffff; font-size: 30px;">🔔</span>
                  </div>
                  <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 24px;">New Order Received</h2>
                  <p style="margin: 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                    A new quotation request has been submitted and requires your attention.
                  </p>
                </td>
              </tr>

              <!-- Order Details -->
              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fef3c7; border-radius: 8px; overflow: hidden; border: 2px solid #f59e0b;">
                    <tr>
                      <td style="padding: 20px;">
                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding-bottom: 10px;">
                              <span style="color: #92400e; font-size: 14px; font-weight: 600;">Order Number</span><br>
                              <span style="color: #1f2937; font-size: 18px; font-weight: 700;">#${orderNumber}</span>
                            </td>
                            <td style="padding-bottom: 10px; text-align: right;">
                              <span style="color: #92400e; font-size: 14px; font-weight: 600;">Order Date</span><br>
                              <span style="color: #1f2937; font-size: 18px; font-weight: 700;">${orderDate}</span>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="2" style="padding-top: 10px; border-top: 2px solid #fbbf24;">
                              <span style="color: #92400e; font-size: 14px; font-weight: 600;">Estimated Delivery</span><br>
                              <span style="color: #1f2937; font-size: 16px; font-weight: 600;">${estimatedDelivery}</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Customer Information -->
              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600;">Customer Information</h3>
                  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px;">
                    <tr>
                      <td style="padding: 20px;">
                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding-bottom: 10px;">
                              <span style="color: #6b7280; font-size: 14px;">Name</span><br>
                              <span style="color: #1f2937; font-size: 16px; font-weight: 600;">${customerName}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 10px;">
                              <span style="color: #6b7280; font-size: 14px;">Email</span><br>
                              <a href="mailto:${customerEmail || 'N/A'}" style="color: #667eea; font-size: 16px; font-weight: 600; text-decoration: none;">${customerEmail || 'N/A'}</a>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span style="color: #6b7280; font-size: 14px;">Phone</span><br>
                              <a href="tel:${shippingAddress.phone}" style="color: #667eea; font-size: 16px; font-weight: 600; text-decoration: none;">${shippingAddress.phone}</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Order Items -->
              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <h3 style="margin: 0 0 20px 0; color: #1f2937; font-size: 18px; font-weight: 600;">Order Items</h3>
                  <table role="presentation" style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                    <tr style="background-color: #f9fafb;">
                      <th style="padding: 12px 15px; text-align: left; color: #6b7280; font-size: 14px; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Product</th>
                      <th style="padding: 12px 15px; text-align: center; color: #6b7280; font-size: 14px; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Quantity</th>
                      <th style="padding: 12px 15px; text-align: right; color: #6b7280; font-size: 14px; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Price</th>
                    </tr>
                    ${items.map((item, index) => `
                      <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f9fafb'};">
                        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 15px; font-weight: 500;">${item.product}</td>
                        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #1f2937; font-size: 15px; font-weight: 600;">${item.quantity}</td>
                        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #1f2937; font-size: 15px; font-weight: 600;">$${item.price}</td>
                      </tr>
                    `).join('')}
                  </table>
                </td>
              </tr>

              <!-- Order Summary -->
              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 8px; padding: 20px; border: 2px solid #f59e0b;">
                    <tr>
                      <td style="padding: 15px 20px; color: #92400e; font-size: 18px; font-weight: 700;">Order Total</td>
                      <td style="padding: 15px 20px; text-align: right; color: #dc2626; font-size: 26px; font-weight: 700;">$${total.toFixed(2)}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Shipping Address -->
              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600;">Shipping Address</h3>
                  <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; color: #4b5563; font-size: 15px; line-height: 1.8;">
                    <strong style="color: #1f2937; text-transform: uppercase;">${customerName}</strong><br>
                    ${shippingAddress.address}<br>
                    ${shippingAddress.city}, ${shippingAddress.zipCode}<br>
                    ${typeof COUNTRIES !== 'undefined' ? Object.values(COUNTRIES).filter(item=> item.code.trim() === shippingAddress.country.trim()).pop()?.name || shippingAddress.country : shippingAddress.country}<br>
                    <strong style="color: #1f2937;">Phone:</strong> ${shippingAddress.phone}
                  </div>
                </td>
              </tr>

              <!-- CTA Buttons -->
              <tr>
                <td style="padding: 0 30px 40px 30px; text-align: center;">
                  <table role="presentation" style="display: inline-block; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 0 10px;">
                        <a href="${process.env.CLIENT_URL || 'https://yourstore.com'}/admin/orders/detail/${orderId}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-size: 16px; font-weight: 600;">View Order Details</a>
                      </td>
                      <td style="padding: 0 10px;">
                        <a href="mailto:${customerEmail || 'customer@email.com'}" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-size: 16px; font-weight: 600;">Contact Customer</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                    This is an automated notification from your order management system.
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    © ${new Date().getFullYear()} Tanker Solution. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

async function sendOrderConfirmationEmail(order) {
  const emailData = {
    customerName: ` ${order.firstName} ${order.lastName}`,
    orderNumber: order.orderNumber,
    orderDate: new Date(order.createdAt).toLocaleDateString('en-NZ', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
}),
    items: order.products.map(item => {
        return {
      product: item.name, 
      quantity: item.quantity,
      price: item.sellingPrice
    }}),
    // subtotal: order.subtotal,
    // shippingCost: order.shippingCost || 0,
    // tax: order.tax || 0,
    total: order.totalPrice,
    shippingAddress: {
      address: order.address.shippingAddress.address,
      city: order.address.shippingAddress.city,
    
      zipCode: order.address.shippingAddress.pincode,
      country: order.address.shippingAddress.country,
      phone: order.phone
    },
    estimatedDelivery: 'Update you soon'
  };

  const htmlContent = generateOrderConfirmationEmail(emailData);

  await sendEmail({
    to: order.email,
    subject: `Order Confirmation - #${order.orderNumber}`,
    html: htmlContent,
    text: `Thank you for your order #${order.orderNumber}. Your order has been confirmed and will be shipped soon.`
  });
  return true
}

async function sendAdminOrderNotificationEmail(order) {
    const encryptedAddress = order.address.shippingAddress.address
    const decreptedAddress = decrypt(encryptedAddress)
  const emailData = {
    customerName: `${order.firstName} ${order.lastName}`,
    customerEmail: order.email,
    orderNumber: order.orderNumber,
    orderDate: new Date(order.createdAt).toLocaleDateString('en-NZ', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    items: order.products.map(item => ({
      product: item.name, 
      quantity: item.quantity,
      price: item.sellingPrice
    })),
    total: order.totalPrice,
    shippingAddress: {
      address: decreptedAddress,
      city: order.address.shippingAddress.city,
      zipCode: order.address.shippingAddress.pincode,
      country: order.address.shippingAddress.country,
      phone: order.phone
    },
    estimatedDelivery: 'Update you soon',
    orderId: order._id
  };

  const htmlContent = generateAdminOrderNotificationEmail(emailData);

  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `🔔 New Order Received - #${order.orderNumber}`,
    html: htmlContent,
    text: `New order received from ${order.firstName} ${order.lastName}. Order #${order.orderNumber} - Total: $${order.totalPrice}. Please review and process.`
  });
  
  return true;
}


module.exports = { sendEmail, mailTransporter, sendOrderConfirmationEmail, generateOrderConfirmationEmail, sendAdminOrderNotificationEmail };
