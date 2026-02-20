import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './InvoicePrint.css';

const InvoicePrint = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const invoiceRef = useRef();

  const fetchOrder = useCallback(async () => {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const data = await response.json();
    setOrder(data);
  }, [orderId, user.token]);

  const generatePDF = useCallback(async () => {
    const element = invoiceRef.current;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice-${order._id.substring(0, 8)}.pdf`);

    window.close(); // auto close tab after download
  }, [order]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  useEffect(() => {
    if (order) {
      setTimeout(() => generatePDF(), 500);
    }
  }, [order, generatePDF]);

  if (!order) return <div>Generating Invoice...</div>;

  return (
    <div className="invoice-container" ref={invoiceRef}>
      <div className="invoice-header">
        <div>
          <h2>Erode Marine Aquarium</h2>
          <p>
            1/65, Periya Valasu Naal Rd, <br />
            Muncipal Colony, Veerappanchatram, <br />
            Erode, Tamil Nadu <br />
            GSTIN: 33ABCDE1234F1Z5
          </p>
        </div>

        <div className="invoice-title">
          <h1>INVOICE</h1>
          <p><strong>Invoice No:</strong> {order._id.substring(0, 8)}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <hr />

      <h4>Bill To:</h4>
      <p>
        {(order.shippingAddress && order.shippingAddress.name) || (order.user && order.user.name) || user.name}<br />
        {order.shippingAddress && order.shippingAddress.address}
        {order.shippingAddress && order.shippingAddress.apartment && `, ${order.shippingAddress.apartment}`}<br />
        {order.shippingAddress && order.shippingAddress.city}, {order.shippingAddress && order.shippingAddress.state && `${order.shippingAddress.state}, `} {order.shippingAddress && (order.shippingAddress.postalCode || order.shippingAddress.zip || '')}<br />
        {order.shippingAddress && order.shippingAddress.country}<br />
        Phone: {order.shippingAddress && order.shippingAddress.phone || user.phone || ''}<br />
        Email: {order.shippingAddress && order.shippingAddress.email || (order.user && order.user.email) || user.email || ''}
      </p>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>₹{item.price}</td>
              <td>{item.qty}</td>
              <td>₹{item.price * item.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="invoice-summary">
        <p>Subtotal: ₹{order.itemsPrice}</p>
        <p>Shipping: ₹{order.shippingPrice}</p>
        <br />
        <h3>Total: ₹{order.totalPrice}</h3>
      </div>

      <div className="invoice-footer">
        <p>Thank you for choosing us !</p>
        <div className="signature-line">
          Authorized Signature
        </div>
      </div>
    </div>
  );
};

export default InvoicePrint;
