export const validateContactForm = (values) => {
  const errors = {};

  if (!values.name || !values.name.trim()) {
    errors.name = "Name is required";
  }

  if (!values.email || !values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Invalid email format";
  }

  if (!values.message || !values.message.trim()) {
    errors.message = "Message is required";
  } else if (values.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  }

  return errors;
};

export const validateAboutQuery = (values) => {
  const errors = {};

  if (!values.subject || !values.subject.trim()) {
    errors.subject = "Subject is required";
  }

  if (!values.details || !values.details.trim()) {
    errors.details = "Details are required";
  } else if (values.details.trim().length < 20) {
    errors.details = "Details must be at least 20 characters";
  }

  return errors;
};
