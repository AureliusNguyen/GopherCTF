// pnpm db:seed

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create categories
  const categories = [
    { name: 'Web', color: '#3b82f6' },
    { name: 'Crypto', color: '#8b5cf6' },
    { name: 'Forensics', color: '#10b981' },
    { name: 'Pwn', color: '#ef4444' },
    { name: 'Reversing', color: '#f59e0b' },
    { name: 'Misc', color: '#6366f1' },
  ];

  console.log('Creating categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // Get created categories
  const webCat = await prisma.category.findUnique({ where: { name: 'Web' } });
  const cryptoCat = await prisma.category.findUnique({ where: { name: 'Crypto' } });
  const forensicsCat = await prisma.category.findUnique({ where: { name: 'Forensics' } });
  const pwnCat = await prisma.category.findUnique({ where: { name: 'Pwn' } });
  const reversingCat = await prisma.category.findUnique({ where: { name: 'Reversing' } });
  const miscCat = await prisma.category.findUnique({ where: { name: 'Misc' } });
  const osintCat = await prisma.category.findUnique({ where: { name: 'OSINT' } });
  const mlaiCat = await prisma.category.findUnique({ where: { name: 'ML/AI' } });

  if (!webCat || !cryptoCat || !forensicsCat || !pwnCat || !reversingCat || !miscCat || !osintCat || !mlaiCat) {
    throw new Error('Failed to create categories');
  }

  console.log('Creating challenges...');

  // Sample challenges
  const challenges: Array<{
    title: string;
    description: string;
    flag: string;
    basePoints: number;
    minPoints: number;
    difficulty: string;
    categoryId: string;
    visible: boolean;
    files?: string | null;
  }> = [
    {
      title: 'Easy Peasy SQL',
      description: 'A simple login page with SQL injection vulnerability.\n\nURL: http://example.com/login\n\nCan you bypass the authentication?',
      flag: 'gopher{sql_1nj3ct10n_1s_ez}',
      basePoints: 100,
      minPoints: 25,
      difficulty: 'easy',
      categoryId: webCat.id,
      visible: true,
    },
    {
      title: 'Cookie Monster',
      description: 'This website stores sensitive information in cookies. Can you find the admin\'s secret?\n\nURL: http://example.com/cookies',
      flag: 'gopher{c00k13s_ar3_d3l1c10us}',
      basePoints: 150,
      minPoints: 50,
      difficulty: 'easy',
      categoryId: webCat.id,
      visible: true,
    },
    {
      title: 'XSS Playground',
      description: 'Find and exploit an XSS vulnerability in this comment system.\n\nURL: http://example.com/comments\n\nHint: Try different input fields!',
      flag: 'gopher{xss_ftw_2024}',
      basePoints: 200,
      minPoints: 75,
      difficulty: 'medium',
      categoryId: webCat.id,
      visible: true,
    },
    {
      title: 'Caesar Salad',
      description: 'This message was encrypted with a simple cipher:\n\nGmdjw{fdhvdu_flskhu_lv_wrr_hdvb}\n\nCan you decrypt it?',
      flag: 'gopher{caesar_cipher_is_too_easy}',
      basePoints: 100,
      minPoints: 25,
      difficulty: 'easy',
      categoryId: cryptoCat.id,
      visible: true,
    },
    {
      title: 'Base What?',
      description: 'Decode this message:\n\nWm14bmUzSmhjM0JsY25SZlpXNWpiMlJsY2w5d2Nsd289\n\nHint: Multiple encodings might be used...',
      flag: 'gopher{base64_expert_pro}',
      basePoints: 150,
      minPoints: 50,
      difficulty: 'easy',
      categoryId: cryptoCat.id,
      visible: true,
    },
    {
      title: 'RSA Baby',
      description: 'Decrypt this RSA encrypted message:\n\nn = 143\ne = 7\nc = 78\n\nThe flag format is gopher{decrypted_number}',
      flag: 'gopher{42}',
      basePoints: 250,
      minPoints: 100,
      difficulty: 'medium',
      categoryId: cryptoCat.id,
      visible: true,
    },
    {
      title: 'Hidden in Plain Sight',
      description: 'We found this image on a suspect\'s computer. Can you find what\'s hidden inside?\n\n[Download: mystery.png]\n\nHint: Check the metadata and use steganography tools.',
      flag: 'gopher{st3g4n0gr4phy_m4st3r}',
      basePoints: 200,
      minPoints: 75,
      difficulty: 'medium',
      categoryId: forensicsCat.id,
      visible: true,
    },
    {
      title: 'Network Traffic',
      description: 'Analyze this packet capture to find the flag.\n\n[Download: capture.pcap]\n\nThe flag was transmitted in plaintext!',
      flag: 'gopher{w1r3sh4rk_4n4lyst}',
      basePoints: 300,
      minPoints: 100,
      difficulty: 'medium',
      categoryId: forensicsCat.id,
      visible: true,
    },
    {
      title: 'Buffer Overflow 101',
      description: 'Exploit this vulnerable C program to get shell access.\n\n[Download: vuln.c, vuln.bin]\n\nServer: nc example.com 1337',
      flag: 'gopher{buff3r_0v3rfl0w_pwn3d}',
      basePoints: 400,
      minPoints: 150,
      difficulty: 'hard',
      categoryId: pwnCat.id,
      visible: true,
    },
    {
      title: 'ROP Chain',
      description: 'This binary has NX enabled. Build a ROP chain to exploit it.\n\n[Download: rop_me.bin]\n\nServer: nc example.com 1338',
      flag: 'gopher{r0p_ch41n_m4st3r}',
      basePoints: 500,
      minPoints: 200,
      difficulty: 'hard',
      categoryId: pwnCat.id,
      visible: true,
    },
    {
      title: 'Reverse Me',
      description: 'This program checks if your input is correct. Find the valid input!\n\n[Download: check_password.exe]\n\nHint: Use a debugger or disassembler.',
      flag: 'gopher{r3v3rs3_3ng1n33r}',
      basePoints: 250,
      minPoints: 100,
      difficulty: 'medium',
      categoryId: reversingCat.id,
      visible: true,
    },
    {
      title: 'Obfuscated',
      description: 'This JavaScript code is heavily obfuscated. Deobfuscate it to find the flag.\n\n[Download: obfuscated.js]',
      flag: 'gopher{d30bfusc4t3d}',
      basePoints: 300,
      minPoints: 100,
      difficulty: 'hard',
      categoryId: reversingCat.id,
      visible: true,
    },
    {
      title: 'Sanity Check',
      description: 'Welcome to the CTF! Join our Discord server to get the flag.\n\nDiscord: discord.gg/ctfplatform',
      flag: 'gopher{w3lc0m3_t0_ctf}',
      basePoints: 50,
      minPoints: 50,
      difficulty: 'easy',
      categoryId: miscCat.id,
      visible: true,
    },
    {
      title: 'Photo Location',
      description: 'Find where this photo was taken using OSINT techniques.\n\n[Download: location.jpg]\n\nThe flag format is gopher{city_country} (lowercase, underscore separated)',
      flag: 'gopher{paris_france}',
      basePoints: 200,
      minPoints: 75,
      difficulty: 'medium',
      categoryId: osintCat.id,
      visible: true,
    },
    {
      title: 'Social Media Hunt',
      description: 'We have a username: @ctf_player_2024. Find their real identity and location.\n\nThe flag format is gopher{firstname_lastname_city}',
      flag: 'gopher{john_smith_london}',
      basePoints: 250,
      minPoints: 100,
      difficulty: 'medium',
      categoryId: osintCat.id,
      visible: true,
    },
    {
      title: 'Email Investigation',
      description: 'We intercepted this email address: secret.agent@domain.com\n\nFind out what services this email is registered to and discover the hidden flag.\n\nHint: Check data breaches and account verification sites.',
      flag: 'gopher{0s1nt_m4st3r_2024}',
      basePoints: 300,
      minPoints: 100,
      difficulty: 'hard',
      categoryId: osintCat.id,
      visible: true,
    },
    {
      title: 'AI Model Extraction',
      description: 'We trained a simple neural network and deployed it as an API. Can you extract the model weights?\n\nAPI: http://example.com/predict\n\nThe flag is hidden in the weights.',
      flag: 'gopher{m0d3l_3xtr4ct3d}',
      basePoints: 400,
      minPoints: 150,
      difficulty: 'hard',
      categoryId: mlaiCat.id,
      visible: true,
    },
    {
      title: 'Prompt Injection',
      description: 'Chat with our AI assistant to get the secret flag.\n\nURL: http://example.com/ai-chat\n\nHint: The AI has been instructed not to reveal the flag... but can you trick it?',
      flag: 'gopher{pr0mpt_1nj3ct10n_pwn}',
      basePoints: 250,
      minPoints: 100,
      difficulty: 'medium',
      categoryId: mlaiCat.id,
      visible: true,
    },
    {
      title: 'Image Classifier Adversarial Attack',
      description: 'Our image classifier is very confident. Can you create an adversarial example that fools it?\n\n[Download: classifier.py, test_image.png]\n\nThe flag will be revealed when you successfully misclassify the image.',
      flag: 'gopher{4dv3rs4r14l_4tt4ck}',
      basePoints: 350,
      minPoints: 125,
      difficulty: 'hard',
      categoryId: mlaiCat.id,
      visible: true,
    },
  ];

  // Upsert challenges - update existing or create new ones
  for (const challenge of challenges) {
    await prisma.challenge.upsert({
      where: { title: challenge.title },
      update: {
        description: challenge.description,
        flag: challenge.flag,
        basePoints: challenge.basePoints,
        minPoints: challenge.minPoints,
        difficulty: challenge.difficulty,
        categoryId: challenge.categoryId,
        visible: challenge.visible,
        files: challenge.files || null,
      },
      create: challenge,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Synced ${categories.length} categories and ${challenges.length} challenges`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });