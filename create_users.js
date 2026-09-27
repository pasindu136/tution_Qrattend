const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUsers() {
  // Create Teacher
  const { data: teacher, error: tError } = await supabase.auth.signUp({
    email: 'teacher@edu.com',
    password: 'password123',
    options: { data: { role: 'teacher', name: 'Asanka Sir' } }
  });

  if (tError) console.error("Teacher Error:", tError.message);
  else console.log("Teacher signed up!");

  // Create Admin
  const { data: admin, error: aError } = await supabase.auth.signUp({
    email: 'admin@edu.com',
    password: 'adminpassword123',
    options: { data: { role: 'admin', name: 'Super Admin' } }
  });

  if (aError) console.error("Admin Error:", aError.message);
  else console.log("Admin signed up!");
}

createUsers();
