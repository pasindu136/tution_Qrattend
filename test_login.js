const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'demo@tutorspace.com',
    password: 'admin123',
  });

  if (error) {
    console.error("Login Error:", error.message);
  } else {
    console.log("Login Success!", data.user.email);
  }
}

testLogin();
