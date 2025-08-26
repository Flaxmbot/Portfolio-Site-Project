
"use server";

import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export type FormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};

export async function handleContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {

  if (!formData.get("name") && !formData.get("email") && !formData.get("message")) {
    return {
        status: "idle",
        message: null,
        errors: {},
    };
  }

  const validatedFields = formSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      message: "Validation failed. Please check your inputs.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    // Save contact form to Firestore
    await addDoc(collection(db, "contacts"), {
      name: validatedFields.data.name,
      email: validatedFields.data.email,
      message: validatedFields.data.message,
      status: "new",
      createdAt: serverTimestamp(),
    });

    console.log("New contact form submission saved to Firestore");

    return {
      status: "success",
      message: "Your message has been sent successfully!",
      errors: {},
    };
  } catch (error) {
    console.error("Error processing contact form:", error);
    return {
      status: "error",
      message: "An unexpected error occurred. Please try again later.",
      errors: {},
    };
  }
}
