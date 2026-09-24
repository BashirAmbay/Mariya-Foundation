-- Mariya Foundation SQLite Database Dump for Turso.tech
-- Generated at: 2026-09-24T12:08:19.103Z

PRAGMA foreign_keys = OFF;

-- -----------------------------------------------------
-- Table: admins
-- -----------------------------------------------------
CREATE TABLE admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

INSERT INTO "admins" ("id", "name", "email", "password", "role", "created_at", "updated_at") VALUES (1, 'Mariya Foundation Administrator', 'admin@mariyafoundation.org', '$2b$10$NyWwLGJBDcNl3iTNoVDJJOXgsWNJljuhXcMHO.NhworJeJN4t/h6a', 'superadmin', '2026-09-10 14:11:36', '2026-09-10 14:11:36');

-- -----------------------------------------------------
-- Table: program_categories
-- -----------------------------------------------------
CREATE TABLE program_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      display_order INTEGER DEFAULT 0
    );

INSERT INTO "program_categories" ("id", "slug", "name", "description", "icon", "display_order") VALUES (1, 'education', 'Education Support', 'Empowering learners through Qur''anic studies, school supplies, books, and educational sponsorships.', 'BookOpen', 1);
INSERT INTO "program_categories" ("id", "slug", "name", "description", "icon", "display_order") VALUES (2, 'empowerment', 'Empowerment & Self-Reliance', 'Equipping youth and women with vocational skills, entrepreneurship tools, and startup resources to achieve sustainable self-reliance.', 'Sparkles', 2);
INSERT INTO "program_categories" ("id", "slug", "name", "description", "icon", "display_order") VALUES (3, 'community', 'Community Support & Welfare', 'Strengthening vulnerable communities through essential welfare, relief, water access, and social development initiatives.', 'HeartHandshake', 3);

-- -----------------------------------------------------
-- Table: programs
-- -----------------------------------------------------
CREATE TABLE programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      short_description TEXT NOT NULL,
      full_description TEXT NOT NULL,
      image_url TEXT,
      objectives TEXT, -- JSON array of strings
      target_beneficiaries TEXT, -- JSON array of strings
      activities TEXT, -- JSON array of strings
      status TEXT DEFAULT 'active', -- active, upcoming, completed
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES program_categories(id) ON DELETE CASCADE
    );

INSERT INTO "programs" ("id", "category_id", "title", "slug", "short_description", "full_description", "image_url", "objectives", "target_beneficiaries", "activities", "status", "is_featured", "created_at", "updated_at") VALUES (1, 1, 'Qur''an Distribution & Tajweed Learning Kits', 'quran-distribution-learning-kits', 'Providing high-quality printed Qur''ans, Tajweed guides, and learning aids to underserved Madrasahs and students.', 'The Qur''an Distribution initiative aims to eliminate the shortage of sacred texts in traditional learning centers, rural Madrasahs, and community schools. In many underserved communities, multiple students share a single worn copy of the Mushaf. We provide brand new, durable copies of the Holy Qur''an, Tajweed practice books, wooden book stands (rehal), and illuminated learning charts to ensure every student can memorize and recite with dignity.', 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80', '["Distribute 2,500+ copies of the Holy Qur''an to rural and community Madrasahs annually","Provide Tajweed learning aids and reference charts to enhance recitation quality","Facilitate conducive memorization environments for Tahfeez students"]', '["Qur''anic memorization (Tahfeez) students","Rural Madrasahs with limited learning resources","Vulnerable children eager to learn the Qur''an"]', '["Madrasah needs assessment across targeted communities","Bulk printing and procurement of durable Mushafs","Community distribution ceremonies and recitation workshops","Quarterly follow-up with teachers and administrators"]', 'active', 1, '2026-09-10 14:11:36', '2026-09-10 14:11:36');
INSERT INTO "programs" ("id", "category_id", "title", "slug", "short_description", "full_description", "image_url", "objectives", "target_beneficiaries", "activities", "status", "is_featured", "created_at", "updated_at") VALUES (2, 1, 'Books, School Supplies & Student Assistance', 'school-supplies-student-assistance', 'Supplying school backpacks, textbooks, exercise books, and writing materials to underprivileged pupils.', 'No child should be hindered from accessing foundational education due to the lack of notebooks, uniforms, or basic writing tools. Mariya Foundation''s Student Assistance initiative equips underprivileged children with essential educational toolkits containing durable backpacks, standard curriculum textbooks, notebooks, mathematical sets, and writing supplies.', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80', '["Prevent school dropouts caused by inability to afford basic learning supplies","Promote literacy and numeracy among vulnerable primary and junior secondary students","Encourage parents and guardians in low-income areas to keep children in school"]', '["Primary and secondary school pupils in low-income families","Orphans and vulnerable children (OVC)","Community primary schools lacking library and instructional materials"]', '["Identification and verification of students in urgent need","Assembly of comprehensive Back-to-School study kits","Direct distribution drives before each new academic term","Partnership with local school headteachers to track student retention"]', 'active', 1, '2026-09-10 14:11:36', '2026-09-10 14:11:36');
INSERT INTO "programs" ("id", "category_id", "title", "slug", "short_description", "full_description", "image_url", "objectives", "target_beneficiaries", "activities", "status", "is_featured", "created_at", "updated_at") VALUES (3, 1, 'Student Scholarships & Educational Grants', 'student-scholarships-educational-grants', 'Covering tuition, examination fees, and academic allowances for talented yet financially disadvantaged students.', 'This scholarship fund provides financial support to exceptional, determined students from low-income households who are at risk of abandoning their schooling due to unpaid tuition or examination registration fees. Through merit and need-based screening, Mariya Foundation covers tuition costs and provides a supportive mentorship circle.', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80', '["Sponsor tuition and external examination fees (e.g. WAEC, NECO, BECE, JAMB)","Provide academic mentorship, career counseling, and character development workshops","Nurture the next generation of ethical community leaders and scholars"]', '["High-performing secondary and tertiary students from impoverished backgrounds","Indigent students facing immediate eviction from examinations due to non-payment","Youth aspiring for higher education and vocational certification"]', '["Transparent application intake and community verification visits","Direct fee payment to accredited educational institutions","Biannual academic progress evaluation and mentor check-ins","Life skills and leadership retreat sessions"]', 'active', 0, '2026-09-10 14:11:36', '2026-09-10 14:11:36');
INSERT INTO "programs" ("id", "category_id", "title", "slug", "short_description", "full_description", "image_url", "objectives", "target_beneficiaries", "activities", "status", "is_featured", "created_at", "updated_at") VALUES (4, 2, 'Vocational Skills & Garment Making Academy', 'vocational-skills-garment-making-academy', 'Intensive 6-month hands-on fashion design, tailoring, and embroidery training with startup sewing equipment.', 'Our flagship vocational empowerment initiative equips women, widows, and unemployed youth with market-ready tailoring and garment construction skills. The curriculum spans cutting, pattern drafting, stitching, industrial machine maintenance, business bookkeeping, and customer relations. Upon graduation, each top-performing beneficiary receives a brand-new sewing machine and starter fabric package.', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80', '["Provide 100+ youth and women with accredited tailoring skills annually","Gift startup sewing machines and toolkits to graduating apprentices","Foster independent entrepreneurship and family financial resilience"]', '["Unemployed youth seeking trade skills","Widows and female household heads needing sustainable income","Out-of-school young adults looking for vocational dignity"]', '["Comprehensive 24-week practical classroom and workshop sessions","Business management, pricing, and digital marketing workshops","Final practical portfolio review and exhibition","Graduation tool handover and 12-month post-training business mentoring"]', 'active', 1, '2026-09-10 14:11:36', '2026-09-10 14:11:36');
INSERT INTO "programs" ("id", "category_id", "title", "slug", "short_description", "full_description", "image_url", "objectives", "target_beneficiaries", "activities", "status", "is_featured", "created_at", "updated_at") VALUES (5, 2, 'Youth Digital Skills & Tech Literacy Hub', 'youth-digital-skills-tech-literacy-hub', 'Practical training in computer literacy, graphic design, basic coding, and online freelance career fundamentals.', 'Bridging the digital divide for underprivileged youth by providing hands-on access to modern computers, internet connectivity, and structured training in office productivity suites, digital graphic design, content creation, and remote freelancing essentials. We empower youth to access global economic opportunities right from their local communities.', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80', '["Train 150+ youth annually in essential digital productivity and creative skills","Enable participants to earn income through local and remote freelancing","Provide open-access computer lab hours for student research and homework"]', '["Secondary school graduates unable to afford immediate university enrollment","Underemployed youth in semi-urban and rural areas","Aspiring young digital creators and small-business owners"]', '["Cohort-based 12-week practical computing curriculum","Hands-on portfolio creation (flyers, branding, spreadsheets, typing)","Freelance profile setup and ethical online commerce guidance","Internship matching with local businesses and nonprofit partners"]', 'active', 1, '2026-09-10 14:11:36', '2026-09-10 14:11:36');
INSERT INTO "programs" ("id", "category_id", "title", "slug", "short_description", "full_description", "image_url", "objectives", "target_beneficiaries", "activities", "status", "is_featured", "created_at", "updated_at") VALUES (6, 2, 'Small Business Seed Grants & Mentorship', 'small-business-seed-grants-mentorship', 'Micro-grants and financial literacy coaching for grassroots micro-entrepreneurs to expand petty trading.', 'To break the cycle of poverty and predatory loans, Mariya Foundation provides non-refundable micro-grants combined with mandatory financial literacy and inventory management coaching. Beneficiaries include market women, food vendors, and artisanal trade workers who need modest capital to stock goods, purchase essential tools, and build sustainable household livelihoods.', 'https://images.unsplash.com/photo-1556742049-0a67e5572246?auto=format&fit=crop&w=1200&q=80', '["Empower 200+ micro-merchants with seed capital injection","Teach basic bookkeeping, savings habits, and reinvestment strategies","Promote economic self-sufficiency rather than perpetual dependency"]', '["Petty traders, market stall owners, and street food processors","Women cooperative societies in rural market hubs","Families recovering from economic hardship or displacement"]', '["Business feasibility review and baseline income recording","Financial literacy bootcamps in local languages","Disbursement of seed grants directly into verified business activities","Monthly field advisor visits and peer savings group formation"]', 'active', 0, '2026-09-10 14:11:36', '2026-09-10 14:11:36');
INSERT INTO "programs" ("id", "category_id", "title", "slug", "short_description", "full_description", "image_url", "objectives", "target_beneficiaries", "activities", "status", "is_featured", "created_at", "updated_at") VALUES (7, 3, 'Clean Water Boreholes & Community Sanitation', 'clean-water-boreholes-sanitation', 'Solar-powered water boreholes providing safe drinking water to remote villages and learning institutions.', 'Access to clean water is a fundamental right. In remote communities where women and children walk several kilometers daily to fetch unsafe water, Mariya Foundation constructs deep, solar-powered boreholes equipped with overhead storage tanks, multiple dispensing taps, and community maintenance committees.', 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=1200&q=80', '["Eliminate waterborne diseases in underserved rural settlements","Save children and girls valuable study hours spent fetching water","Establish self-sustaining water caretaker committees in each village"]', '["Rural villages without municipal piped water","Public community schools and surrounding Madrasahs","Health clinics requiring hygienic running water"]', '["Hydrogeological surveying and community stakeholder consultations","Drilling, casing, solar pump installation, and water quality testing","Handover ceremony and establishment of village maintenance fund","Sanitation and hygiene awareness campaigns"]', 'active', 0, '2026-09-10 14:11:36', '2026-09-10 14:11:36');
INSERT INTO "programs" ("id", "category_id", "title", "slug", "short_description", "full_description", "image_url", "objectives", "target_beneficiaries", "activities", "status", "is_featured", "created_at", "updated_at") VALUES (8, 3, 'Ramadan & Emergency Food Relief Packs', 'ramadan-emergency-food-relief', 'Nutritional sustenance packages for vulnerable households, widows, and elders during times of urgent need.', 'During the holy month of Ramadan and during times of seasonal inflation or agricultural distress, Mariya Foundation distributes wholesome food parcels containing staples such as rice, beans, maize flour, cooking oil, dates, sugar, and milk. Each parcel sustains a vulnerable family of 6 for one full month.', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80', '["Relieve acute food insecurity for impoverished households","Provide dignity and peace of mind to elderly widows and orphans during Ramadan","Deliver swift response during seasonal food scarcity"]', '["Widow-headed households with minor children","Elderly community members with no family support","Low-income daily wage earners"]', '["Discreet household vulnerability mapping with community elders","Bulk food procurement and hygienic packaging","Door-to-door and organized center distributions","Nutrition counseling and post-distribution feedback collection"]', 'active', 0, '2026-09-10 14:11:36', '2026-09-10 14:11:36');

-- -----------------------------------------------------
-- Table: impact_stats
-- -----------------------------------------------------
CREATE TABLE impact_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      metric_key TEXT NOT NULL UNIQUE,
      label TEXT NOT NULL,
      value INTEGER NOT NULL,
      prefix TEXT DEFAULT '',
      suffix TEXT DEFAULT '+',
      description TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    );

INSERT INTO "impact_stats" ("id", "metric_key", "label", "value", "prefix", "suffix", "description", "display_order", "is_active") VALUES (1, 'qurans_distributed', 'Qur''ans Distributed', 3450, '', '+', 'Mushafs and Tajweed learning packages distributed across community Madrasahs', 1, 1);
INSERT INTO "impact_stats" ("id", "metric_key", "label", "value", "prefix", "suffix", "description", "display_order", "is_active") VALUES (2, 'students_supported', 'Students Supported', 1820, '', '+', 'Pupils provided with books, study kits, and educational assistance', 2, 1);
INSERT INTO "impact_stats" ("id", "metric_key", "label", "value", "prefix", "suffix", "description", "display_order", "is_active") VALUES (3, 'empowerment_graduates', 'Skills & Business Beneficiaries', 640, '', '+', 'Youth and women trained in vocational trades and supported with starter tools', 3, 1);
INSERT INTO "impact_stats" ("id", "metric_key", "label", "value", "prefix", "suffix", "description", "display_order", "is_active") VALUES (4, 'communities_reached', 'Communities Reached', 28, '', '', 'Towns and rural settlements benefiting from water, education, and welfare programs', 4, 1);

-- -----------------------------------------------------
-- Table: impact_stories
-- -----------------------------------------------------
CREATE TABLE impact_stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      beneficiary_name TEXT NOT NULL,
      category TEXT NOT NULL,
      before_situation TEXT,
      after_situation TEXT,
      quote TEXT,
      story_content TEXT NOT NULL,
      image_url TEXT,
      location TEXT,
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

INSERT INTO "impact_stories" ("id", "title", "beneficiary_name", "category", "before_situation", "after_situation", "quote", "story_content", "image_url", "location", "is_featured", "created_at") VALUES (1, 'From Struggle to a Thriving Fashion Workshop', 'Fatima Abubakar', 'Empowerment', 'Single mother of three with no steady income, struggling to pay children’s school fees.', 'Now runs an independent sewing enterprise, employing two apprentice girls and funding her children’s education comfortably.', 'Mariya Foundation did not just give me a sewing machine; they gave me dignity, financial independence, and hope for my children''s future.', 'Fatima joined the Mariya Foundation 6-Month Vocational Garment Making Academy with zero tailoring experience. Throughout the intensive program, she demonstrated exceptional dedication in mastering pattern drafting and machine operations. Upon graduation, she received an industrial sewing machine and basic startup fabric. Today, she runs a popular bridal tailoring shop in her neighborhood and trains other young women.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80', 'Zaria Community Hub', 1, '2026-09-10 14:11:36');
INSERT INTO "impact_stories" ("id", "title", "beneficiary_name", "category", "before_situation", "after_situation", "quote", "story_content", "image_url", "location", "is_featured", "created_at") VALUES (2, 'Memorizing the Noble Qur''an with Joy and Clarity', 'Ibrahim Danladi', 'Education', 'Studied in a rural Madrasah where four students had to share a single torn manuscript with missing pages.', 'Received his personal Tajweed Qur’an and audio review aids, successfully completing memorization of 15 Juz.', 'Holding my own brand new Qur''an for the first time gave me tears of joy. I can now study whenever I want without waiting for my turn.', 'In Ibrahim''s village Madrasah, learning the Qur''an was severely constrained by the lack of reading materials. Mariya Foundation''s educational support team supplied 150 copies of standard Tajweed Mushafs, sturdy wooden reading desks, and student writing tablets. Ibrahim excelled rapidly, becoming one of the top reciters in the inter-madrasah recitation competition.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', 'Kudendan Madrasah Centre', 1, '2026-09-10 14:11:36');
INSERT INTO "impact_stories" ("id", "title", "beneficiary_name", "category", "before_situation", "after_situation", "quote", "story_content", "image_url", "location", "is_featured", "created_at") VALUES (3, 'Expanding a Street Food Stand into a Clean Eatery', 'Zainab Bello', 'Empowerment', 'Cooked small batches of snacks over firewood with limited capital, vulnerable to market price hikes.', 'Received business coaching and a seed grant, enabling her to purchase a modern gas cooker and wholesale ingredients.', 'The business management coaching opened my eyes to proper daily bookkeeping. My daily revenue has doubled.', 'Zainab participated in Mariya Foundation''s Small Business Seed Grants bootcamp. She learned how to separate business capital from personal expenses, keep daily cash flow ledgers, and maintain food hygiene standards. With a modest seed grant, she purchased commercial cookware and wholesale grains, transforming her stall into a reputable local catering joint.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80', 'Sabon Gari Market', 1, '2026-09-10 14:11:36');

-- -----------------------------------------------------
-- Table: gallery
-- -----------------------------------------------------
CREATE TABLE gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL, -- Education, Quran, Empowerment, Community, Events
      caption TEXT,
      image_url TEXT NOT NULL,
      location TEXT,
      event_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

INSERT INTO "gallery" ("id", "title", "category", "caption", "image_url", "location", "event_date", "created_at") VALUES (1, 'Qur''an Distribution Ceremony', 'Quran', 'Students holding their newly received Tajweed copies of the Holy Qur''an with radiant smiles.', 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80', 'Community Central Madrasah', '2026-03-15', '2026-09-10 14:11:36');
INSERT INTO "gallery" ("id", "title", "category", "caption", "image_url", "location", "event_date", "created_at") VALUES (2, 'Back to School Study Packs Handover', 'Education', 'Primary pupils receiving backpacks containing notebooks, mathematical sets, and writing materials.', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80', 'Al-Huda Model Primary School', '2026-04-10', '2026-09-10 14:11:36');
INSERT INTO "gallery" ("id", "title", "category", "caption", "image_url", "location", "event_date", "created_at") VALUES (3, 'Fashion & Tailoring Apprenticeship Class', 'Empowerment', 'Beneficiaries practicing advanced garment cutting and sewing machine operation techniques.', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80', 'Mariya Vocational Centre', '2026-05-20', '2026-09-10 14:11:36');
INSERT INTO "gallery" ("id", "title", "category", "caption", "image_url", "location", "event_date", "created_at") VALUES (4, 'Digital Literacy Workshop for Youth', 'Empowerment', 'Young adults learning computer productivity tools, graphic design, and typing proficiency.', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80', 'Youth Tech Resource Lab', '2026-06-12', '2026-09-10 14:11:36');
INSERT INTO "gallery" ("id", "title", "category", "caption", "image_url", "location", "event_date", "created_at") VALUES (5, 'Solar Borehole Clean Water Commissioning', 'Community', 'Community elders and children celebrating clean drinking water access in their village.', 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=1200&q=80', 'Dan Mani Rural Settlement', '2026-07-04', '2026-09-10 14:11:36');
INSERT INTO "gallery" ("id", "title", "category", "caption", "image_url", "location", "event_date", "created_at") VALUES (6, 'Ramadan Food Parcel Distribution', 'Community', 'Distribution of essential nutritional food baskets to vulnerable families and widows.', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80', 'Mariya Foundation Relief Depot', '2026-02-28', '2026-09-10 14:11:36');
INSERT INTO "gallery" ("id", "title", "category", "caption", "image_url", "location", "event_date", "created_at") VALUES (7, 'Annual Volunteer Orientation Day', 'Events', 'Dedicated volunteers planning educational outreach campaigns and community field trips.', 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80', 'Foundation Main Hall', '2026-08-01', '2026-09-10 14:11:36');
INSERT INTO "gallery" ("id", "title", "category", "caption", "image_url", "location", "event_date", "created_at") VALUES (8, 'Small Business Grant Handover Ceremony', 'Empowerment', 'Market women and artisans receiving micro-capital certificates to expand their trade.', 'https://images.unsplash.com/photo-1556742049-0a67e5572246?auto=format&fit=crop&w=1200&q=80', 'Women Development Center', '2026-08-18', '2026-09-10 14:11:36');

-- -----------------------------------------------------
-- Table: news
-- -----------------------------------------------------
CREATE TABLE news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL, -- Announcements, Program Update, Success Story, Event
      author TEXT DEFAULT 'Mariya Foundation Team',
      featured_image TEXT,
      is_published INTEGER DEFAULT 1,
      published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

INSERT INTO "news" ("id", "title", "slug", "summary", "content", "category", "author", "featured_image", "is_published", "published_at", "created_at", "updated_at") VALUES (1, 'Mariya Foundation Launches 2026 Qur''an and Educational Support Campaign', 'mariya-foundation-launches-2026-quran-educational-campaign', 'A comprehensive initiative to provide 5,000 students across 40 community learning centers with Qur''ans, learning materials, and academic aid.', 'Mariya Foundation has officially launched its flagship 2026 Educational and Qur''anic Outreach Initiative. The campaign focuses on bridging the severe gap in instructional materials, Mushafs, and writing supplies experienced by community Madrasahs and public basic schools.

Speaking at the launch, the Foundation leadership reiterated our core commitment to nurturing intellectual, moral, and economic growth from the grassroots. "When we provide a child with a Qur''an to read and notebooks to write in, we are building the cornerstone of a righteous and self-sufficient society," the spokesperson noted.

The initiative encompasses three key components:
1. **Direct Mushaf Endowment:** Distributing durable, large-font Tajweed copies of the Holy Qur''an to students engaged in memorization.
2. **Back-to-School Kits:** Equipping indigent primary pupils with complete stationery packages to curtail school abandonment.
3. **Teacher Support Grants:** Providing honorarium stipends and classroom teaching resources to volunteer educators in underserved settlements.

Members of the public, philanthropists, and community supporters are warmly invited to partner with Mariya Foundation in expanding this noble endeavor.', 'Announcements', 'Mariya Foundation Secretariat', 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80', 1, '2026-08-10 09:00:00', '2026-09-10 14:11:36', '2026-09-10 14:11:36');
INSERT INTO "news" ("id", "title", "slug", "summary", "content", "category", "author", "featured_image", "is_published", "published_at", "created_at", "updated_at") VALUES (2, 'Graduation of the 4th Cohort of Vocational Tailoring and Business Apprentices', 'graduation-4th-cohort-vocational-tailoring', 'Forty young women and youth complete six months of rigorous fashion design and entrepreneurship training with startup equipment.', 'Forty enthusiastic beneficiaries from the Mariya Foundation Vocational Training Academy celebrated their official graduation ceremony today, marking the beginning of their journey as self-reliant business owners.

Over the past six months, students received intensive practical training in garment construction, embroidery, modern pattern design, customer handling, and financial literacy. Every graduate was awarded an industrial sewing machine, cutting shears, measuring tools, and a starter fabric bundle funded through generous foundation supporters.

"Before this training, I had no marketable skill and worried constantly about my family''s sustenance," shared Halima, one of the graduating students. "Today, I am proud to hold a recognized vocational certificate and my own sewing machine. I am ready to build my own fashion business."

The next cohort registration is set to open next month, with expanded slots for youth digital skills and artisanal trades.', 'Success Story', 'Vocational Training Department', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80', 1, '2026-08-25 14:30:00', '2026-09-10 14:11:36', '2026-09-10 14:11:36');
INSERT INTO "news" ("id", "title", "slug", "summary", "content", "category", "author", "featured_image", "is_published", "published_at", "created_at", "updated_at") VALUES (3, 'Community Outreach: Commissioning Safe Clean Water Point in Dan Mani', 'community-outreach-commissioning-clean-water-dan-mani', 'Over 800 residents and 3 local schools gain immediate access to clean potable water through a new solar-powered borehole.', 'Mariya Foundation is delighted to announce the successful drilling and commissioning of a deep solar-powered borehole in the Dan Mani rural community. 

For over a decade, residents, particularly women and school-age children, trekked over 3 kilometers each morning to fetch water from open streams, exposing them to waterborne illnesses and causing frequent school absenteeism.

The new facility features:
- A 120-meter deep high-yield borehole with stainless steel solar submersible pump
- 5,000-liter elevated storage tank system
- 8-point heavy-duty distribution tap stand
- A village water management committee trained in preventative maintenance

The village head expressed deep gratitude to Mariya Foundation and its generous donors, noting that the project has brought relief, health, and dignity to the entire locality.', 'Program Update', 'Community Development Team', 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=1200&q=80', 1, '2026-09-02 11:15:00', '2026-09-10 14:11:36', '2026-09-10 14:11:36');

-- -----------------------------------------------------
-- Table: testimonials
-- -----------------------------------------------------
CREATE TABLE testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role_title TEXT NOT NULL,
      location TEXT,
      content TEXT NOT NULL,
      avatar_url TEXT,
      rating INTEGER DEFAULT 5,
      is_published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

INSERT INTO "testimonials" ("id", "name", "role_title", "location", "content", "avatar_url", "rating", "is_published", "created_at") VALUES (1, 'Mallam Usman Ahmad', 'Head Teacher, Darul-Hikmah Madrasah', 'Rigasa District', 'Mariya Foundation''s intervention transformed our school. Our students no longer struggle with torn books. Every child now has their own Qur''an, and attendance has increased significantly.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80', 5, 1, '2026-09-10 14:11:36');
INSERT INTO "testimonials" ("id", "name", "role_title", "location", "content", "avatar_url", "rating", "is_published", "created_at") VALUES (2, 'Amina Lawal', 'Fashion Academy Graduate & Business Owner', 'Barnawa Hub', 'Learning tailoring with Mariya Foundation changed my life completely. I was gifted a brand new sewing machine and taught how to manage a business. Today, I am completely self-reliant.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', 5, 1, '2026-09-10 14:11:36');
INSERT INTO "testimonials" ("id", "name", "role_title", "location", "content", "avatar_url", "rating", "is_published", "created_at") VALUES (3, 'Dr. Aliyu Sanusi', 'Community Advocate & Volunteer Lead', 'Hayin Banki', 'What sets Mariya Foundation apart is their unwavering dedication to real sustainability. They don''t just distribute relief; they build self-reliance through education and vocational mastery.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80', 5, 1, '2026-09-10 14:11:36');

-- -----------------------------------------------------
-- Table: contact_messages
-- -----------------------------------------------------
CREATE TABLE contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      status TEXT DEFAULT 'pending', -- pending, reviewed, replied
      admin_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

-- -----------------------------------------------------
-- Table: volunteer_applications
-- -----------------------------------------------------
CREATE TABLE volunteer_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      location TEXT NOT NULL,
      skills TEXT NOT NULL,
      availability TEXT NOT NULL, -- Full-time, Part-time, Weekends, Remote
      area_of_interest TEXT NOT NULL, -- Teaching, Event Coordination, Logistics, Mentorship, Media
      motivation TEXT NOT NULL,
      status TEXT DEFAULT 'pending', -- pending, reviewed, shortlisted, accepted, contacted
      admin_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

-- -----------------------------------------------------
-- Table: program_applications
-- -----------------------------------------------------
CREATE TABLE program_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      program_id INTEGER,
      applicant_name TEXT NOT NULL,
      email TEXT,
      phone TEXT NOT NULL,
      age INTEGER,
      gender TEXT,
      address TEXT NOT NULL,
      occupation TEXT,
      statement_of_need TEXT NOT NULL,
      status TEXT DEFAULT 'pending', -- pending, reviewing, approved, rejected, enrolled
      admin_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE SET NULL
    );

-- -----------------------------------------------------
-- Table: donation_accounts
-- -----------------------------------------------------
CREATE TABLE donation_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bank_name TEXT NOT NULL,
      account_name TEXT NOT NULL,
      account_number TEXT NOT NULL,
      routing_or_iban TEXT,
      currency TEXT DEFAULT 'NGN',
      instructions TEXT,
      is_primary INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

INSERT INTO "donation_accounts" ("id", "bank_name", "account_name", "account_number", "routing_or_iban", "currency", "instructions", "is_primary", "is_active", "created_at") VALUES (1, 'Jaiz Bank Plc (Islamic Banking)', 'Mariya Foundation - General Charity & Operations', '0000000000 (Placeholder)', 'JAIZNGLA', 'NGN', 'For general charitable donations, Qur''an distribution, and student education support. Please use your name or phone number as narration.', 1, 1, '2026-09-10 14:11:36');
INSERT INTO "donation_accounts" ("id", "bank_name", "account_name", "account_number", "routing_or_iban", "currency", "instructions", "is_primary", "is_active", "created_at") VALUES (2, 'Stanbic IBTC Bank (Non-Interest Banking)', 'Mariya Foundation - Vocational & Youth Empowerment Fund', '1111111111 (Placeholder)', 'SBICNGLA', 'NGN', 'Designated strictly for vocational skills equipment, micro-business seed grants, and digital training labs.', 0, 1, '2026-09-10 14:11:36');
INSERT INTO "donation_accounts" ("id", "bank_name", "account_name", "account_number", "routing_or_iban", "currency", "instructions", "is_primary", "is_active", "created_at") VALUES (3, 'TAJBank Limited', 'Mariya Foundation - Education & Tahfeez Sponsorship', '2222222222 (Placeholder)', 'TAJBNGLA', 'NGN', 'Designated for Qur''an printing, student textbooks, and academic fee support.', 0, 1, '2026-09-10 14:11:36');

-- -----------------------------------------------------
-- Table: donation_pledges
-- -----------------------------------------------------
CREATE TABLE donation_pledges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      donor_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      purpose_category TEXT NOT NULL, -- Quran Distribution, Education Support, Skills Training, General Charity
      amount REAL,
      currency TEXT DEFAULT 'NGN',
      payment_method TEXT DEFAULT 'Bank Transfer',
      reference_no TEXT,
      status TEXT DEFAULT 'pledged', -- pledged, confirmed, verified
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

-- -----------------------------------------------------
-- Table: site_settings
-- -----------------------------------------------------
CREATE TABLE site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      group_name TEXT DEFAULT 'general'
    );

INSERT INTO "site_settings" ("key", "value", "group_name") VALUES ('org_name', 'Mariya Foundation', 'general');
INSERT INTO "site_settings" ("key", "value", "group_name") VALUES ('tagline', 'Empowering Communities, Nurturing Education & Building Self-Reliance', 'general');
INSERT INTO "site_settings" ("key", "value", "group_name") VALUES ('mission', 'To empower underserved individuals and communities to become economically and socially self-reliant, while facilitating holistic Qur’anic and formal education support for students in need.', 'about');
INSERT INTO "site_settings" ("key", "value", "group_name") VALUES ('vision', 'A resilient, ethical society where every individual has the educational opportunity, vocational dignity, and moral grounding to uplift themselves and their communities.', 'about');
INSERT INTO "site_settings" ("key", "value", "group_name") VALUES ('contact_phone', '+234 (0) 800 000 0000 (Placeholder)', 'contact');
INSERT INTO "site_settings" ("key", "value", "group_name") VALUES ('contact_email', 'info@mariyafoundation.org (Placeholder)', 'contact');
INSERT INTO "site_settings" ("key", "value", "group_name") VALUES ('contact_whatsapp', '+234 (0) 800 000 0000 (Placeholder)', 'contact');
INSERT INTO "site_settings" ("key", "value", "group_name") VALUES ('office_address', 'Plot 12, Community Development Crescent, Kaduna State, Nigeria (Placeholder)', 'contact');
INSERT INTO "site_settings" ("key", "value", "group_name") VALUES ('facebook_url', 'https://facebook.com/mariyafoundation', 'social');
INSERT INTO "site_settings" ("key", "value", "group_name") VALUES ('twitter_url', 'https://twitter.com/mariyafoundation', 'social');
INSERT INTO "site_settings" ("key", "value", "group_name") VALUES ('instagram_url', 'https://instagram.com/mariyafoundation', 'social');
INSERT INTO "site_settings" ("key", "value", "group_name") VALUES ('youtube_url', 'https://youtube.com/mariyafoundation', 'social');
INSERT INTO "site_settings" ("key", "value", "group_name") VALUES ('paystack_enabled', 'false', 'payments');
INSERT INTO "site_settings" ("key", "value", "group_name") VALUES ('paystack_public_key', 'pk_test_placeholder_key_for_mariya_foundation', 'payments');

PRAGMA foreign_keys = ON;
