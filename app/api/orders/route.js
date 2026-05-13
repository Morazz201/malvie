import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer, cart, paymentMethod } = body;

    // Server-side calculation of totals to prevent price manipulation
    // Fetch product prices from the database
    const productIds = cart.map(item => item.id);
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds }
      }
    });

    const productMap = dbProducts.reduce((map, product) => {
      map[product.id] = product;
      return map;
    }, {});

    // Recalculate totals and create a secure cart
    let serverSubtotal = 0;
    const secureCart = cart.map(item => {
      const dbProduct = productMap[item.id];
      if (!dbProduct) {
        throw new Error(`Product not found: ${item.name}`);
      }

      const itemTotal = dbProduct.price * item.quantity;
      serverSubtotal += itemTotal;

      return {
        ...item,
        price: dbProduct.price,
        name: dbProduct.name // Use the name from the DB for consistency
      };
    });

    const serverShipping = serverSubtotal > 5000 ? 0 : 500;
    const serverTax = serverSubtotal * 0.05;
    const serverTotal = serverSubtotal + serverShipping + serverTax;

    const totals = {
      subtotal: serverSubtotal,
      shipping: serverShipping,
      tax: serverTax,
      total: serverTotal
    };

    // Find or create customer
    let existingCustomer = await prisma.customer.findUnique({
      where: { email: customer.email },
    });
    if (!existingCustomer) {
      existingCustomer = await prisma.customer.create({
        data: {
          email: customer.email,
          name: customer.fullName,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          postalCode: customer.postalCode,
        },
      });
    } else {
      // Update info if changed
      await prisma.customer.update({
        where: { id: existingCustomer.id },
        data: {
          name: customer.fullName,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          postalCode: customer.postalCode,
        },
      });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        customerId: existingCustomer.id,
        items: JSON.stringify(secureCart),
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax,
        total: totals.total,
        paymentMethod: paymentMethod,
        status: "PENDING",
      },
    });

    // Send email to customer
    const customerEmailHtml = `
      <h1>Thank you for your order, ${customer.fullName}!</h1>
      <p>Order #${order.id.slice(-8)} has been received and is being processed.</p>
      <h2>Order Summary</h2>
      ${cart.map((item) => `<p>${item.name} (x${item.quantity}) - LKR ${(item.price * item.quantity).toLocaleString()}</p>`).join("")}
      ${secureCart.map(item => `<p>${item.name} (x${item.quantity}) - LKR ${(item.price * item.quantity).toLocaleString()}</p>`).join('')}
      <p><strong>Total: LKR ${totals.total.toLocaleString()}</strong></p>
      <p>We'll notify you once your order ships.</p>
      <p>Love,<br/>The Malvie Team</p>
    `;
    await resend.emails.send({
      from: "Malvie <orders@malvie.lk>",
      to: [customer.email],
      subject: `Order Confirmation #${order.id.slice(-8)}`,
      html: customerEmailHtml,
    });

    // Send email to shop admin
    const shopEmailHtml = `
      <h1>New Order Received!</h1>
      <p><strong>Order #${order.id.slice(-8)}</strong></p>
      <p>Customer: ${customer.fullName}<br/>Email: ${customer.email}<br/>Phone: ${customer.phone}<br/>Address: ${customer.address}, ${customer.city}</p>
      <h2>Items</h2>
      ${cart.map((item) => `<p>${item.name} (x${item.quantity}) - LKR ${(item.price * item.quantity).toLocaleString()}</p>`).join("")}
      <p><strong>Total: LKR ${totals.total.toLocaleString()}</strong></p>
      <p><a href="${process.env.NEXTAUTH_URL}/admin/orders">View in Admin Panel</a></p>
    `;
    await resend.emails.send({
      from: "Malvie <notifications@malvie.lk>",
      to: [process.env.ADMIN_EMAIL],
      subject: `New Order #${order.id.slice(-8)}`,
      html: shopEmailHtml,
    });
      ${secureCart.map(item => `<p>${item.name} (x${item.quantity}) - LKR ${(item.price * item.quantity).toLocaleString()}</p>`).join('')}
      <p><strong>Total: LKR ${totals.total.toLocaleString()}</strong></p>
      <p><a href="${process.env.NEXTAUTH_URL}/admin/orders">View in Admin Panel</a></p>
    `;

    // Send emails asynchronously
    Promise.all([
      resend.emails.send({
        from: 'Malvie <orders@malvie.lk>',
        to: [customer.email],
        subject: `Order Confirmation #${order.id.slice(-8)}`,
        html: customerEmailHtml,
      }),
      resend.emails.send({
        from: 'Malvie <notifications@malvie.lk>',
        to: [process.env.ADMIN_EMAIL],
        subject: `New Order #${order.id.slice(-8)}`,
        html: shopEmailHtml,
      })
    ]).catch(error => console.error("Error sending emails:", error));

    return NextResponse.json(
      { success: true, orderId: order.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
