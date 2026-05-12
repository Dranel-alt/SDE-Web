(function () {
  const STORAGE = {
    complaints: 'ereklamo_complaints',
    user: 'user',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
  };

  const STATUS_STEPS = ['submitted', 'under_review', 'assigned', 'in_progress', 'resolved'];
  const STATUS_LABELS = {
    submitted: 'Submitted',
    pending_review: 'Submitted',
    under_review: 'Under review',
    assigned: 'Assigned',
    in_progress: 'In progress',
    resolved: 'Resolved',
    closed: 'Closed',
  };
  const STATUS_PROGRESS = {
    submitted: 20,
    pending_review: 20,
    under_review: 40,
    assigned: 55,
    in_progress: 75,
    resolved: 100,
    closed: 100,
  };
  const DEMO_USERS = {
    'resident@example.com': {
      id: 'demo-resident',
      email: 'resident@example.com',
      password: 'password123',
      role: 'resident',
      fullName: 'Demo Resident',
    },
    'official@example.com': {
      id: 'demo-official',
      email: 'official@example.com',
      password: 'official123',
      role: 'official',
      fullName: 'Demo Official',
    },
  };

  function db() {
    return window.eReklamoDb || null;
  }

  function isSupabaseReady() {
    return Boolean(db());
  }

  function normalizeRole(role) {
    if (role === 'admin' || role === 'official') return role;
    return 'resident';
  }

  function userDisplayName(user) {
    return user?.fullName || user?.full_name || user?.email || 'User';
  }

  function getLocalUser() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE.user) || 'null');
    } catch {
      return null;
    }
  }

  function setLocalSession(sessionUser, tokens = {}) {
    localStorage.setItem(STORAGE.user, JSON.stringify(sessionUser));
    if (tokens.accessToken) localStorage.setItem(STORAGE.accessToken, tokens.accessToken);
    if (tokens.refreshToken) localStorage.setItem(STORAGE.refreshToken, tokens.refreshToken);
  }

  async function getProfile(authUser) {
    if (!isSupabaseReady() || !authUser?.id) return null;

    const { data, error } = await db()
      .from('profiles')
      .select('id, full_name, role')
      .eq('id', authUser.id)
      .maybeSingle();

    if (error) {
      console.warn('Profile lookup failed:', error.message);
      return null;
    }

    return data;
  }

  async function saveSupabaseSession(data) {
    const authUser = data?.session?.user;
    if (!authUser) return null;

    const profile = await getProfile(authUser);
    const sessionUser = {
      id: authUser.id,
      email: authUser.email,
      role: normalizeRole(profile?.role || authUser.user_metadata?.role || authUser.app_metadata?.role),
      fullName: profile?.full_name || authUser.user_metadata?.full_name || authUser.email,
    };

    setLocalSession(sessionUser, {
      accessToken: data?.session?.access_token || authUser.id,
      refreshToken: data?.session?.refresh_token || '',
    });

    return sessionUser;
  }

  async function currentUser() {
    if (isSupabaseReady()) {
      const { data, error } = await db().auth.getSession();
      if (!error && data?.session?.user) {
        return saveSupabaseSession(data);
      }
    }

    return getLocalUser();
  }

  async function signIn(email, password) {
    if (isSupabaseReady()) {
      const { data, error } = await db().auth.signInWithPassword({ email, password });
      if (error) throw error;
      return saveSupabaseSession(data);
    }

    const demo = DEMO_USERS[email.toLowerCase()];
    if (!demo || demo.password !== password) {
      throw new Error(
        'Supabase is not configured. Local demo auth is active, and only demo credentials work. ' +
        'Use resident@example.com / password123 or configure Supabase in js/supabaseConfig.js.'
      );
    }

    const sessionUser = {
      id: demo.id,
      email: demo.email,
      role: demo.role,
      fullName: demo.fullName,
    };
    setLocalSession(sessionUser, {
      accessToken: `demo-token-${demo.role}`,
      refreshToken: `demo-refresh-${demo.role}`,
    });
    return sessionUser;
  }

  async function signUp(email, password, fullName, role = 'resident') {
    if (isSupabaseReady()) {
      const { data, error } = await db().auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: normalizeRole(role),
          },
        },
      });
      if (error) throw error;

      if (data?.session?.user) {
        await saveSupabaseSession(data);
        return data;
      }

      if (data?.user) {
        const { data: signinData, error: signinError } = await db().auth.signInWithPassword({ email, password });
        if (!signinError && signinData?.session?.user) {
          await saveSupabaseSession(signinData);
          return signinData;
        }
      }

      return data;
    }

    throw new Error(
      'Supabase is not configured. Signup cannot save to the database until you set your Supabase URL and anon key in js/supabaseConfig.js.'
    );
  }

  async function signOut() {
    if (isSupabaseReady()) {
      await db().auth.signOut();
    }
    localStorage.removeItem(STORAGE.accessToken);
    localStorage.removeItem(STORAGE.refreshToken);
    localStorage.removeItem(STORAGE.user);
  }

  function roleHome(role) {
    if (role === 'admin' || role === 'official') return 'official-dashboard.html';
    return 'resident-dashboard.html';
  }

  async function requireAuth(options = {}) {
    const user = await currentUser();
    const roles = options.roles || [];
    const base = window.location.pathname.includes('/pages/') ? '' : 'pages/';
    const loginPath = `${base}login-resident.html`;

    if (!user) {
      window.location.href = loginPath;
      return null;
    }

    if (roles.length && !roles.includes(user.role)) {
      window.location.href = `${base}${roleHome(user.role)}`;
      return null;
    }

    return user;
  }

  function readLocalComplaints() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE.complaints) || '[]').map(normalizeComplaint);
    } catch {
      return [];
    }
  }

  function writeLocalComplaints(complaints) {
    localStorage.setItem(STORAGE.complaints, JSON.stringify(complaints));
  }

  function generateReferenceNo() {
    const year = new Date().getFullYear();
    const random = Math.random().toString(16).slice(2, 8).toUpperCase().padEnd(6, '0');
    return `CMP-${year}-${random}`;
  }

  function normalizeComplaint(row) {
    const status = row.status || 'submitted';
    const createdAt = row.created_at || row.dateRaw || row.createdAt || new Date().toISOString();
    return {
      id: row.reference_no || row.id || generateReferenceNo(),
      rowId: row.id || null,
      referenceNo: row.reference_no || row.referenceNo || row.id || generateReferenceNo(),
      residentId: row.resident_id || row.residentId || row.userId || null,
      firstName: row.first_name || row.firstName || '',
      lastName: row.last_name || row.lastName || '',
      fullName: row.full_name || row.fullName || `${row.firstName || ''} ${row.lastName || ''}`.trim(),
      email: row.email || '',
      phone: row.phone || '',
      address: row.address || '',
      category: row.category || '',
      subject: row.subject || '',
      description: row.description || '',
      location: row.location || '',
      urgency: row.urgency || 'medium',
      status,
      assignedDepartment: row.assigned_department || row.assignedDepartment || '',
      internalNotes: row.internal_notes || row.internalNotes || '',
      attachments: row.attachments || [],
      history: row.history || [],
      dateRaw: createdAt,
      date: new Date(createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      progress: STATUS_PROGRESS[status] || 20,
    };
  }

  function toSupabaseComplaint(input, user) {
    return {
      reference_no: input.referenceNo,
      resident_id: user?.id || null,
      first_name: input.firstName,
      last_name: input.lastName,
      full_name: input.fullName || `${input.firstName} ${input.lastName}`.trim(),
      email: input.email,
      phone: input.phone,
      address: input.address,
      category: input.category,
      subject: input.subject,
      description: input.description,
      location: input.location,
      urgency: input.urgency,
      status: input.status || 'submitted',
      attachments: input.attachments || [],
    };
  }

  async function createComplaint(input) {
    const user = await currentUser();
    const referenceNo = input.referenceNo || generateReferenceNo();
    const now = new Date().toISOString();
    const complaint = normalizeComplaint({
      ...input,
      referenceNo,
      reference_no: referenceNo,
      status: 'submitted',
      residentId: user?.id || null,
      created_at: now,
      history: [
        {
          status: 'submitted',
          note: 'Complaint submitted',
          actor: user?.email || input.email || 'resident',
          created_at: now,
        },
      ],
    });

    if (isSupabaseReady()) {
      const { data, error } = await db()
        .from('complaints')
        .insert(toSupabaseComplaint(complaint, user))
        .select('*')
        .single();

      if (error) throw error;

      await db().from('complaint_status_events').insert({
        complaint_id: data.id,
        status: 'submitted',
        note: 'Complaint submitted',
        changed_by: user?.id || null,
      });

      return normalizeComplaint(data);
    }

    const list = readLocalComplaints();
    list.unshift(complaint);
    writeLocalComplaints(list);
    return complaint;
  }

  async function listComplaints(options = {}) {
    const user = await currentUser();
    const limit = options.limit || 25;
    const page = options.page || 0;
    const search = (options.search || '').trim();

    if (isSupabaseReady()) {
      let query = db()
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false })
        .range(page * limit, page * limit + limit - 1);

      if (options.mine && user?.id) query = query.eq('resident_id', user.id);
      if (options.status) query = query.eq('status', options.status);
      if (search) query = query.or(`reference_no.ilike.%${search}%,subject.ilike.%${search}%,category.ilike.%${search}%`);

      const { data, error } = await query;
      if (error) throw error;
      const historyByComplaint = await fetchComplaintHistory(data || []);
      return (data || []).map((row) => normalizeComplaint({
        ...row,
        history: historyByComplaint[row.id] || [],
      }));
    }

    let list = readLocalComplaints();
    if (options.mine && user?.email) {
      list = list.filter((item) => item.email === user.email || item.residentId === user.id);
    }
    if (options.status) list = list.filter((item) => item.status === options.status);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((item) =>
        [item.referenceNo, item.subject, item.category, item.email].some((value) =>
          String(value || '').toLowerCase().includes(q),
        ),
      );
    }
    return list.slice(page * limit, page * limit + limit);
  }

  async function trackComplaints(query) {
    const value = query.trim();
    if (!value) return [];

    if (isSupabaseReady()) {
      const { data, error } = await db().rpc('track_complaints', { search_text: value });

      if (error) throw error;
      const historyByComplaint = await fetchComplaintHistory(data || []);
      return (data || []).map((row) => normalizeComplaint({
        ...row,
        history: historyByComplaint[row.id] || [],
      }));
    }

    const q = value.toLowerCase();
    return readLocalComplaints().filter(
      (item) => item.email.toLowerCase() === q || item.referenceNo.toLowerCase() === q || item.id.toLowerCase() === q,
    );
  }

  async function updateComplaintStatus(referenceNo, updates) {
    const user = await currentUser();
    const status = updates.status;
    const note = updates.note || '';
    const assignedDepartment = updates.assignedDepartment || '';
    const now = new Date().toISOString();

    if (isSupabaseReady()) {
      const { data: complaint, error: findError } = await db()
        .from('complaints')
        .select('id')
        .eq('reference_no', referenceNo)
        .single();

      if (findError) throw findError;

      const { error: updateError } = await db()
        .from('complaints')
        .update({
          status,
          assigned_department: assignedDepartment || null,
          internal_notes: note || null,
          updated_at: now,
        })
        .eq('id', complaint.id);

      if (updateError) throw updateError;

      const { error: eventError } = await db().from('complaint_status_events').insert({
        complaint_id: complaint.id,
        status,
        note,
        changed_by: user?.id || null,
      });

      if (eventError) throw eventError;
      return;
    }

    const list = readLocalComplaints();
    const index = list.findIndex((item) => item.referenceNo === referenceNo || item.id === referenceNo);
    if (index < 0) throw new Error('Complaint not found');

    list[index] = {
      ...list[index],
      status,
      assignedDepartment,
      internalNotes: note,
      history: [
        ...(list[index].history || []),
        {
          status,
          note,
          actor: user?.email || 'official',
          created_at: now,
        },
      ],
    };
    writeLocalComplaints(list);
  }

  async function fetchComplaintHistory(complaints) {
    if (!isSupabaseReady() || !complaints.length) return {};

    const ids = complaints.map((item) => item.id).filter(Boolean);
    if (!ids.length) return {};

    const { data, error } = await db()
      .from('complaint_status_events')
      .select('complaint_id, status, note, created_at')
      .in('complaint_id', ids)
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Complaint history lookup failed:', error.message);
      return {};
    }

    return (data || []).reduce((groups, event) => {
      groups[event.complaint_id] ||= [];
      groups[event.complaint_id].push(event);
      return groups;
    }, {});
  }

  function statusLabel(status) {
    return STATUS_LABELS[status] || status || 'Submitted';
  }

  function renderTimeline(status, history = []) {
    const currentIndex = Math.max(0, STATUS_STEPS.indexOf(status));
    const items = STATUS_STEPS.map((step, index) => {
      const done = index <= currentIndex || status === 'resolved' || status === 'closed';
      return `<div class="status-step ${done ? 'done' : ''}">
        <span class="status-dot"></span>
        <span>${statusLabel(step)}</span>
      </div>`;
    }).join('');

    const events = history.length
      ? `<div class="history-list">${history
          .slice()
          .reverse()
          .map((event) => `<div><strong>${statusLabel(event.status)}</strong><br><small>${event.note || 'Updated'} - ${new Date(event.created_at).toLocaleString()}</small></div>`)
          .join('')}</div>`
      : '';

    return `<div class="status-timeline">${items}</div>${events}`;
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function debounce(fn, wait = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), wait);
    };
  }

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  }

  window.eReklamo = {
    isSupabaseReady,
    currentUser,
    requireAuth,
    signIn,
    signUp,
    signOut,
    roleHome,
    userDisplayName,
    generateReferenceNo,
    createComplaint,
    listComplaints,
    trackComplaints,
    updateComplaintStatus,
    statusLabel,
    renderTimeline,
    escapeHtml,
    debounce,
    showToast,
    STATUS_PROGRESS,
  };
})();
