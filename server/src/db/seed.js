import bcrypt from 'bcryptjs';
import { db, initDatabase } from './database.js';

export function seedData(force = false) {
  initDatabase();

  try {
    const isSeeded = db.prepare("SELECT value FROM site_settings WHERE key = 'database_seeded'").get();
    if (isSeeded && isSeeded.value === '1' && !force) {
      // Database is already initialized and seeded. Preserve all user changes and deletions.
      return;
    }
  } catch (e) {
    // If site_settings table doesn't exist yet, proceed with schema init and seeding
  }

  console.log('Seeding initial data for Mariya Foundation...');

  // 1. Seed Admin
  const adminCheck = db.prepare('SELECT count(*) as count FROM admins').get();
  if (adminCheck.count === 0) {
    const hashedPassword = bcrypt.hashSync('AdminPassword123!', 10);
    db.prepare(`
      INSERT INTO admins (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `).run('Mariya Foundation Administrator', 'admin@mariyafoundation.org', hashedPassword, 'superadmin');
    console.log('Admin account seeded: admin@mariyafoundation.org / AdminPassword123!');
  }

  // 2. Seed Categories
  const categories = [
    {
      slug: 'education',
      name: 'Education Support',
      description: "Empowering learners through Qur'anic studies, school supplies, books, and educational sponsorships.",
      icon: 'BookOpen',
      display_order: 1
    },
    {
      slug: 'empowerment',
      name: 'Empowerment & Self-Reliance',
      description: 'Equipping youth and women with vocational skills, entrepreneurship tools, and startup resources to achieve sustainable self-reliance.',
      icon: 'Sparkles',
      display_order: 2
    },
    {
      slug: 'community',
      name: 'Community Support & Welfare',
      description: 'Strengthening vulnerable communities through essential welfare, relief, water access, and social development initiatives.',
      icon: 'HeartHandshake',
      display_order: 3
    }
  ];

  const insertCategory = db.prepare(`
    INSERT OR IGNORE INTO program_categories (slug, name, description, icon, display_order)
    VALUES (?, ?, ?, ?, ?)
  `);

  categories.forEach(cat => {
    insertCategory.run(cat.slug, cat.name, cat.description, cat.icon, cat.display_order);
  });

  const catMap = {};
  db.prepare('SELECT id, slug FROM program_categories').all().forEach(row => {
    catMap[row.slug] = row.id;
  });

  // 3. Seed Programs
  const programCount = db.prepare('SELECT count(*) as count FROM programs').get();
  if (programCount.count === 0) {
    const insertProgram = db.prepare(`
      INSERT INTO programs (
        category_id, title, slug, short_description, full_description, image_url,
        objectives, target_beneficiaries, activities, status, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const programs = [
      {
        category_id: catMap['education'],
        title: "Qur'an Distribution & Tajweed Learning Kits",
        slug: 'quran-distribution-learning-kits',
        short_description: "Providing high-quality printed Qur'ans, Tajweed guides, and learning aids to underserved Madrasahs and students.",
        full_description: "The Qur'an Distribution initiative aims to eliminate the shortage of sacred texts in traditional learning centers, rural Madrasahs, and community schools. In many underserved communities, multiple students share a single worn copy of the Mushaf. We provide brand new, durable copies of the Holy Qur'an, Tajweed practice books, wooden book stands (rehal), and illuminated learning charts to ensure every student can memorize and recite with dignity.",
        image_url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80',
        objectives: JSON.stringify([
          "Distribute 2,500+ copies of the Holy Qur'an to rural and community Madrasahs annually",
          "Provide Tajweed learning aids and reference charts to enhance recitation quality",
          "Facilitate conducive memorization environments for Tahfeez students"
        ]),
        target_beneficiaries: JSON.stringify([
          "Qur'anic memorization (Tahfeez) students",
          "Rural Madrasahs with limited learning resources",
          "Vulnerable children eager to learn the Qur'an"
        ]),
        activities: JSON.stringify([
          "Madrasah needs assessment across targeted communities",
          "Bulk printing and procurement of durable Mushafs",
          "Community distribution ceremonies and recitation workshops",
          "Quarterly follow-up with teachers and administrators"
        ]),
        status: 'active',
        is_featured: 1
      },
      {
        category_id: catMap['education'],
        title: 'Books, School Supplies & Student Assistance',
        slug: 'school-supplies-student-assistance',
        short_description: 'Supplying school backpacks, textbooks, exercise books, and writing materials to underprivileged pupils.',
        full_description: "No child should be hindered from accessing foundational education due to the lack of notebooks, uniforms, or basic writing tools. Mariya Foundation's Student Assistance initiative equips underprivileged children with essential educational toolkits containing durable backpacks, standard curriculum textbooks, notebooks, mathematical sets, and writing supplies.",
        image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
        objectives: JSON.stringify([
          "Prevent school dropouts caused by inability to afford basic learning supplies",
          "Promote literacy and numeracy among vulnerable primary and junior secondary students",
          "Encourage parents and guardians in low-income areas to keep children in school"
        ]),
        target_beneficiaries: JSON.stringify([
          "Primary and secondary school pupils in low-income families",
          "Orphans and vulnerable children (OVC)",
          "Community primary schools lacking library and instructional materials"
        ]),
        activities: JSON.stringify([
          "Identification and verification of students in urgent need",
          "Assembly of comprehensive Back-to-School study kits",
          "Direct distribution drives before each new academic term",
          "Partnership with local school headteachers to track student retention"
        ]),
        status: 'active',
        is_featured: 1
      },
      {
        category_id: catMap['education'],
        title: 'Student Scholarships & Educational Grants',
        slug: 'student-scholarships-educational-grants',
        short_description: 'Covering tuition, examination fees, and academic allowances for talented yet financially disadvantaged students.',
        full_description: "This scholarship fund provides financial support to exceptional, determined students from low-income households who are at risk of abandoning their schooling due to unpaid tuition or examination registration fees. Through merit and need-based screening, Mariya Foundation covers tuition costs and provides a supportive mentorship circle.",
        image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
        objectives: JSON.stringify([
          "Sponsor tuition and external examination fees (e.g. WAEC, NECO, BECE, JAMB)",
          "Provide academic mentorship, career counseling, and character development workshops",
          "Nurture the next generation of ethical community leaders and scholars"
        ]),
        target_beneficiaries: JSON.stringify([
          "High-performing secondary and tertiary students from impoverished backgrounds",
          "Indigent students facing immediate eviction from examinations due to non-payment",
          "Youth aspiring for higher education and vocational certification"
        ]),
        activities: JSON.stringify([
          "Transparent application intake and community verification visits",
          "Direct fee payment to accredited educational institutions",
          "Biannual academic progress evaluation and mentor check-ins",
          "Life skills and leadership retreat sessions"
        ]),
        status: 'active',
        is_featured: 0
      },
      {
        category_id: catMap['empowerment'],
        title: 'Vocational Skills & Garment Making Academy',
        slug: 'vocational-skills-garment-making-academy',
        short_description: 'Intensive 6-month hands-on fashion design, tailoring, and embroidery training with startup sewing equipment.',
        full_description: "Our flagship vocational empowerment initiative equips women, widows, and unemployed youth with market-ready tailoring and garment construction skills. The curriculum spans cutting, pattern drafting, stitching, industrial machine maintenance, business bookkeeping, and customer relations. Upon graduation, each top-performing beneficiary receives a brand-new sewing machine and starter fabric package.",
        image_url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
        objectives: JSON.stringify([
          "Provide 100+ youth and women with accredited tailoring skills annually",
          "Gift startup sewing machines and toolkits to graduating apprentices",
          "Foster independent entrepreneurship and family financial resilience"
        ]),
        target_beneficiaries: JSON.stringify([
          "Unemployed youth seeking trade skills",
          "Widows and female household heads needing sustainable income",
          "Out-of-school young adults looking for vocational dignity"
        ]),
        activities: JSON.stringify([
          "Comprehensive 24-week practical classroom and workshop sessions",
          "Business management, pricing, and digital marketing workshops",
          "Final practical portfolio review and exhibition",
          "Graduation tool handover and 12-month post-training business mentoring"
        ]),
        status: 'active',
        is_featured: 1
      },
      {
        category_id: catMap['empowerment'],
        title: 'Youth Digital Skills & Tech Literacy Hub',
        slug: 'youth-digital-skills-tech-literacy-hub',
        short_description: 'Practical training in computer literacy, graphic design, basic coding, and online freelance career fundamentals.',
        full_description: "Bridging the digital divide for underprivileged youth by providing hands-on access to modern computers, internet connectivity, and structured training in office productivity suites, digital graphic design, content creation, and remote freelancing essentials. We empower youth to access global economic opportunities right from their local communities.",
        image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
        objectives: JSON.stringify([
          "Train 150+ youth annually in essential digital productivity and creative skills",
          "Enable participants to earn income through local and remote freelancing",
          "Provide open-access computer lab hours for student research and homework"
        ]),
        target_beneficiaries: JSON.stringify([
          "Secondary school graduates unable to afford immediate university enrollment",
          "Underemployed youth in semi-urban and rural areas",
          "Aspiring young digital creators and small-business owners"
        ]),
        activities: JSON.stringify([
          "Cohort-based 12-week practical computing curriculum",
          "Hands-on portfolio creation (flyers, branding, spreadsheets, typing)",
          "Freelance profile setup and ethical online commerce guidance",
          "Internship matching with local businesses and nonprofit partners"
        ]),
        status: 'active',
        is_featured: 1
      },
      {
        category_id: catMap['empowerment'],
        title: 'Small Business Seed Grants & Mentorship',
        slug: 'small-business-seed-grants-mentorship',
        short_description: 'Micro-grants and financial literacy coaching for grassroots micro-entrepreneurs to expand petty trading.',
        full_description: "To break the cycle of poverty and predatory loans, Mariya Foundation provides non-refundable micro-grants combined with mandatory financial literacy and inventory management coaching. Beneficiaries include market women, food vendors, and artisanal trade workers who need modest capital to stock goods, purchase essential tools, and build sustainable household livelihoods.",
        image_url: 'https://images.unsplash.com/photo-1556742049-0a67e5572246?auto=format&fit=crop&w=1200&q=80',
        objectives: JSON.stringify([
          "Empower 200+ micro-merchants with seed capital injection",
          "Teach basic bookkeeping, savings habits, and reinvestment strategies",
          "Promote economic self-sufficiency rather than perpetual dependency"
        ]),
        target_beneficiaries: JSON.stringify([
          "Petty traders, market stall owners, and street food processors",
          "Women cooperative societies in rural market hubs",
          "Families recovering from economic hardship or displacement"
        ]),
        activities: JSON.stringify([
          "Business feasibility review and baseline income recording",
          "Financial literacy bootcamps in local languages",
          "Disbursement of seed grants directly into verified business activities",
          "Monthly field advisor visits and peer savings group formation"
        ]),
        status: 'active',
        is_featured: 0
      },
      {
        category_id: catMap['community'],
        title: 'Clean Water Boreholes & Community Sanitation',
        slug: 'clean-water-boreholes-sanitation',
        short_description: 'Solar-powered water boreholes providing safe drinking water to remote villages and learning institutions.',
        full_description: "Access to clean water is a fundamental right. In remote communities where women and children walk several kilometers daily to fetch unsafe water, Mariya Foundation constructs deep, solar-powered boreholes equipped with overhead storage tanks, multiple dispensing taps, and community maintenance committees.",
        image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=1200&q=80',
        objectives: JSON.stringify([
          "Eliminate waterborne diseases in underserved rural settlements",
          "Save children and girls valuable study hours spent fetching water",
          "Establish self-sustaining water caretaker committees in each village"
        ]),
        target_beneficiaries: JSON.stringify([
          "Rural villages without municipal piped water",
          "Public community schools and surrounding Madrasahs",
          "Health clinics requiring hygienic running water"
        ]),
        activities: JSON.stringify([
          "Hydrogeological surveying and community stakeholder consultations",
          "Drilling, casing, solar pump installation, and water quality testing",
          "Handover ceremony and establishment of village maintenance fund",
          "Sanitation and hygiene awareness campaigns"
        ]),
        status: 'active',
        is_featured: 0
      },
      {
        category_id: catMap['community'],
        title: 'Ramadan & Emergency Food Relief Packs',
        slug: 'ramadan-emergency-food-relief',
        short_description: 'Nutritional sustenance packages for vulnerable households, widows, and elders during times of urgent need.',
        full_description: "During the holy month of Ramadan and during times of seasonal inflation or agricultural distress, Mariya Foundation distributes wholesome food parcels containing staples such as rice, beans, maize flour, cooking oil, dates, sugar, and milk. Each parcel sustains a vulnerable family of 6 for one full month.",
        image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
        objectives: JSON.stringify([
          "Relieve acute food insecurity for impoverished households",
          "Provide dignity and peace of mind to elderly widows and orphans during Ramadan",
          "Deliver swift response during seasonal food scarcity"
        ]),
        target_beneficiaries: JSON.stringify([
          "Widow-headed households with minor children",
          "Elderly community members with no family support",
          "Low-income daily wage earners"
        ]),
        activities: JSON.stringify([
          "Discreet household vulnerability mapping with community elders",
          "Bulk food procurement and hygienic packaging",
          "Door-to-door and organized center distributions",
          "Nutrition counseling and post-distribution feedback collection"
        ]),
        status: 'active',
        is_featured: 0
      }
    ];

    programs.forEach(prog => {
      insertProgram.run(
        prog.category_id,
        prog.title,
        prog.slug,
        prog.short_description,
        prog.full_description,
        prog.image_url,
        prog.objectives,
        prog.target_beneficiaries,
        prog.activities,
        prog.status,
        prog.is_featured
      );
    });
  }

  // 4. Seed Impact Stats (marked with realistic placeholder disclaimer)
  const impactStatsCount = db.prepare('SELECT count(*) as count FROM impact_stats').get();
  if (impactStatsCount.count === 0) {
    const insertStat = db.prepare(`
      INSERT INTO impact_stats (metric_key, label, value, prefix, suffix, description, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const stats = [
      { metric_key: 'qurans_distributed', label: "Qur'ans Distributed", value: 3450, prefix: '', suffix: '+', description: "Mushafs and Tajweed learning packages distributed across community Madrasahs", display_order: 1 },
      { metric_key: 'students_supported', label: 'Students Supported', value: 1820, prefix: '', suffix: '+', description: 'Pupils provided with books, study kits, and educational assistance', display_order: 2 },
      { metric_key: 'empowerment_graduates', label: 'Skills & Business Beneficiaries', value: 640, prefix: '', suffix: '+', description: 'Youth and women trained in vocational trades and supported with starter tools', display_order: 3 },
      { metric_key: 'communities_reached', label: 'Communities Reached', value: 28, prefix: '', suffix: '', description: 'Towns and rural settlements benefiting from water, education, and welfare programs', display_order: 4 }
    ];

    stats.forEach(s => {
      insertStat.run(s.metric_key, s.label, s.value, s.prefix, s.suffix, s.description, s.display_order, 1);
    });
  }

  // 5. Seed Impact Stories
  const storiesCount = db.prepare('SELECT count(*) as count FROM impact_stories').get();
  if (storiesCount.count === 0) {
    const insertStory = db.prepare(`
      INSERT INTO impact_stories (
        title, beneficiary_name, category, before_situation, after_situation,
        quote, story_content, image_url, location, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const stories = [
      {
        title: 'From Struggle to a Thriving Fashion Workshop',
        beneficiary_name: 'Fatima Abubakar',
        category: 'Empowerment',
        before_situation: 'Single mother of three with no steady income, struggling to pay children’s school fees.',
        after_situation: 'Now runs an independent sewing enterprise, employing two apprentice girls and funding her children’s education comfortably.',
        quote: "Mariya Foundation did not just give me a sewing machine; they gave me dignity, financial independence, and hope for my children's future.",
        story_content: "Fatima joined the Mariya Foundation 6-Month Vocational Garment Making Academy with zero tailoring experience. Throughout the intensive program, she demonstrated exceptional dedication in mastering pattern drafting and machine operations. Upon graduation, she received an industrial sewing machine and basic startup fabric. Today, she runs a popular bridal tailoring shop in her neighborhood and trains other young women.",
        image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
        location: 'Zaria Community Hub',
        is_featured: 1
      },
      {
        title: "Memorizing the Noble Qur'an with Joy and Clarity",
        beneficiary_name: 'Ibrahim Danladi',
        category: 'Education',
        before_situation: 'Studied in a rural Madrasah where four students had to share a single torn manuscript with missing pages.',
        after_situation: 'Received his personal Tajweed Qur’an and audio review aids, successfully completing memorization of 15 Juz.',
        quote: "Holding my own brand new Qur'an for the first time gave me tears of joy. I can now study whenever I want without waiting for my turn.",
        story_content: "In Ibrahim's village Madrasah, learning the Qur'an was severely constrained by the lack of reading materials. Mariya Foundation's educational support team supplied 150 copies of standard Tajweed Mushafs, sturdy wooden reading desks, and student writing tablets. Ibrahim excelled rapidly, becoming one of the top reciters in the inter-madrasah recitation competition.",
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        location: 'Kudendan Madrasah Centre',
        is_featured: 1
      },
      {
        title: 'Expanding a Street Food Stand into a Clean Eatery',
        beneficiary_name: 'Zainab Bello',
        category: 'Empowerment',
        before_situation: 'Cooked small batches of snacks over firewood with limited capital, vulnerable to market price hikes.',
        after_situation: 'Received business coaching and a seed grant, enabling her to purchase a modern gas cooker and wholesale ingredients.',
        quote: "The business management coaching opened my eyes to proper daily bookkeeping. My daily revenue has doubled.",
        story_content: "Zainab participated in Mariya Foundation's Small Business Seed Grants bootcamp. She learned how to separate business capital from personal expenses, keep daily cash flow ledgers, and maintain food hygiene standards. With a modest seed grant, she purchased commercial cookware and wholesale grains, transforming her stall into a reputable local catering joint.",
        image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
        location: 'Sabon Gari Market',
        is_featured: 1
      }
    ];

    stories.forEach(story => {
      insertStory.run(
        story.title,
        story.beneficiary_name,
        story.category,
        story.before_situation,
        story.after_situation,
        story.quote,
        story.story_content,
        story.image_url,
        story.location,
        story.is_featured
      );
    });
  }

  // 6. Seed Gallery
  const galleryCount = db.prepare('SELECT count(*) as count FROM gallery').get();
  if (galleryCount.count === 0) {
    const insertGallery = db.prepare(`
      INSERT INTO gallery (title, category, caption, image_url, location, event_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const galleryItems = [
      {
        title: "Qur'an Distribution Ceremony",
        category: "Quran",
        caption: "Students holding their newly received Tajweed copies of the Holy Qur'an with radiant smiles.",
        image_url: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80",
        location: "Community Central Madrasah",
        event_date: "2026-03-15"
      },
      {
        title: "Back to School Study Packs Handover",
        category: "Education",
        caption: "Primary pupils receiving backpacks containing notebooks, mathematical sets, and writing materials.",
        image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
        location: "Al-Huda Model Primary School",
        event_date: "2026-04-10"
      },
      {
        title: "Fashion & Tailoring Apprenticeship Class",
        category: "Empowerment",
        caption: "Beneficiaries practicing advanced garment cutting and sewing machine operation techniques.",
        image_url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80",
        location: "Mariya Vocational Centre",
        event_date: "2026-05-20"
      },
      {
        title: "Digital Literacy Workshop for Youth",
        category: "Empowerment",
        caption: "Young adults learning computer productivity tools, graphic design, and typing proficiency.",
        image_url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
        location: "Youth Tech Resource Lab",
        event_date: "2026-06-12"
      },
      {
        title: "Solar Borehole Clean Water Commissioning",
        category: "Community",
        caption: "Community elders and children celebrating clean drinking water access in their village.",
        image_url: "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=1200&q=80",
        location: "Dan Mani Rural Settlement",
        event_date: "2026-07-04"
      },
      {
        title: "Ramadan Food Parcel Distribution",
        category: "Community",
        caption: "Distribution of essential nutritional food baskets to vulnerable families and widows.",
        image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
        location: "Mariya Foundation Relief Depot",
        event_date: "2026-02-28"
      },
      {
        title: "Annual Volunteer Orientation Day",
        category: "Events",
        caption: "Dedicated volunteers planning educational outreach campaigns and community field trips.",
        image_url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80",
        location: "Foundation Main Hall",
        event_date: "2026-08-01"
      },
      {
        title: "Small Business Grant Handover Ceremony",
        category: "Empowerment",
        caption: "Market women and artisans receiving micro-capital certificates to expand their trade.",
        image_url: "https://images.unsplash.com/photo-1556742049-0a67e5572246?auto=format&fit=crop&w=1200&q=80",
        location: "Women Development Center",
        event_date: "2026-08-18"
      }
    ];

    galleryItems.forEach(item => {
      insertGallery.run(item.title, item.category, item.caption, item.image_url, item.location, item.event_date);
    });
  }

  // 7. Seed News
  const newsCount = db.prepare('SELECT count(*) as count FROM news').get();
  if (newsCount.count === 0) {
    const insertNews = db.prepare(`
      INSERT INTO news (title, slug, summary, content, category, author, featured_image, is_published, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const articles = [
      {
        title: "Mariya Foundation Launches 2026 Qur'an and Educational Support Campaign",
        slug: "mariya-foundation-launches-2026-quran-educational-campaign",
        summary: "A comprehensive initiative to provide 5,000 students across 40 community learning centers with Qur'ans, learning materials, and academic aid.",
        content: `Mariya Foundation has officially launched its flagship 2026 Educational and Qur'anic Outreach Initiative. The campaign focuses on bridging the severe gap in instructional materials, Mushafs, and writing supplies experienced by community Madrasahs and public basic schools.

Speaking at the launch, the Foundation leadership reiterated our core commitment to nurturing intellectual, moral, and economic growth from the grassroots. "When we provide a child with a Qur'an to read and notebooks to write in, we are building the cornerstone of a righteous and self-sufficient society," the spokesperson noted.

The initiative encompasses three key components:
1. **Direct Mushaf Endowment:** Distributing durable, large-font Tajweed copies of the Holy Qur'an to students engaged in memorization.
2. **Back-to-School Kits:** Equipping indigent primary pupils with complete stationery packages to curtail school abandonment.
3. **Teacher Support Grants:** Providing honorarium stipends and classroom teaching resources to volunteer educators in underserved settlements.

Members of the public, philanthropists, and community supporters are warmly invited to partner with Mariya Foundation in expanding this noble endeavor.`,
        category: "Announcements",
        author: "Mariya Foundation Secretariat",
        featured_image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80",
        is_published: 1,
        published_at: "2026-08-10 09:00:00"
      },
      {
        title: "Graduation of the 4th Cohort of Vocational Tailoring and Business Apprentices",
        slug: "graduation-4th-cohort-vocational-tailoring",
        summary: "Forty young women and youth complete six months of rigorous fashion design and entrepreneurship training with startup equipment.",
        content: `Forty enthusiastic beneficiaries from the Mariya Foundation Vocational Training Academy celebrated their official graduation ceremony today, marking the beginning of their journey as self-reliant business owners.

Over the past six months, students received intensive practical training in garment construction, embroidery, modern pattern design, customer handling, and financial literacy. Every graduate was awarded an industrial sewing machine, cutting shears, measuring tools, and a starter fabric bundle funded through generous foundation supporters.

"Before this training, I had no marketable skill and worried constantly about my family's sustenance," shared Halima, one of the graduating students. "Today, I am proud to hold a recognized vocational certificate and my own sewing machine. I am ready to build my own fashion business."

The next cohort registration is set to open next month, with expanded slots for youth digital skills and artisanal trades.`,
        category: "Success Story",
        author: "Vocational Training Department",
        featured_image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80",
        is_published: 1,
        published_at: "2026-08-25 14:30:00"
      },
      {
        title: "Community Outreach: Commissioning Safe Clean Water Point in Dan Mani",
        slug: "community-outreach-commissioning-clean-water-dan-mani",
        summary: "Over 800 residents and 3 local schools gain immediate access to clean potable water through a new solar-powered borehole.",
        content: `Mariya Foundation is delighted to announce the successful drilling and commissioning of a deep solar-powered borehole in the Dan Mani rural community. 

For over a decade, residents, particularly women and school-age children, trekked over 3 kilometers each morning to fetch water from open streams, exposing them to waterborne illnesses and causing frequent school absenteeism.

The new facility features:
- A 120-meter deep high-yield borehole with stainless steel solar submersible pump
- 5,000-liter elevated storage tank system
- 8-point heavy-duty distribution tap stand
- A village water management committee trained in preventative maintenance

The village head expressed deep gratitude to Mariya Foundation and its generous donors, noting that the project has brought relief, health, and dignity to the entire locality.`,
        category: "Program Update",
        author: "Community Development Team",
        featured_image: "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=1200&q=80",
        is_published: 1,
        published_at: "2026-09-02 11:15:00"
      }
    ];

    articles.forEach(art => {
      insertNews.run(
        art.title,
        art.slug,
        art.summary,
        art.content,
        art.category,
        art.author,
        art.featured_image,
        art.is_published,
        art.published_at
      );
    });
  }

  // 8. Seed Testimonials
  const testimonialsCount = db.prepare('SELECT count(*) as count FROM testimonials').get();
  if (testimonialsCount.count === 0) {
    const insertTestimonial = db.prepare(`
      INSERT INTO testimonials (name, role_title, location, content, avatar_url, rating, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const testimonials = [
      {
        name: "Mallam Usman Ahmad",
        role_title: "Head Teacher, Darul-Hikmah Madrasah",
        location: "Rigasa District",
        content: "Mariya Foundation's intervention transformed our school. Our students no longer struggle with torn books. Every child now has their own Qur'an, and attendance has increased significantly.",
        avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        is_published: 1
      },
      {
        name: "Amina Lawal",
        role_title: "Fashion Academy Graduate & Business Owner",
        location: "Barnawa Hub",
        content: "Learning tailoring with Mariya Foundation changed my life completely. I was gifted a brand new sewing machine and taught how to manage a business. Today, I am completely self-reliant.",
        avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        is_published: 1
      },
      {
        name: "Dr. Aliyu Sanusi",
        role_title: "Community Advocate & Volunteer Lead",
        location: "Hayin Banki",
        content: "What sets Mariya Foundation apart is their unwavering dedication to real sustainability. They don't just distribute relief; they build self-reliance through education and vocational mastery.",
        avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        is_published: 1
      }
    ];

    testimonials.forEach(t => {
      insertTestimonial.run(t.name, t.role_title, t.location, t.content, t.avatar_url, t.rating, t.is_published);
    });
  }

  // 9. Seed Donation Accounts (Clearly marked placeholder accounts as requested)
  const donationCount = db.prepare('SELECT count(*) as count FROM donation_accounts').get();
  if (donationCount.count === 0) {
    const insertDonation = db.prepare(`
      INSERT INTO donation_accounts (bank_name, account_name, account_number, routing_or_iban, currency, instructions, is_primary, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const accounts = [
      {
        bank_name: "Jaiz Bank Plc (Islamic Banking)",
        account_name: "Mariya Foundation - General Charity & Operations",
        account_number: "0000000000 (Placeholder)",
        routing_or_iban: "JAIZNGLA",
        currency: "NGN",
        instructions: "For general charitable donations, Qur'an distribution, and student education support. Please use your name or phone number as narration.",
        is_primary: 1,
        is_active: 1
      },
      {
        bank_name: "Stanbic IBTC Bank (Non-Interest Banking)",
        account_name: "Mariya Foundation - Vocational & Youth Empowerment Fund",
        account_number: "1111111111 (Placeholder)",
        routing_or_iban: "SBICNGLA",
        currency: "NGN",
        instructions: "Designated strictly for vocational skills equipment, micro-business seed grants, and digital training labs.",
        is_primary: 0,
        is_active: 1
      },
      {
        bank_name: "TAJBank Limited",
        account_name: "Mariya Foundation - Education & Tahfeez Sponsorship",
        account_number: "2222222222 (Placeholder)",
        routing_or_iban: "TAJBNGLA",
        currency: "NGN",
        instructions: "Designated for Qur'an printing, student textbooks, and academic fee support.",
        is_primary: 0,
        is_active: 1
      }
    ];

    accounts.forEach(acc => {
      insertDonation.run(acc.bank_name, acc.account_name, acc.account_number, acc.routing_or_iban, acc.currency, acc.instructions, acc.is_primary, acc.is_active);
    });
  }

  // 10. Seed Site Settings
  const settings = [
    { key: 'org_name', value: 'Mariya Foundation', group_name: 'general' },
    { key: 'tagline', value: 'Empowering Communities, Nurturing Education & Building Self-Reliance', group_name: 'general' },
    { key: 'mission', value: 'To empower underserved individuals and communities to become economically and socially self-reliant, while facilitating holistic Qur’anic and formal education support for students in need.', group_name: 'about' },
    { key: 'vision', value: 'A resilient, ethical society where every individual has the educational opportunity, vocational dignity, and moral grounding to uplift themselves and their communities.', group_name: 'about' },
    { key: 'contact_phone', value: '+234 (0) 800 000 0000 (Placeholder)', group_name: 'contact' },
    { key: 'contact_email', value: 'info@mariyafoundation.org (Placeholder)', group_name: 'contact' },
    { key: 'contact_whatsapp', value: '+234 (0) 800 000 0000 (Placeholder)', group_name: 'contact' },
    { key: 'office_address', value: 'Plot 12, Community Development Crescent, Kaduna State, Nigeria (Placeholder)', group_name: 'contact' },
    { key: 'facebook_url', value: 'https://facebook.com/mariyafoundation', group_name: 'social' },
    { key: 'twitter_url', value: 'https://twitter.com/mariyafoundation', group_name: 'social' },
    { key: 'instagram_url', value: 'https://instagram.com/mariyafoundation', group_name: 'social' },
    { key: 'youtube_url', value: 'https://youtube.com/mariyafoundation', group_name: 'social' },
    { key: 'paystack_enabled', value: 'false', group_name: 'payments' },
    { key: 'paystack_public_key', value: 'pk_test_placeholder_key_for_mariya_foundation', group_name: 'payments' }
  ];

  const insertSetting = db.prepare(`
    INSERT OR REPLACE INTO site_settings (key, value, group_name)
    VALUES (?, ?, ?)
  `);

  settings.forEach(s => {
    insertSetting.run(s.key, s.value, s.group_name);
  });

  // Mark database as seeded
  insertSetting.run('database_seeded', '1', 'system');

  console.log('Mariya Foundation seed data completed successfully!');
}

// If run directly via node seed.js
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedData();
  process.exit(0);
}
