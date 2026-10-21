import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { OPERATOR } from "@/lib/data";

const EMPTY = ",,,,,,,,,,,,,,,,";
const SEP = ",";

function row(col0: string, ...rest: string[]): string {
  const cells = [col0, ...rest];
  while (cells.length < 17) cells.push("");
  return cells.join(SEP);
}

function fmtNum(n: number): string {
  return n.toLocaleString("ru-RU").replace(/\s/g, " ");
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const order = await Order.findById(id).lean();
    if (!order) {
      return NextResponse.json({ success: false, error: "Buyurtma topilmadi" }, { status: 404 });
    }

    const date = new Date(order.createdAt).toISOString().slice(0, 10);
    const orderId = `d0_${String(order._id).slice(-5)}`;

    const lines: string[] = [];

    lines.push(row("SmaG (KWIT GROUP OOO)"));
    lines.push(row(`Номер накладной: ${orderId}`));
    lines.push(row(`Дата накладной: ${date}`));
    lines.push(row(`Менеджер: Admin`));
    lines.push(row(`Номер телефона: ${OPERATOR.phone}`));
    lines.push(row(`Магазин: ${order.customerName}`));
    lines.push(row(`Номер телефона: ${order.customerPhone}`));
    lines.push(row(`Адрес: ${order.customerAddress || ""}`));
    lines.push(row("Экспедитор: "));
    lines.push(row("Номер телефона: "));
    lines.push(row(`Баланс клиента: 0`));
    lines.push(EMPTY);

    // Table header: №, Товар, (4 empty), Бл, (2 empty), Кол, (2 empty), Цена, (3 empty), Сумма
    lines.push(
      ["№", "Товар", "", "", "", "", "Бл", "", "", "Кол", "", "", "Цена", "", "", "", "Сумма"].join(SEP)
    );

    // Category header
    lines.push(row("Печенье"));

    let totalBl = 0;
    let totalKol = 0;
    let totalSum = 0;

    order.products.forEach(
      (p: { productName: string; quantity: number; price: number }, i: number) => {
        const sum = p.quantity * p.price;
        totalBl += p.quantity;
        totalKol += p.quantity;
        totalSum += sum;

        lines.push(
          [
            String(i + 1),
            p.productName,
            "", "", "", "",
            String(p.quantity),
            "", "",
            String(p.quantity),
            "", "",
            fmtNum(p.price),
            "", "", "",
            fmtNum(sum),
          ].join(SEP)
        );
      }
    );

    // Subtotal
    lines.push(
      [
        "Итого",
        "", "", "", "", "",
        String(totalBl),
        "", "",
        String(totalKol),
        "", "",
        fmtNum(totalSum),
        "", "", "",
        "",
      ].join(SEP)
    );

    // Grand total
    lines.push(
      [
        "Общий итог",
        "", "", "", "", "",
        String(totalBl),
        "", "",
        String(totalKol),
        "", "",
        fmtNum(totalSum),
        "", "", "",
        "",
      ].join(SEP)
    );

    lines.push(row("Примечание: " + (order.notes || "")));
    lines.push(row("Комментарий: "));
    lines.push(EMPTY);

    const bom = "﻿";
    const csv = bom + lines.join("\r\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="nakladnoy_${orderId}_${date}.csv"`,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Xatolik";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
