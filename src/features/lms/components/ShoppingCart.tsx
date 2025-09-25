"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../hooks/useCart";
import styles from "./LMS.module.css";

export const ShoppingCart: React.FC = () => {
  const { 
    items, 
    removeFromCart, 
    clearCart, 
    total, 
    originalTotal, 
    savings 
  } = useCart();

  if (items.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <div className={styles.emptyCartContent}>
          <h2>Your cart is empty</h2>
          <p>Keep shopping to find a course!</p>
          <Link href="/authorized/lms/courses" className={styles.keepShoppingBtn}>
            Keep shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shoppingCart}>
      <div className={styles.cartHeader}>
        <h1>Shopping Cart</h1>
        <span>{items.length} Course{items.length > 1 ? 's' : ''} in Cart</span>
      </div>

      <div className={styles.cartContent}>
        <div className={styles.cartItems}>
          {items.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.courseImage}>
                <Image
                  src={item.course.image_url}
                  alt={item.course.title}
                  fill
                  className={styles.image}
                />
              </div>

              <div className={styles.courseInfo}>
                <h3 className={styles.courseTitle}>
                  <Link href={`/authorized/lms/courses/${item.course.id}`}>
                    {item.course.title}
                  </Link>
                </h3>
                <p className={styles.courseInstructor}>
                  By {item.course.instructor_name}
                </p>
                <div className={styles.courseMeta}>
                  <span>{item.course.rating} ⭐</span>
                  <span>({item.course.rating_count.toLocaleString()} ratings)</span>
                  <span>•</span>
                  <span>{item.course.duration}</span>
                </div>
              </div>

              <div className={styles.courseActions}>
                <button 
                  className={styles.removeBtn}
                  onClick={() => removeFromCart(item.id)}
                  title="Remove from cart"
                >
                  ✕
                </button>
              </div>

              <div className={styles.coursePrice}>
                <span className={styles.currentPrice}>${item.course.price}</span>
                {item.course.original_price && item.course.original_price > item.course.price && (
                  <span className={styles.originalPrice}>${item.course.original_price}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className={styles.cartSummary}>
          <div className={styles.summaryHeader}>
            <h3>Total</h3>
          </div>

          <div className={styles.summaryContent}>
            {savings > 0 && (
              <div className={styles.summaryRow}>
                <span>Original Price:</span>
                <span>${originalTotal}</span>
              </div>
            )}
            
            {savings > 0 && (
              <div className={styles.summaryRow}>
                <span>Discount:</span>
                <span className={styles.savings}>-${savings}</span>
              </div>
            )}

            <div className={styles.summaryTotal}>
              <span>Total:</span>
              <span className={styles.totalPrice}>${total}</span>
            </div>

            {savings > 0 && (
              <div className={styles.savingsNote}>
                You save ${savings}!
              </div>
            )}
          </div>

          <div className={styles.summaryActions}>
            <button className={styles.checkoutBtn}>
              Checkout Now
            </button>
            
            <div className={styles.couponSection}>
              <input 
                type="text" 
                placeholder="Enter Coupon Code"
                className={styles.couponInput}
              />
              <button className={styles.applyBtn}>Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};