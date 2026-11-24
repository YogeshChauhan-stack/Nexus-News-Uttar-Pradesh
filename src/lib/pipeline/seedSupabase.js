// Seed script to migrate all local articles and jobs to Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../../../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = val;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const dbFile = path.join(__dirname, '../../../data/db.json');
  if (!fs.existsSync(dbFile)) {
    console.error('data/db.json not found');
    return;
  }

  const raw = fs.readFileSync(dbFile, 'utf-8');
  const data = JSON.parse(raw);

  console.log(`Found ${data.categories?.length || 0} categories, ${data.articles?.length || 0} articles, ${data.jobs?.length || 0} jobs.`);

  // 1. Seed Categories
  if (data.categories && data.categories.length > 0) {
    const { error: catErr } = await supabase.from('categories').upsert(
      data.categories.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || '',
      })),
      { onConflict: 'id' }
    );
    if (catErr) console.warn('Categories error:', catErr.message);
    else console.log('✓ Categories synced to Supabase');
  }

  // 2. Seed Jobs
  if (data.jobs && data.jobs.length > 0) {
    const { error: jobErr } = await supabase.from('jobs').upsert(
      data.jobs.map(j => ({
        id: j.id,
        title: j.title,
        organization: j.organization,
        total_posts: j.totalPosts || 0,
        region_type: j.regionType,
        qualification: j.qualification,
        age_limit: j.ageLimit,
        last_date: j.lastDate,
        salary: j.salary || '',
        apply_url: j.applyUrl || '',
        location: j.location,
        category: j.category || '',
        status: j.status || 'ACTIVE',
        is_featured: Boolean(j.isFeatured),
      })),
      { onConflict: 'id' }
    );
    if (jobErr) console.warn('Jobs error:', jobErr.message);
    else console.log('✓ Jobs synced to Supabase');
  }

  // 3. Seed Articles (in batches of 20)
  if (data.articles && data.articles.length > 0) {
    let successCount = 0;
    const batchSize = 20;
    for (let i = 0; i < data.articles.length; i += batchSize) {
      const batch = data.articles.slice(i, i + batchSize).map(a => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        summary: a.summary || '',
        content: a.content || '',
        featured_image: a.featuredImage || '',
        source_type: a.sourceType || 'MANUAL',
        source_name: a.sourceName || 'Nexus News UP',
        external_url: a.externalUrl || '',
        status: a.status || 'PUBLISHED',
        is_breaking: Boolean(a.isBreaking),
        is_featured: Boolean(a.isFeatured),
        district: a.district || null,
        pointers: a.pointers || [],
        views_count: a.viewsCount || 0,
        category_id: a.categoryId || 'cat-up',
        tags: a.tags || [],
        published_at: a.publishedAt || new Date().toISOString(),
        created_at: a.createdAt || new Date().toISOString(),
      }));

      const { error: artErr } = await supabase.from('articles').upsert(batch, { onConflict: 'slug' });
      if (artErr) {
        console.warn(`Batch ${i}-${i + batchSize} error:`, artErr.message);
      } else {
        successCount += batch.length;
      }
    }
    console.log(`✓ ${successCount} articles synced to Supabase`);
  }
}

seed().catch(console.error);
