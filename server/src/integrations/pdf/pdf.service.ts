import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Order, OrderItem, ProductVariant, Address } from '@prisma/client';

type OrderDetails = Order & {
  customer: { fullName: string; email: string };
  shippingAddress: Address;
  orderItems: (OrderItem & { productVariant: ProductVariant })[];
};

@Injectable()
export class PdfService {
  async generateInvoicePdf(orderDetails: OrderDetails): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        font: 'Helvetica',
      });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', reject);

      doc
        .fontSize(20)
        .text('HOA DON BAN HANG', { align: 'center' })
        .fontSize(10)
        .text('Hạt Trường Xuân Ltd - Trung Muoi Chat Luong', { align: 'center' })
        .moveDown(2);

      doc.fontSize(12);
      doc.text(`Ma don hang: ${orderDetails.orderCode}`);
      doc.text(
        `Ngay dat hang: ${new Date(orderDetails.createdAt).toLocaleDateString('vi-VN')}`,
      );
      doc.text(`Khach hang: ${orderDetails.customer.fullName}`);
      doc.text(`Email: ${orderDetails.customer.email}`);
      doc.text(
        `Dia chi giao hang: ${orderDetails.shippingAddress.fullAddress}`,
      );
      doc.moveDown(2);

      const tableTop = doc.y;
      doc.font('Helvetica-Bold');
      doc.text('San pham', 50, tableTop);
      doc.text('So luong', 300, tableTop);
      doc.text('Don gia', 370, tableTop, { width: 90, align: 'right' });
      doc.text('Thanh tien', 460, tableTop, { width: 90, align: 'right' });
      doc.font('Helvetica');

      let i = 0;
      for (const item of orderDetails.orderItems) {
        const y = tableTop + 25 + i * 25;
        doc.text(item.productVariant.name, 50, y);
        doc.text(item.quantity.toString(), 300, y);
        doc.text(
          `${Number(item.priceAtPurchase).toLocaleString('vi-VN')} VND`,
          370,
          y,
          {
            width: 90,
            align: 'right',
          },
        );
        const lineTotal = Number(item.priceAtPurchase) * item.quantity;
        doc.text(`${lineTotal.toLocaleString('vi-VN')} VND`, 460, y, {
          width: 90,
          align: 'right',
        });
        i++;
      }

      doc.moveDown(2);

      const summaryTop = doc.y;
      doc.text('Tam tinh:', 370, summaryTop, { width: 90, align: 'right' });
      doc.text(
        `${Number(orderDetails.subtotalAmount).toLocaleString('vi-VN')} VND`,
        460,
        summaryTop,
        {
          width: 90,
          align: 'right',
        },
      );

      doc.text('Phi van chuyen:', 370, summaryTop + 20, {
        width: 90,
        align: 'right',
      });
      doc.text(
        `${Number(orderDetails.shippingFee).toLocaleString('vi-VN')} VND`,
        460,
        summaryTop + 20,
        {
          width: 90,
          align: 'right',
        },
      );

      doc.font('Helvetica-Bold');
      doc.text('Tong cong:', 370, summaryTop + 40, {
        width: 90,
        align: 'right',
      });
      doc.text(
        `${Number(orderDetails.totalAmount).toLocaleString('vi-VN')} VND`,
        460,
        summaryTop + 40,
        {
          width: 90,
          align: 'right',
        },
      );
      doc.font('Helvetica');

      doc.end();
    });
  }
}
