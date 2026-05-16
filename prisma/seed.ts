import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Editorial placeholder imagery (warm, candle-adjacent) — swap for real
// product photos from the admin once available.
const IMG = {
  amber: [
    "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=1200&q=80",
    "https://images.unsplash.com/photo-1608181831718-c9ffd8728e0a?w=1200&q=80",
  ],
  noir: [
    "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=1200&q=80",
    "https://images.unsplash.com/photo-1596433809252-c9b0f7a92429?w=1200&q=80",
  ],
  fig: [
    "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=1200&q=80",
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&q=80",
  ],
  oud: [
    "https://images.unsplash.com/photo-1599446794254-16ca8acd5a5b?w=1200&q=80",
    "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deae?w=1200&q=80",
  ],
  rose: [
    "https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=1200&q=80",
    "https://images.unsplash.com/photo-1602910344008-22f323cc1817?w=1200&q=80",
  ],
  sea: [
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80",
    "https://images.unsplash.com/photo-1530968033775-2c92736b131e?w=1200&q=80",
  ],
  diffuser: [
    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=80",
  ],
  matches: [
    "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=1200&q=80",
  ],
};

const products = [
  {
    slug: "amber-noir",
    name: "Amber Noir",
    description:
      "A slow, smouldering amber wrapped in soft woods. Poured at the edge of warmth so every note settles before it sets — the signature VASSIA marble forms as it cures.",
    scentNotes: "Amber, Tonka Bean, Cedarwood, Vanilla",
    priceMAD: 220,
    category: "CANDLE",
    images: IMG.amber,
    stock: 18,
    featured: true,
    weightG: 210,
    burnTime: "45+ hours",
  },
  {
    slug: "fig-orchard",
    name: "Fig Orchard",
    description:
      "Green fig leaf and milky sap over sun-warmed bark. Bright at first light, soft and lactonic as it burns down.",
    scentNotes: "Fig Leaf, Coconut Milk, Green Stem, Cedar",
    priceMAD: 195,
    category: "CANDLE",
    images: IMG.fig,
    stock: 24,
    featured: true,
    weightG: 210,
    burnTime: "45+ hours",
  },
  {
    slug: "oud-velour",
    name: "Oud Velour",
    description:
      "Deep, resinous oud smoothed with saffron and a breath of rose. Our most opulent pour — small batch only.",
    scentNotes: "Oud, Saffron, Rose Absolute, Leather",
    priceMAD: 260,
    category: "CANDLE",
    images: IMG.oud,
    stock: 9,
    featured: true,
    weightG: 210,
    burnTime: "45+ hours",
  },
  {
    slug: "rose-de-mai",
    name: "Rose de Mai",
    description:
      "A powdery, true rose lifted with lychee and a whisper of musk. Quiet, romantic, never sweet.",
    scentNotes: "May Rose, Lychee, Peony, White Musk",
    priceMAD: 205,
    category: "CANDLE",
    images: IMG.rose,
    stock: 16,
    featured: false,
    weightG: 210,
    burnTime: "45+ hours",
  },
  {
    slug: "noir-tabac",
    name: "Noir Tabac",
    description:
      "Cured tobacco leaf, dark honey and a curl of smoke. Library light and slow evenings.",
    scentNotes: "Tobacco Leaf, Honey, Hay, Smoked Vanilla",
    priceMAD: 230,
    category: "CANDLE",
    images: IMG.noir,
    stock: 12,
    featured: false,
    weightG: 210,
    burnTime: "45+ hours",
  },
  {
    slug: "sel-marin",
    name: "Sel Marin",
    description:
      "Cool salt air, driftwood and a clean mineral edge. The lightest scent in the house.",
    scentNotes: "Sea Salt, Driftwood, Bergamot, Ambergris",
    priceMAD: 190,
    category: "CANDLE",
    images: IMG.sea,
    stock: 20,
    featured: false,
    weightG: 210,
    burnTime: "45+ hours",
  },
  {
    slug: "amber-noir-diffuser",
    name: "Amber Noir — Reed Diffuser",
    description:
      "Our signature Amber Noir as a long-throw reed diffuser. Eight months of quiet warmth, no flame.",
    scentNotes: "Amber, Tonka Bean, Cedarwood, Vanilla",
    priceMAD: 240,
    category: "DIFFUSER",
    images: IMG.diffuser,
    stock: 14,
    featured: false,
    weightG: 200,
    burnTime: "6–8 months",
  },
  {
    slug: "apothecary-matches",
    name: "Apothecary Matches",
    description:
      "Long, slow-strike matches in a refillable apothecary jar. The proper way to light a soy candle.",
    scentNotes: "—",
    priceMAD: 60,
    category: "ACCESSORY",
    images: IMG.matches,
    stock: 40,
    featured: false,
    weightG: null,
    burnTime: null,
  },
];

async function main() {
  console.log("Seeding VASSIA catalogue…");
  for (const p of products) {
    const { images, ...rest } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...rest, images: JSON.stringify(images) },
      create: { ...rest, images: JSON.stringify(images) },
    });
    console.log("  ✓", p.name);
  }
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
