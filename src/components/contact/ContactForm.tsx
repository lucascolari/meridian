"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import { validateContact } from "@/lib/contact/validate";
import type { ContactInput, ValidationResult } from "@/lib/contact/validate";
import { getSiteSettings } from "@/lib/content";
import styles from "./contact.module.css";

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY_VALUES: ContactInput = { name: "", email: "", message: "" };

export function ContactForm() {
  const [values, setValues] = useState<ContactInput>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ValidationResult["errors"]>({});
  const [status, setStatus] = useState<Status>("idle");

  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const nameErrorId = `${nameId}-error`;
  const emailErrorId = `${emailId}-error`;
  const messageErrorId = `${messageId}-error`;

  const submitting = status === "submitting";

  function handleChange(field: keyof ContactInput, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Limpia cualquier banner de éxito/error previo antes de revalidar.
    setStatus("idle");

    const result = validateContact(values);
    setErrors(result.errors);
    if (!result.ok) {
      return;
    }

    // Sitio estático (GitHub Pages): sin backend, el envío abre el cliente de
    // correo del visitante con el mensaje ya redactado hacia el estudio.
    const { email } = getSiteSettings();
    const subject = encodeURIComponent(`New project inquiry — ${values.name}`);
    const body = encodeURIComponent(
      `${values.message}\n\n— ${values.name} (${values.email})`,
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setValues(EMPTY_VALUES);
    setStatus("success");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor={nameId} className={styles.label}>
          Name
        </label>
        <input
          id={nameId}
          name="name"
          type="text"
          className={styles.input}
          value={values.name}
          onChange={(e) => handleChange("name", e.target.value)}
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={errors.name ? nameErrorId : undefined}
        />
        {errors.name ? (
          <p id={nameErrorId} className={styles.fieldError}>
            {errors.name}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor={emailId} className={styles.label}>
          Email
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          className={styles.input}
          value={values.email}
          onChange={(e) => handleChange("email", e.target.value)}
          aria-invalid={errors.email ? "true" : undefined}
          aria-describedby={errors.email ? emailErrorId : undefined}
        />
        {errors.email ? (
          <p id={emailErrorId} className={styles.fieldError}>
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor={messageId} className={styles.label}>
          Message
        </label>
        <textarea
          id={messageId}
          name="message"
          className={styles.textarea}
          value={values.message}
          onChange={(e) => handleChange("message", e.target.value)}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? messageErrorId : undefined}
        />
        {errors.message ? (
          <p id={messageErrorId} className={styles.fieldError}>
            {errors.message}
          </p>
        ) : null}
      </div>

      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? "Sending..." : "Send message"}
      </button>

      {status === "success" ? (
        <p role="status" className={styles.successMessage}>
          Thanks — we&apos;ll be in touch soon.
        </p>
      ) : null}

      {status === "error" ? (
        <p role="alert" className={styles.errorBanner}>
          Something went wrong. Please try again.
        </p>
      ) : null}
    </form>
  );
}
