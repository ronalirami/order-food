"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/Container";
import { menuItems, kategoriLabel } from "@/data/menuData";
import { useCart } from "@/context/CartContext";

export default function MenuPage() {
  const { addToCart, cart } = useCart();
  const formatYen = (number) => new Intl.NumberFormat("ja-JP").format(number);

  const getQtyInCart = (id) => {
    const item = cart.find((i) => i.id === id);
    return item ? item.qty : 0;
  };

  const groupedMenu = Object.keys(kategoriLabel).map((kat) => ({
    kategori: kat,
    label: kategoriLabel[kat],
    items: menuItems.filter((item) => item.kategori === kat),
  }));

  return (
    <section className="bg-black text-white">
      <Container className="!pt-24 md:!pt-32">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="title">Daftar Menu</h1>
          <p className="subtitle">
            Pilihan hidangan terbaik dari dapur Minangkabau kami — autentik,
            lembut, dan penuh cita rasa.
          </p>
        </motion.div>

        {groupedMenu.map((group, groupIdx) => (
          <motion.div
            key={group.kategori}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: groupIdx * 0.1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-serif text-[#F4EAD0] border-b border-gray-800 pb-3 mb-8">
              {group.label}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {group.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="bg-[#111] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 flex flex-col"
                >
                  <div className="relative w-full h-36 overflow-hidden">
                    <Image
                      src={item.gambar}
                      alt={item.nama}
                      fill
                      className="object-cover hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-[#F4EAD0] mb-1 leading-snug">
                        {item.nama}
                      </h3>
                      <p className="text-gray-500 text-xs line-clamp-2">
                        {item.deskripsi}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[#F4EAD0] font-bold text-sm">
                        ¥{formatYen(item.harga)}
                      </span>

                      <button
                        onClick={() => addToCart(item)}
                        className="relative bg-[#F4EAD0] text-black px-3 py-1 rounded-full text-xs font-semibold hover:bg-white transition"
                      >
                        + Tambah
                        {getQtyInCart(item.id) > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center leading-none">
                            {getQtyInCart(item.id)}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </Container>
    </section>
  );
}
