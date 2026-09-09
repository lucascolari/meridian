"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import { validateContact } from "@/lib/contact/validate";
import type { ContactInput, ValidationResult } from "@/lib/contact/validate";
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateContact(values);
    setErrors(result.errors);
    if (!result.ok) {
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as {
        ok: boolean;
        errors?: ValidationResult["errors"];
      };
      if (!response.ok || !data.ok) {
        setErrors(data.errors ?? {});
        setStatus("error");
        return;
      }
      setValues(EMPTY_VALUES);
      setStatus("success");
    } catch {
      setStatus("error");
    }
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
