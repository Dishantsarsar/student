export function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
      } else {
        reject(new Error("Razorpay SDK failed to load"));
      }
    };
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
}

export async function createRazorpayOrder(amount, currency = "INR") {
  const response = await fetch("http://localhost:4000/api/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to create order");
  }
  return response.json();
}

export async function processPayment(courseTitle, amount, onSuccess, onError) {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) throw new Error("User not logged in");
    const user = JSON.parse(userStr);

    let order;
    try {
      order = await createRazorpayOrder(amount);
    } catch (orderErr) {
      if (orderErr.message && orderErr.message.includes("Razorpay is not configured")) {
        throw new Error("Payment gateway (Razorpay) not configured. Contact the administrator to set up RAZORPAY_KEY_ID in server/.env");
      }
      if (orderErr.message && orderErr.message.includes("Failed to fetch")) {
        throw new Error("Payment server unreachable. Make sure the backend server is running on port 4000.");
      }
      throw new Error("Payment failed: " + (orderErr.message || "Could not create payment order"));
    }

    const razorpayKey = await getRazorpayKey();
    const Razorpay = await loadRazorpayScript();

    const options = {
      key: razorpayKey,
      amount: order.amount,
      currency: order.currency,
      name: "Solution Adda",
      description: `Purchase: ${courseTitle}`,
      order_id: order.id,
      prefill: {
        name: user.name,
        email: user.email,
      },
      theme: {
        color: "#00f2fe",
      },
      handler: function (response) {
        markCourseAsPurchased(courseTitle, user.email, response);
        onSuccess(response);
      },
      modal: {
        ondismiss: function () {
          if (onError) onError(new Error("Payment cancelled by user"));
        },
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  } catch (err) {
    if (onError) onError(err);
    else console.error("Payment error:", err);
  }
}

async function getRazorpayKey() {
  try {
    const resp = await fetch("http://localhost:4000/api/razorpay-key");
    if (resp.ok) {
      const data = await resp.json();
      if (data.key) return data.key;
    }
  } catch (e) {
    console.warn("Could not fetch Razorpay key");
  }
  throw new Error("Razorpay gateway not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env");
}

export function markCourseAsPurchased(courseTitle, userEmail, paymentResponse) {
  const key = `purchased_courses_${userEmail}`;
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  if (!existing.includes(courseTitle)) {
    existing.push(courseTitle);
    localStorage.setItem(key, JSON.stringify(existing));
  }

  const enrolledKey = `enrolled_courses_${userEmail}`;
  const enrolled = JSON.parse(localStorage.getItem(enrolledKey) || "[]");
  if (!enrolled.includes(courseTitle)) {
    enrolled.push(courseTitle);
    localStorage.setItem(enrolledKey, JSON.stringify(enrolled));
  }

  const globalEnrollmentsStr = localStorage.getItem("global_enrollments");
  const globalEnrollments = globalEnrollmentsStr ? JSON.parse(globalEnrollmentsStr) : {};
  globalEnrollments[courseTitle] = globalEnrollments[courseTitle] || [];
  if (!globalEnrollments[courseTitle].some(email => email.toLowerCase() === userEmail.toLowerCase())) {
    globalEnrollments[courseTitle].push(userEmail);
  }
  localStorage.setItem("global_enrollments", JSON.stringify(globalEnrollments));
}

export function getPurchasedCourses(userEmail) {
  const key = `purchased_courses_${userEmail}`;
  return JSON.parse(localStorage.getItem(key) || "[]");
}

export function isCoursePurchased(courseTitle, userEmail) {
  const purchased = getPurchasedCourses(userEmail);
  return purchased.includes(courseTitle);
}
