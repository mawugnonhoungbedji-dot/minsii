import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kkhmrgpyjprhmiunvcvi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtraG1yZ3B5anByaG1pdW52Y3ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjU3ODAsImV4cCI6MjA4OTk0MTc4MH0.vSqblv3d2k_PXO5iiQFLXGJer3Y5qWbv8sNMZUx9_W0';

const supabase = createClient(supabaseUrl, supabaseKey);

const accounts = [
    {
        email: 'teacher@minsii.com',
        password: 'Password123!',
        name: 'Professeur Minsii',
        role: 'teacher',
        metadata: {
            experience_years: 5,
            hourly_rate: 5000,
            subjects: ['Mathématiques', 'SVT'],
            teaching_philosophy: 'Je crois en une éducation accessible et passionnante pour tous les élèves.',
            phone_number: '+229 61000000'
        }
    },
    {
        email: 'parent@minsii.com',
        password: 'Password123!',
        name: 'Parent Minsii',
        role: 'student',
        metadata: {
            level: 'Terminale D',
            goals: 'Réussite au BAC',
            budget: 5000
        }
    },
    {
        email: 'admin@minsii.com',
        password: 'Password123!',
        name: 'Admin Minsii',
        role: 'admin',
        metadata: {}
    }
];

async function seed() {
    console.log('--- Starting Seed ---');
    for (const account of accounts) {
        console.log(`Checking/Creating user: ${account.email}...`);
        
        // We use signUp but we don't care if they already exist (it will return an error but we move on)
        const { data, error } = await supabase.auth.signUp({
            email: account.email,
            password: account.password,
            options: {
                data: {
                    name: account.name,
                    role: account.role,
                    ...account.metadata
                }
            }
        });

        if (error) {
            console.log(`User ${account.email} might already exist or error: ${error.message}`);
        } else {
            console.log(`Successfully created ${account.email}. ID: ${data.user?.id}`);
        }
    }
    console.log('--- Seed Completed ---');
}

seed();
