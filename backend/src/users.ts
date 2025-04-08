import { config } from "dotenv";
config(); // load variables from your .env file

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL or Key is not defined in the environment variables.");
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function SignupUser(email: string, password: string) {
    let { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      })
    if (error) {
        throw new Error(`Error signing up: ${error.message}`);
    } else {
        return { message: "User signed up successfully", data };
    }
}

export { supabase, SignupUser };