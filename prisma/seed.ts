import { PrismaClient } from '#src/generated/prisma/index.js';

const prisma = new PrismaClient();

const categories = [
  { name: "Technology" },
  { name: "Environment" },
  { name: "Science" },
  { name: "Health" },
  { name: "Space" },
  { name: "AI & Machine Learning" },
  { name: "Climate Change" },
  { name: "Medical Research" }
];

const newsData = [
  {
    title: "Breakthrough in Renewable Energy Technology",
    summary: "Scientists develop new solar panels with 40% efficiency rate, potentially revolutionizing clean energy production.",
    source: "TechNews Daily",
    categories: ["Technology", "Environment"],
    content: `A team of researchers at MIT has developed a groundbreaking solar panel technology that achieves an unprecedented 40% efficiency rate. This represents a significant improvement over current commercial panels that typically achieve 15-22% efficiency.

The new technology uses a novel combination of perovskite and silicon materials, creating a tandem cell structure that can capture a broader spectrum of sunlight. Lead researcher Dr. Sarah Johnson explained that this breakthrough could make solar energy more cost-effective and accelerate the global transition to renewable energy.

The research team expects commercial applications to be available within 3-5 years, pending further testing and regulatory approval. Major energy companies have already expressed interest in licensing the technology.

This development comes at a crucial time as countries worldwide are seeking to reduce carbon emissions and meet climate goals. The increased efficiency could make solar installations more viable in regions with limited space or lower sunlight levels.`
  },
  {
    title: "Major Tech Company Announces AI Assistant Integration",
    summary: "Leading technology firm unveils plans to integrate advanced AI assistants across all consumer devices by 2025.",
    source: "AI Weekly",
    categories: ["Technology", "AI & Machine Learning"],
    content: `In a surprise announcement at the annual developer conference, TechCorp revealed its ambitious plan to integrate advanced AI assistants into every consumer device in their ecosystem. The AI, codenamed "Assistant Pro," will be powered by the company's latest large language model.

The integration will span smartphones, tablets, laptops, smart home devices, and even automotive systems. Users will be able to interact with their devices using natural language, making technology more accessible to people of all technical skill levels.

Privacy advocates have raised concerns about data collection and processing, but the company assures that most AI processing will occur on-device to protect user privacy. The AI assistant will learn user preferences over time while maintaining strict data encryption standards.

Beta testing begins next month with select customers, and the full rollout is scheduled for early 2025. Industry analysts predict this move could reshape how consumers interact with technology and potentially influence competitors to develop similar solutions.`
  },
  {
    title: "New Medical Treatment Shows Promise for Rare Disease",
    summary: "Clinical trials demonstrate 85% success rate in treating previously incurable genetic condition affecting children.",
    source: "Medical Journal Today",
    categories: ["Health", "Medical Research", "Science"],
    content: `A revolutionary gene therapy treatment has shown remarkable success in treating Spinal Muscular Atrophy (SMA), a rare genetic disease that primarily affects children. The Phase III clinical trial results, published in the New England Journal of Medicine, demonstrate an 85% success rate in halting disease progression.

The treatment, developed by BioGen Therapeutics, uses a modified virus to deliver healthy copies of the SMN1 gene directly to motor neurons. Children who received the treatment within the first few months of life showed normal motor development, while those treated later experienced significant improvement in muscle function.

Dr. Michael Chen, lead investigator of the trial, called the results "unprecedented" for SMA treatment. Previously, children with severe forms of SMA rarely survived beyond two years of age. The new therapy offers hope for affected families worldwide.

The FDA is expected to approve the treatment within six months, with European regulators following shortly after. The company has committed to making the treatment accessible globally, including in developing countries through partnership programs.`
  },
  {
    title: "Climate Change Initiative Reaches Global Milestone",
    summary: "International coalition of 150 countries commits to carbon neutrality by 2050, with binding enforcement mechanisms.",
    source: "Environmental News Network",
    categories: ["Environment", "Climate Change"],
    content: `The Global Climate Action Summit concluded with historic agreement as 150 countries committed to achieving carbon neutrality by 2050. Unlike previous climate accords, this agreement includes binding enforcement mechanisms and regular progress reviews.

The pact establishes a carbon credit trading system, mandatory renewable energy targets, and substantial funding for developing nations to transition from fossil fuels. Participating countries will face economic sanctions if they fail to meet intermediate targets set for 2030 and 2040.

UN Secretary-General Maria Rodriguez hailed the agreement as "the most comprehensive climate action plan in human history." The deal includes $500 billion in funding for green technology development and deployment in emerging economies.

Environmental groups expressed cautious optimism while noting that success depends entirely on implementation. The first progress review is scheduled for 2026, with countries required to submit detailed carbon reduction plans by next year.

Major corporations have already begun adjusting their long-term strategies in response to the agreement, with many announcing accelerated timelines for their own carbon neutrality goals.`
  },
  {
    title: "Space Mission Discovers Water on Distant Exoplanet",
    summary: "NASA's latest space telescope identifies liquid water signatures on potentially habitable planet 120 light-years away.",
    source: "Space Exploration Today",
    categories: ["Space", "Science"],
    content: `NASA's James Webb Space Telescope has detected strong evidence of liquid water in the atmosphere of K2-18b, an exoplanet located 120 light-years from Earth. This marks the first time scientists have identified water vapor signatures on a planet within the habitable zone of its star.

The discovery was made possible by analyzing the planet's atmospheric composition as it passed in front of its host star. Spectroscopic analysis revealed not only water vapor but also clouds and haze, conditions that could potentially support life as we know it.

Dr. Lisa Martinez, project scientist for the observation, emphasized that while the discovery is groundbreaking, it doesn't confirm the presence of life. "We're seeing conditions that could support life, but we need much more data to understand if life actually exists there," she explained.

K2-18b is approximately 2.6 times larger than Earth and orbits a red dwarf star. The planet receives similar amounts of stellar radiation as Earth, making it an ideal candidate for further study. Future observations will focus on detecting other biosignature gases like oxygen and methane.

This discovery adds to the growing catalog of potentially habitable exoplanets and brings humanity one step closer to answering the fundamental question of whether we are alone in the universe.`
  },
  {
    title: "Revolutionary Quantum Computer Achieves New Milestone",
    summary: "Tech giant's quantum processor successfully performs calculations that would take classical computers thousands of years.",
    source: "Quantum Computing Weekly",
    categories: ["Technology", "Science"],
    content: `QuantumTech Corporation announced a major breakthrough in quantum computing, with their latest processor successfully completing complex calculations in minutes that would require classical supercomputers thousands of years to solve.

The achievement, termed "quantum advantage," was demonstrated using a 1000-qubit processor operating at near absolute zero temperatures. The system solved optimization problems related to drug discovery and financial modeling with unprecedented speed and accuracy.

CEO Dr. Robert Kim explained that this milestone brings practical quantum computing applications significantly closer to reality. "We're moving from laboratory curiosities to tools that can solve real-world problems that affect millions of people," he stated during the announcement.

The breakthrough has immediate implications for pharmaceutical research, where quantum computers could accelerate drug discovery by modeling molecular interactions at the quantum level. Financial institutions are also expressing interest in using quantum computing for risk analysis and portfolio optimization.

However, experts caution that widespread commercial application is still years away due to the specialized conditions required for quantum processors to operate. The systems require extremely low temperatures and sophisticated error correction mechanisms.

Competing companies are racing to achieve similar milestones, setting the stage for what many consider the next major technological revolution.`
  }
];

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Limpar dados existentes (opcional)
    console.log('🧹 Cleaning existing data...');
    await prisma.news.deleteMany();
    await prisma.category.deleteMany();

    // Criar categorias
    console.log('🏷️ Creating categories...');
    for (const category of categories) {
      await prisma.category.create({
        data: category
      });
    }

    // Inserir notícias com relacionamentos
    console.log('📰 Creating sample news with categories...');
    
    for (const newsItem of newsData) {
      await prisma.news.create({
        data: {
          title: newsItem.title,
          summary: newsItem.summary,
          source: newsItem.source,
          content: newsItem.content,
          publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last 7 days
          categories: {
            connect: newsItem.categories.map(categoryName => ({
              name: categoryName
            }))
          }
        }
      });
    }

    console.log(`✅ Successfully created ${newsData.length} news articles`);
    console.log(`✅ Successfully created ${categories.length} categories`);
    
    // Mostrar estatísticas
    const newsCount = await prisma.news.count();
    const categoryCount = await prisma.category.count();
    console.log(`📊 Total news in database: ${newsCount}`);
    console.log(`📊 Total categories in database: ${categoryCount}`);

    // Mostrar algumas notícias com suas categorias
    const newsWithCategories = await prisma.news.findMany({
      take: 3,
      include: {
        categories: true
      }
    });

    console.log('\n📄 Sample news with categories:');
    newsWithCategories.forEach(news => {
      console.log(`- ${news.title} (${news.categories.map(c => c.name).join(', ')})`);
    });

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o seeder
seed()
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });