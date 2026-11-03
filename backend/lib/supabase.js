const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase;

if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('placeholder') || supabaseUrl.includes('your-project')) {
    console.warn('⚠️  Cloud database (Supabase) not configured in .env. Using PERSISTENT LOCAL database (mock-db.json).');

    const dbPath = path.join(__dirname, '..', 'mock-db.json');

    const loadStore = () => {
        if (fs.existsSync(dbPath)) {
            try {
                return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
            } catch (e) {
                console.error('Failed to parse mock-db.json', e);
            }
        }
        return {
            users: [],
            projects: [],
            modules: [],
            invites: [],
            merge_logs: [],
            profiles: [
                { id: 'demo-admin', username: 'Admin', avatar_url: '' },
                { id: 'demo-lead', username: 'TeamLead', avatar_url: '' },
                { id: 'demo-dev', username: 'Developer', avatar_url: '' }
            ]
        };
    };

    let store = loadStore();
    if (!store.users) store.users = [];

    const saveStore = () => {
        fs.writeFileSync(dbPath, JSON.stringify(store, null, 2));
    };

    const getStore = () => {
        store = loadStore();
        if (!store.users) store.users = [];
        return store;
    };

    // Mock client implementation for local persistent DB
    supabase = {
        _getStore: getStore,
        _saveStore: saveStore,
        from: (table) => {
            return {
                select: (query = '*') => ({
                    eq: (col, val) => ({
                        single: () => {
                            const curStore = getStore();
                            if (!curStore[table]) curStore[table] = [];
                            const item = curStore[table].find(i => i[col] === val);
                            return Promise.resolve({ data: item || null, error: null });
                        },
                        order: (oCol, { ascending } = { ascending: true }) => {
                            const curStore = getStore();
                            if (!curStore[table]) curStore[table] = [];
                            const data = curStore[table].filter(i => i[col] === val);
                            data.sort((a, b) => {
                                if (a[oCol] < b[oCol]) return ascending ? -1 : 1;
                                if (a[oCol] > b[oCol]) return ascending ? 1 : -1;
                                return 0;
                            });
                            return Promise.resolve({ data, error: null });
                        },
                        then: (cb) => {
                            const curStore = getStore();
                            if (!curStore[table]) curStore[table] = [];
                            cb({ data: curStore[table].filter(i => i[col] === val), error: null });
                        }
                    }),
                    in: (col, vals) => ({
                        then: (cb) => {
                            const curStore = getStore();
                            if (!curStore[table]) curStore[table] = [];
                            cb({ data: curStore[table].filter(i => vals.includes(i[col])), error: null });
                        }
                    }),
                    order: (oCol, { ascending } = { ascending: true }) => ({
                        limit: (n) => {
                            const curStore = getStore();
                            if (!curStore[table]) curStore[table] = [];
                            return Promise.resolve({ data: curStore[table].slice(0, n), error: null });
                        },
                        then: (cb) => {
                            const curStore = getStore();
                            if (!curStore[table]) curStore[table] = [];
                            const data = [...curStore[table]];
                            data.sort((a, b) => {
                                if (a[oCol] < b[oCol]) return ascending ? -1 : 1;
                                if (a[oCol] > b[oCol]) return ascending ? 1 : -1;
                                return 0;
                            });
                            cb({ data, error: null });
                        }
                    }),
                    then: (cb) => {
                        const curStore = getStore();
                        if (!curStore[table]) curStore[table] = [];
                        cb({ data: curStore[table], error: null });
                    }
                }),
                insert: (data) => ({
                    select: () => ({
                        single: () => {
                            const curStore = getStore();
                            if (!curStore[table]) curStore[table] = [];
                            const items = Array.isArray(data) ? data : [data];
                            const newItems = items.map(item => ({
                                id: item.id || 'id_' + Math.random().toString(36).substring(2, 9),
                                created_at: item.created_at || new Date().toISOString(),
                                ...item
                            }));
                            curStore[table].push(...newItems);
                            saveStore();
                            return Promise.resolve({ data: newItems[0], error: null });
                        },
                        then: (cb) => {
                            const curStore = getStore();
                            if (!curStore[table]) curStore[table] = [];
                            const items = Array.isArray(data) ? data : [data];
                            const newItems = items.map(item => ({
                                id: item.id || 'id_' + Math.random().toString(36).substring(2, 9),
                                created_at: item.created_at || new Date().toISOString(),
                                ...item
                            }));
                            curStore[table].push(...newItems);
                            saveStore();
                            cb({ data: newItems, error: null });
                        }
                    }),
                    then: (cb) => {
                        const curStore = getStore();
                        if (!curStore[table]) curStore[table] = [];
                        const items = Array.isArray(data) ? data : [data];
                        const newItems = items.map(item => ({
                            id: item.id || 'id_' + Math.random().toString(36).substring(2, 9),
                            created_at: item.created_at || new Date().toISOString(),
                            ...item
                        }));
                        curStore[table].push(...newItems);
                        saveStore();
                        cb({ data: newItems, error: null });
                    }
                }),
                update: (data) => ({
                    eq: (col, val) => ({
                        then: (cb) => {
                            const curStore = getStore();
                            if (!curStore[table]) curStore[table] = [];
                            const index = curStore[table].findIndex(i => i[col] === val);
                            if (index !== -1) {
                                curStore[table][index] = { ...curStore[table][index], ...data };
                                saveStore();
                            }
                            cb({ data: curStore[table][index], error: null });
                        }
                    })
                }),
                delete: () => ({
                    eq: (col, val) => ({
                        then: (cb) => {
                            const curStore = getStore();
                            if (!curStore[table]) curStore[table] = [];
                            curStore[table] = curStore[table].filter(i => i[col] !== val);
                            saveStore();
                            cb({ error: null });
                        }
                    })
                })
            };
        }
    };
} else {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
}

module.exports = supabase;
