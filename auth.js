import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '/config.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function signUp(email, password, username, displayName, captchaToken) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            captchaToken: captchaToken,
            data: {
                username: username,
                display_name: displayName,
                registration_ip: '(IP will be captured server-side)'
            }
        }
    });
    return { data, error };
}

export async function signIn(email, password, captchaToken) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
        options: {
            captchaToken: captchaToken,
        }
    });
    return { data, error };
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
}

export async function getCurrentUser() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
        console.error("Error getting session:", error);
        return null;
    }
    if (!session || !session.user) {
        return null;
    }
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

    if (profileError) {
        console.error("Error fetching profile:", profileError);
        return session.user;
    }

    return { ...session.user, profile };
}

export function onAuthStateChange(callback) {
    supabase.auth.onAuthStateChanged((event, session) => {
        callback(event, session);
    });
}
