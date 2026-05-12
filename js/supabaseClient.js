(function () {
  // Configure these values with your Supabase project.
  // You can either replace the defaults below or define
  // window.SUPABASE_URL and window.SUPABASE_ANON_KEY before this file loads.
  const DEFAULT_URL = 'https://jnsejkjbuzincgbwqnuz.supabase.co';
  const DEFAULT_KEY = 'sb_publishable_YUXzjYDWVYfnYm_btauVaA_VOaOepfh';
  const SUPABASE_URL = window.SUPABASE_URL || DEFAULT_URL;
  const SUPABASE_PUBLISHABLE_KEY = window.SUPABASE_PUBLISHABLE_KEY || window.SUPABASE_ANON_KEY || DEFAULT_KEY;

  const isConfigured =
    SUPABASE_URL &&
    SUPABASE_PUBLISHABLE_KEY &&
    !SUPABASE_URL.includes('YOUR_') &&
    !SUPABASE_PUBLISHABLE_KEY.includes('YOUR_');

  window.eReklamoSupabaseConfig = {
    isConfigured,
    url: SUPABASE_URL,
  };

  window.eReklamoDb =
    isConfigured && window.supabase
      ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
      : null;
})();
