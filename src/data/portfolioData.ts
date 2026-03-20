export type SectionImage = {
  src: string
  caption?: string
  stage?: string
}

export type CollectionSection = {
  id: string
  title: string
  description: string
  outcome: string
  pills: string[]
  images: SectionImage[]
}

export type PortfolioCategory = {
  id: string
  label: string
  subtitle: string
  description: string
  previewImages: string[]  // 3 images shown on home page
  sections: CollectionSection[]
}

export const categories: PortfolioCategory[] = [
  {
    id: 'resort',
    label: 'Resort & Activewear',
    subtitle: "RTW women's resort and activewear collections",
    description:
      'Trend-led resort and activewear capsules developed for global retail — blending wearable silhouettes with elevated fabrications.',
    previewImages: [
      '/assets/resort/stephanie-gottlieb/969c394b624e05384f21c85fb925ab57.png',
      '/assets/resort/mimi-yoga/602e863833f8e3d31bfba9327396ba96.jpg',
      '/assets/resort/mercedes-salazar/23733468ed63eb66ff075c4c69b13429.jpg',
    ],
    sections: [
      {
        id: 'stephanie-gottlieb',
        title: 'Stephanie Gottlieb Collab',
        description:
          'Resort capsule developed in collaboration with Stephanie Gottlieb — elevated linen and crinkle silhouettes designed to complement her jewelry aesthetic. Directed from moodboard through final tech packs and sample approval.',
        outcome: 'Capsule delivered on time for the collaboration campaign.',
        pills: ['Direction', 'Moodboard', 'Tech Packs', 'Sampling', 'Final'],
        images: [
          { src: '/assets/resort/stephanie-gottlieb/26c30cc032dd7e39a068bf3f41da0794.png', caption: 'Campaign direction', stage: 'Direction' },
          { src: '/assets/resort/stephanie-gottlieb/2785449782da609e344a8dbbe5aed660.png', caption: 'Moodboard references', stage: 'Moodboard' },
          { src: '/assets/resort/stephanie-gottlieb/969c394b624e05384f21c85fb925ab57.png', caption: 'Final collection', stage: 'Final' },
          { src: '/assets/resort/stephanie-gottlieb/d95dcf602e3c35b268ac4ac6a4af6815.png', caption: 'Campaign imagery', stage: 'Final' },
        ],
      },
      {
        id: 'mercedes-salazar',
        title: 'Mercedes Salazar Collab',
        description:
          'Resort pieces developed alongside Mercedes Salazar — vibrant prints and artisan-led construction to complement her accessories line. Wearable silhouettes built for layering and movement.',
        outcome: 'Collab delivered for joint campaign across both brand audiences.',
        pills: ['Concept', 'Print Dev', 'Sampling', 'Final'],
        images: [
          { src: '/assets/resort/mercedes-salazar/19ba3a8c8e816de42821b40cbb102ddd.png', caption: 'Print development', stage: 'Print Dev' },
          { src: '/assets/resort/mercedes-salazar/23733468ed63eb66ff075c4c69b13429.jpg', caption: 'Final collection pieces', stage: 'Final' },
          { src: '/assets/resort/mercedes-salazar/41ab116ed17aae094be8afa5e682e7f3.png', caption: 'Collab campaign', stage: 'Final' },
          { src: '/assets/resort/mercedes-salazar/a63770d027be55eab13804f430209b89.png', caption: 'Resort styling', stage: 'Final' },
        ],
      },
      {
        id: 'mimi-yoga',
        title: 'Mimi Yoga — Activewear',
        description:
          "Activewear capsule developed in collaboration with Mimi Yoga — high-performance fabrications with a resort edge. Designed to transition from studio to beach, blending function with Pitusa's signature aesthetic.",
        outcome: "Activewear line expanded Pitusa's category reach into performance-resort.",
        pills: ['Moodboard', 'Activewear Dev', 'Sampling', 'Final'],
        images: [
          { src: '/assets/resort/mimi-yoga/0a4b03b2db58f5e997daa61bdb5086ee.jpg', caption: 'Activewear moodboard', stage: 'Moodboard' },
          { src: '/assets/resort/mimi-yoga/602e863833f8e3d31bfba9327396ba96.jpg', caption: 'Final activewear pieces', stage: 'Final' },
          { src: '/assets/resort/mimi-yoga/96c4a023ae7901d06c76809d5da27120.jpg', caption: 'Campaign imagery', stage: 'Final' },
          { src: '/assets/resort/mimi-yoga/7c31c1590fd9e5fc190d0b4a048c3273.jpg', caption: 'Resort-activewear styling', stage: 'Final' },
          { src: '/assets/resort/mimi-yoga/a9e9aa310bb6279902cb737ec2a90d66.jpg', caption: 'Color story', stage: 'Development' },
        ],
      },
      {
        id: 'private-label',
        title: 'Private Label RTW',
        description:
          'Private label resort development — woven separates, elevated fabrications, and versatile silhouettes designed for global retail distribution.',
        outcome: 'Full private label collection delivered across multiple colorways.',
        pills: ['Concept', 'Tech Packs', 'Vendor Mgmt', 'Sampling', 'Final'],
        images: [
          { src: '/assets/resort/private-label/069bc6d3f9f031fb7df089358aec7774.jpg', caption: 'Collection overview', stage: 'Final' },
          { src: '/assets/resort/private-label/143456aeacdf613efa7590895513a35d.jpg', caption: 'Technical sampling', stage: 'Sampling' },
          { src: '/assets/resort/private-label/51c27027af62d60255ec3d09c0dfc1c5.jpg', caption: 'Resort styling', stage: 'Final' },
          { src: '/assets/resort/private-label/8aa9ba719683c9f2ce137b1e777bba79.jpg', caption: 'Final pieces', stage: 'Final' },
        ],
      },
      {
        id: 'hpset',
        title: 'HPSET Collection',
        description:
          'Resort collection developed for HPSET — clean silhouettes and elevated fabrications with a focus on versatility across beach and day-wear contexts.',
        outcome: 'Collection delivered and launched across the season.',
        pills: ['Direction', 'Sampling', 'Final'],
        images: [
          { src: '/assets/resort/hpset/32c254d095dd794921e3135df89d9f1d.jpg', caption: 'Collection direction', stage: 'Direction' },
          { src: '/assets/resort/hpset/3337c2e0f08696f92f1f393344c1dc53.jpg', caption: 'Resort pieces', stage: 'Final' },
          { src: '/assets/resort/hpset/39de15711a795e4f3f94e728762f106d.jpg', caption: 'Final collection', stage: 'Final' },
        ],
      },
      {
        id: 'ephyra',
        title: 'Ephyra',
        description:
          'Resort and swimwear capsule for Ephyra — feminine silhouettes, elevated fabrications, and a refined color palette designed for the contemporary resort customer.',
        outcome: 'Full capsule delivered and presented to buyers.',
        pills: ['Concept', 'Sampling', 'Final'],
        images: [
          { src: '/assets/resort/ephyra/155d455ff011477afccb0f20c37c9d31.jpg', caption: 'Campaign imagery', stage: 'Final' },
          { src: '/assets/resort/ephyra/2aaef0113d1bafb49e814f1f5cf12314.png', caption: 'Collection overview', stage: 'Final' },
          { src: '/assets/resort/ephyra/407cb1a11b5321d719ce4170acdd068d.png', caption: 'Resort styling', stage: 'Final' },
          { src: '/assets/resort/ephyra/47942a52e810088e1ae5e7d725456eb3.png', caption: 'Final pieces', stage: 'Final' },
        ],
      },
      {
        id: 'ariel',
        title: 'Ariel',
        description:
          'Resort capsule developed for Ariel — playful silhouettes and vibrant fabrications aligned with a coastal, joyful brand identity.',
        outcome: 'Collection delivered for seasonal launch.',
        pills: ['Concept', 'Sampling', 'Final'],
        images: [
          { src: '/assets/resort/ariel/3649f93c158e445a9f525942c02d49f4.jpg', caption: 'Collection direction', stage: 'Direction' },
          { src: '/assets/resort/ariel/824dc75060c059e33e72252363fc7274.jpg', caption: 'Resort styling', stage: 'Final' },
          { src: '/assets/resort/ariel/a55fe299cc0718c725c41a57e607b6e3.jpg', caption: 'Final collection', stage: 'Final' },
        ],
      },
    ],
  },

  {
    id: 'cutsew',
    label: 'Cut & Sew Knits',
    subtitle: 'RTW — cut & sew knits, crochet, and soft wovens',
    description:
      'Artisan-led cut & sew and crochet capsules rooted in craft — hand-crochet detailing, patchwork construction, and fabric innovation at scale.',
    previewImages: [
      '/assets/cutsew/crochet-patchwork/0445c4f9e362383a539751dd83a677de.png',
      '/assets/cutsew/vogue-mexico/068e4e0d4268c7a00ec3f0c3acf58faa.jpg',
      '/assets/cutsew/basics-intimates/18b087c23b1f433f451bc83c073765f7.png',
    ],
    sections: [
      {
        id: 'crochet-patchwork',
        title: 'The Crochet Patchwork Collection',
        description:
          "Inspired by Brazilian crochet traditions and Miami's vibrant energy, the collection featured playful motifs — crabs, seashells, evil eye — across versatile separates. The standout Mini Dress became a top-selling signature style, demonstrating the ability to translate trend-driven design into commercially successful, customer-beloved pieces.",
        outcome: '↑ Viral bestseller — sold out multiple times. The Mini Dress became a permanent signature style in the lineup.',
        pills: ['Moodboard', 'Sketches', 'Sampling', 'Final', 'Editorial'],
        images: [
          { src: '/assets/cutsew/crochet-patchwork/0445c4f9e362383a539751dd83a677de.png', caption: 'Moodboard — Brazilian crochet references', stage: 'Moodboard' },
          { src: '/assets/cutsew/crochet-patchwork/0fab02cb96862ddfd2a8b6ad18e02e94.png', caption: 'Motif explorations — crabs, seashells, evil eye', stage: 'Sketches' },
          { src: '/assets/cutsew/crochet-patchwork/11b16df4509abd84417403d5f5d3a3cf.png', caption: 'Sample development', stage: 'Sampling' },
          { src: '/assets/cutsew/crochet-patchwork/236cd7632311ca4adb6a4fa396b152d0.png', caption: 'Final collection', stage: 'Final' },
          { src: '/assets/cutsew/crochet-patchwork/30de33657a7c66c08055c087e526bdb6.png', caption: 'Editorial shoot', stage: 'Editorial' },
        ],
      },
      {
        id: 'chunky-knits',
        title: "AW'23 Chunky Knits Capsule",
        description:
          "A concept-led knitwear capsule blending chunky knit aesthetics with Pitusa's core DNA of comfort, wearability, and color. Bold stitch work, playful pattern blocking, and relaxed silhouettes — translating seasonal knit trends into cozy, lifestyle-driven designs.",
        outcome: "Full AW'23 capsule delivered — best-selling garments across multiple colorways.",
        pills: ['Moodboard', 'Yarn Dev', 'Sampling', 'Final'],
        images: [
          { src: '/assets/cutsew/chunky-knits/176e79aa3fab0cc597ef2e9f1364c846.png', caption: 'Knit development', stage: 'Development' },
          { src: '/assets/cutsew/chunky-knits/19aaab41c05e4a41db92b04190217d6e.png', caption: 'Sample review', stage: 'Sampling' },
          { src: '/assets/cutsew/chunky-knits/27438890ae4835d207886c8a513e56dd.png', caption: 'Final collection', stage: 'Final' },
          { src: '/assets/cutsew/chunky-knits/441920af7331110ba80f23296f382d3b.png', caption: 'Campaign imagery', stage: 'Final' },
        ],
      },
      {
        id: 'vogue-mexico',
        title: 'Resort 2025 — Miami Swim Week',
        description:
          "As Head of Design at Pitusa, I led the creative direction for Resort 2025 presented at Miami Swim Week — in collaboration with Spanish luxury shoe brand Castañer, styled by Irma Martinez. Signature Inca burnout sarongs, crochet flowers, pukka shell embellishments, and the show's standout two-piece crochet set. Featured in Vogue Mexico.",
        outcome: "↑ Featured in Vogue Mexico — Espacio Vogue Mexico editorial shot in Mallorca. Presented at Miami Swim Week 2025.",
        pills: ['Direction', 'Collab', 'Runway', 'Vogue Mexico'],
        images: [
          { src: '/assets/cutsew/vogue-mexico/068e4e0d4268c7a00ec3f0c3acf58faa.jpg', caption: 'Creative direction — elevated resort concept', stage: 'Direction' },
          { src: '/assets/cutsew/vogue-mexico/15a9a1e25b67ee0d40bae4f0acbe3338.jpg', caption: 'Pitusa × Castañer — Miami Swim Week runway', stage: 'Runway' },
          { src: '/assets/cutsew/vogue-mexico/281dc4924fd7f0b36d8f06f666572447.jpg', caption: 'Espacio Vogue Mexico — shot in Mallorca', stage: 'Vogue Mexico' },
          { src: '/assets/cutsew/vogue-mexico/30b9b49b31811c5837298c789439b866.jpg', caption: 'Editorial campaign imagery', stage: 'Vogue Mexico' },
          { src: '/assets/cutsew/vogue-mexico/1709cf6f494a8b8f82e04606542ed1cb.jpg', caption: 'Collection overview', stage: 'Runway' },
        ],
      },
      {
        id: 'basics-intimates',
        title: 'Basics | Intimates & Loungewear',
        description:
          'Originally conceptualized as a single limited drop, this collection quickly evolved into a multi-drop exclusive category within Pitusa. Designed to complement the signature beachwear — layered with sheer crochet or worn standalone. Soft jersey, rib 2×1, French Terry in apricot crush, lemon yellow, lime green, and Barbie pink.',
        outcome: '↑ Fan favorite: over 300K in sales for a single set. Expanded into a foundational BASICS branch spanning intimates, lounge, and everyday essentials — leading to private-label collaborations.',
        pills: ['Concept', 'Color Story', 'Tech Pack', 'Launch'],
        images: [
          { src: '/assets/cutsew/basics-intimates/18b087c23b1f433f451bc83c073765f7.png', caption: 'Color story — apricot crush, lemon yellow, lime green, barbie pink', stage: 'Color Story' },
          { src: '/assets/cutsew/basics-intimates/1ca8dffbcf7a0347a074c1c68b15537d.jpg', caption: 'Fabric development — jersey 40/1, rib 2×1, French Terry', stage: 'Development' },
          { src: '/assets/cutsew/basics-intimates/46bd632ad9a51338cf864743c899a664.png', caption: 'Ecommerce colorwall — full collection launch', stage: 'Launch' },
          { src: '/assets/cutsew/basics-intimates/5956499811043bc82837e2c96076e510.png', caption: 'Campaign imagery', stage: 'Final' },
        ],
      },
      {
        id: 'silky-handloom',
        title: 'Silky & Handloom',
        description:
          'Silky wovens and handloom fabrics — fluid drape, artisan-woven textures, and elevated construction. Developed across global vendors to balance handcraft with scalable production.',
        outcome: 'Full woven collection delivered across multiple colorways and markets.',
        pills: ['Fabric Dev', 'Sampling', 'Final'],
        images: [
          { src: '/assets/cutsew/silky-handloom/14e3b37be9f5c9cbece9e4264038af1a.jpg', caption: 'Fabric development', stage: 'Fabric Dev' },
          { src: '/assets/cutsew/silky-handloom/22cccaf2890aa6521b04e070bbd3e1f0.jpg', caption: 'Sample review', stage: 'Sampling' },
          { src: '/assets/cutsew/silky-handloom/2b53f06e7b375d9096d652f8b6694b6e.jpg', caption: 'Final collection', stage: 'Final' },
          { src: '/assets/cutsew/silky-handloom/317eebb52184458b2c4cd6a0da0599e7.jpg', caption: 'Campaign imagery', stage: 'Final' },
        ],
      },
    ],
  },

  {
    id: 'bridal',
    label: 'Bridal & Eveningwear',
    subtitle: 'Custom bespoke bridal and evening collections',
    description:
      'Bespoke evening and bridal looks built from client concept to final fitting — luxe fabrication, intricate construction, and custom embellishment.',
    previewImages: [
      '/assets/bridal/resort-bride/1376b5b9dfa2bdf90ff056336a096f79.jpg',
      '/assets/bridal/night-time/108a4df01e4010d4e4523ed409c659cf.jpg',
      '/assets/bridal/butterfly-bridal/096916b4561d0ddd5814038466d1e234.jpg',
    ],
    sections: [
      {
        id: 'galia-lahav',
        title: 'Galia Lahav',
        description:
          "Bridal work inspired by and developed alongside Galia Lahav's signature aesthetic — structured corsetry, dramatic silhouettes, and intricate embellishment. Each piece built with couture-level construction.",
        outcome: 'Custom pieces delivered for private clients and editorial.',
        pills: ['Consultation', 'Design', 'Construction', 'Final Fitting'],
        images: [
          { src: '/assets/bridal/galia-lahav/00a2ed772225f0f593ffe8c152ae60f5.png', caption: 'Bridal design', stage: 'Design' },
          { src: '/assets/bridal/galia-lahav/3ee53bb95604b6742eeb683178465210.png', caption: 'Construction detail', stage: 'Construction' },
          { src: '/assets/bridal/galia-lahav/a4da3dfb4df4e6541c2e631191a7fb8c.png', caption: 'Final piece', stage: 'Final Fitting' },
          { src: '/assets/bridal/galia-lahav/c39c3dbca77fa735869a63c1be060525.png', caption: 'Campaign imagery', stage: 'Final Fitting' },
        ],
      },
      {
        id: 'resort-bride',
        title: 'Resort Bride',
        description:
          'Bridal collection designed for the destination wedding market — feminine silhouettes, lightweight fabrications, and a sense of effortless elegance appropriate for beach and coastal ceremonies.',
        outcome: 'Full resort bridal line delivered for the season.',
        pills: ['Concept', 'Sketch', 'Sampling', 'Final'],
        images: [
          { src: '/assets/bridal/resort-bride/1376b5b9dfa2bdf90ff056336a096f79.jpg', caption: 'Resort bridal concept', stage: 'Concept' },
          { src: '/assets/bridal/resort-bride/0055832ee5aa78039f9692ce25fdb63c.png', caption: 'Design development', stage: 'Sketch' },
          { src: '/assets/bridal/resort-bride/132cabc17361f19000034764e213f02a.png', caption: 'Sample review', stage: 'Sampling' },
          { src: '/assets/bridal/resort-bride/2c935cbddd2ea4d1fcc855fcc9024d27.png', caption: 'Final collection', stage: 'Final' },
          { src: '/assets/bridal/resort-bride/39bb8e8023b57bcc6cdac4431f98496f.png', caption: 'Campaign imagery', stage: 'Final' },
        ],
      },
      {
        id: 'night-time',
        title: 'Night Time — Evening',
        description:
          'Evening and night-time bridal looks — dramatic gowns, luxe fabrications, and intricate construction built for the most important moments. Each piece a singular design collaboration with the client.',
        outcome: 'Custom evening pieces produced for private clients and editorial features.',
        pills: ['Consultation', 'Design', 'Toile', 'Final Fabric', 'Delivery'],
        images: [
          { src: '/assets/bridal/night-time/108a4df01e4010d4e4523ed409c659cf.jpg', caption: 'Evening gown design', stage: 'Design' },
          { src: '/assets/bridal/night-time/0189af7fbb551a609732fa69cac30f19.png', caption: 'Construction detail', stage: 'Toile' },
          { src: '/assets/bridal/night-time/1e2a361bfe116082d97388ae66c37c86.png', caption: 'Final fabric fitting', stage: 'Final Fabric' },
          { src: '/assets/bridal/night-time/2598d5ef10ea7bc2d0b86d2f312e4ec4.jpg', caption: 'Final delivered piece', stage: 'Delivery' },
          { src: '/assets/bridal/night-time/3161d3902a9e538877bd39f96f2282d7.png', caption: 'Campaign imagery', stage: 'Delivery' },
        ],
      },
      {
        id: 'satin-sara',
        title: 'Satin Sara',
        description:
          'Bespoke satin bridal — fluid bias cuts, minimal embellishment, and a focus on drape and movement. Designed in close collaboration with the client from first sketch through final fitting.',
        outcome: "Bespoke piece delivered and worn on the client's wedding day.",
        pills: ['Consultation', 'Sketch', 'Toile', 'Final Fitting'],
        images: [
          { src: '/assets/bridal/satin-sara/1928ae062d734cbf01edfe842066b57c.jpg', caption: 'Initial consultation sketches', stage: 'Sketch' },
          { src: '/assets/bridal/satin-sara/2e08b766c5baf1fee75d39b1c6a3c4ee.jpg', caption: 'Muslin toile fitting', stage: 'Toile' },
          { src: '/assets/bridal/satin-sara/3d4b24c3ea5cc25972a9ad1f67ab621c.jpg', caption: 'Satin fitting', stage: 'Final Fitting' },
          { src: '/assets/bridal/satin-sara/41011166e5f125cc2a665ffaf9991b02.jpg', caption: 'Final delivered gown', stage: 'Final Fitting' },
        ],
      },
      {
        id: 'butterfly-bridal',
        title: 'Butterfly Bridal',
        description:
          'Bridal collection featuring butterfly-inspired embellishment and ethereal silhouettes — delicate construction, layered fabrics, and intricate detailing built for the romantic, theatrical bride.',
        outcome: 'Collection pieces delivered for private clients and editorial.',
        pills: ['Concept', 'Sketch', 'Embellishment', 'Final'],
        images: [
          { src: '/assets/bridal/butterfly-bridal/096916b4561d0ddd5814038466d1e234.jpg', caption: 'Butterfly embellishment development', stage: 'Embellishment' },
          { src: '/assets/bridal/butterfly-bridal/11dc94fec9ff40f54eb46743adee4607.jpg', caption: 'Silhouette development', stage: 'Sketch' },
          { src: '/assets/bridal/butterfly-bridal/2c05891253838343ec978affe172cb1c.jpg', caption: 'Final collection', stage: 'Final' },
          { src: '/assets/bridal/butterfly-bridal/367cc60900286097a8515afc6b380455.jpg', caption: 'Campaign imagery', stage: 'Final' },
        ],
      },
    ],
  },

  {
    id: 'illustrations',
    label: 'Hand Illustrations',
    subtitle: 'Fashion illustrations — Procreate, markers, and colored pencils',
    description:
      'Original fashion illustration across digital and traditional media — technical flats, editorial illustrations, and fine-art figure studies.',
    previewImages: [
      '/assets/illustrations/procreate/b8558489a2723e5f6a872f0150e4c597.jpg',
      '/assets/illustrations/markers-pencils/175cc67ab9481a0e757bc3d4eb7bd01c.jpg',
      '/assets/illustrations/markers-pencils/357d07c059821a600b5e02707e3329ae.jpg',
    ],
    sections: [
      {
        id: 'procreate',
        title: 'Procreate — Digital',
        description:
          'Digital fashion illustration using Procreate — editorial figure studies, concept presentations, and technical design work. Used across client pitches, brand identity projects, and collection development.',
        outcome: 'Illustrations used in design presentations, client pitches, and brand identity work.',
        pills: ['Reference', 'Rough', 'Line Art', 'Color', 'Final'],
        images: [
          { src: '/assets/illustrations/procreate/b8558489a2723e5f6a872f0150e4c597.jpg', caption: 'Digital fashion illustration — Procreate', stage: 'Final' },
        ],
      },
      {
        id: 'markers-pencils',
        title: 'Markers & Colored Pencils',
        description:
          'Traditional media fashion illustration — markers and colored pencils. Work spans editorial figure studies, fabric rendering, and concept sketching across resort, bridal, and RTW categories.',
        outcome: 'Illustrations used across design presentations and collection development.',
        pills: ['Reference', 'Rough Sketch', 'Rendering', 'Final'],
        images: [
          { src: '/assets/illustrations/markers-pencils/175cc67ab9481a0e757bc3d4eb7bd01c.jpg', caption: 'Marker fashion illustration', stage: 'Final' },
          { src: '/assets/illustrations/markers-pencils/2aaa086a3a301ebcfe11f51268405a6d.png', caption: 'Figure study — markers', stage: 'Final' },
          { src: '/assets/illustrations/markers-pencils/357d07c059821a600b5e02707e3329ae.jpg', caption: 'Colored pencil rendering', stage: 'Final' },
          { src: '/assets/illustrations/markers-pencils/b4b30c1c4c8be75d735c64df1aa64a4d.jpg', caption: 'Editorial illustration', stage: 'Final' },
        ],
      },
    ],
  },
]
