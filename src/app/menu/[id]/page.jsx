import { notFound } from "next/navigation";
import { getMenuById, menuItems } from "@/data/menuData";
import MenuDetailClient from "./MenuDetailClient";

export function generateStaticParams() {
  return menuItems.map((it) => ({ id: String(it.id) }));
}

export default async function MenuItemDetailPage(props) {
  const params = await props.params;
  const item = getMenuById(params.id);
  if (!item) notFound();
  return <MenuDetailClient item={item} />;
}
