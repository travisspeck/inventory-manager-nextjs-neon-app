"use server";

import { redirect } from "next/navigation";
import { prisma } from "../prisma";
import { getSession } from "../auth/server";
import { revalidatePath } from "next/cache";

export async function deleteProduct(formData: FormData) {
  const { data: session } = await getSession();
  const user = session?.user;
  const userId = user?.id;

  if (!user || typeof userId !== "string") {
    throw new Error("Unauthorized. Please log in again.");
  }

  const id = String(formData.get("id") || "");

  if (!id) {
    throw new Error("Product ID is required for deletion.");
  }

  await prisma.product.deleteMany({
    where: { id: id, userId: user.id },
  });

  revalidatePath("/inventory");
}

export async function parseAddProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const rawSku = String(formData.get("sku") ?? "").trim();
  const sku = rawSku === "" ? null : rawSku;
  const price = String(formData.get("price") ?? "").trim();
  const quantity = parseInt(String(formData.get("quantity") ?? "")) || 0;
  const lowStockAt = parseInt(String(formData.get("lowStockAt") ?? "")) || 0;
    return {
    name,
    sku,
    price,
    quantity,
    lowStockAt,
  };
}

export async function addProductAction(formData: FormData) {
  const { data: session } = await getSession();
  const user = session?.user;
  const userId = user?.id;

  if (!user || typeof userId !== "string") {
    return { error: "User not valid." };
  }

  const input = await parseAddProduct(formData);

  try {
    await prisma.product.create({
      data: {
        userId: userId,
        name: input.name,
        sku: input.sku,
        price: input.price,
        quantity: input.quantity,
        lowStockAt: input.lowStockAt,
      },
    });
  } catch (err) {
    console.log(err);
  }

  redirect(`/inventory`);
}