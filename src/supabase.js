import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tqaxijwvmnodzrahakxt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxYXhpand2bW5vZHpyYWhha3h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODE5NTAsImV4cCI6MjA4MjU1Nzk1MH0.8bBT0NnVZ6dqY4EtqTjOB-9FXwe2df18SerSxOl-5ok";

export const supabase = createClient(supabaseUrl, supabaseKey);
