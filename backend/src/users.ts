import * as dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL or Key is not defined in the environment variables.");
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function SignupUser(email: string, password: string, first_name: string, last_name: string, role: string) {
    let { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: first_name,
                last_name: last_name,
                occupation: role,
            }
        }
    })
    console.log("data", data)
    console.log("error", error)
    if (error) {
        throw new Error(`Error signing up: ${error.message}`);
    } else {
        return { message: "User signed up successfully", data };
    }
}
async function LoginUser(email: string, password: string) {
    let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    console.log("data", data)
    console.log("error", error)
    if (error) {
        throw new Error(`Error Logging in: ${error.message}`);
    } else {
        return { message: "User logged in successfully", data };
    }
}



async function CanResetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `http://localhost:3000/reset-password?email=${encodeURIComponent(email)}`,
    });
    if (error) {
        throw new Error(`Password reset failed: ${error.message}`);
    }
    return { message: 'Password reset email sent', data };
}

async function ChangePassword(email:string, newPassword:string){
    const { data, error } = await supabase.auth.updateUser({
        email: email,
        password: newPassword,
      })
      if (error) {
        // error.message already has Supabase’s description
        throw new Error(`Password change failed: ${error.message}`)
      }
      return { message: 'Password change sucess', data }
}


export { supabase, SignupUser ,CanResetPassword, LoginUser, ChangePassword};