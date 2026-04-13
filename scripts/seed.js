/**
 * Seed script — creates sample data for development.
 * Usage: cd backend && node ../scripts/seed.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', 'backend', '.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function seed() {
    console.log('🌱 Seeding database...\n');

    // Check connection
    const { error: testErr } = await supabase.from('projects').select('id').limit(1);
    if (testErr) {
        console.error('❌ Cannot connect to Supabase:', testErr.message);
        console.log('\n💡 Make sure to:');
        console.log('   1. Create a Supabase project at https://supabase.com');
        console.log('   2. Run scripts/setup-db.sql in the SQL Editor');
        console.log('   3. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env');
        process.exit(1);
    }

    // Create a demo project (requires an existing user)
    console.log('ℹ️  To seed data, you need at least one user.');
    console.log('   Sign up through the app first, then run this script.\n');

    const { data: profiles } = await supabase.from('profiles').select('id').limit(1);
    if (!profiles || profiles.length === 0) {
        console.log('⚠️  No users found. Sign up first, then re-run.');
        process.exit(0);
    }

    const ownerId = profiles[0].id;

    // Create project
    const { data: project, error: projErr } = await supabase
        .from('projects')
        .insert({
            name: 'Demo: E-Commerce Platform',
            description: 'A full-stack e-commerce app built collaboratively with AI tools.',
            owner_id: ownerId,
            status: 'active',
        })
        .select()
        .single();

    if (projErr) {
        console.error('❌ Failed to create project:', projErr.message);
        process.exit(1);
    }
    console.log(`✅ Created project: ${project.name} (${project.id})`);

    // Create modules
    const moduleTypes = ['frontend', 'backend', 'authentication', 'database', 'integrations'];
    const modules = moduleTypes.map((type, i) => ({
        project_id: project.id,
        type,
        status: i === 0 ? 'in_progress' : 'unassigned',
        assigned_to: i === 0 ? ownerId : null,
    }));

    const { error: modErr } = await supabase.from('modules').insert(modules);
    if (modErr) {
        console.error('❌ Failed to create modules:', modErr.message);
        process.exit(1);
    }
    console.log(`✅ Created ${modules.length} modules`);

    console.log('\n🎉 Seed complete!');
    console.log(`   Open the app and navigate to your dashboard to see the project.`);
}

seed().catch(console.error);
