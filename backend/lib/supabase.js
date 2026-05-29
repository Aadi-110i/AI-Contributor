const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase;

if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('placeholder')) {
    console.warn('⚠️  Supabase credentials not configured. Using PERSISTENT MOCK database.');

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

    const saveStore = () => {
        fs.writeFileSync(dbPath, JSON.stringify(store, null, 2));
    };

    // Simple mock client implementation
    supabase = {
        from: (table) => {
            return {
                select: (query = '*') => ({
                    eq: (col, val) => ({
                        single: () => {
                            const item = store[table].find(i => i[col] === val);
                            return Promise.resolve({ data: item, error: null });
                        },
                        order: (oCol, { ascending } = { ascending: true }) => {
                            const data = store[table].filter(i => i[col] === val);
                            data.sort((a, b) => {
                                if (a[oCol] < b[oCol]) return ascending ? -1 : 1;
                                if (a[oCol] > b[oCol]) return ascending ? 1 : -1;
                                return 0;
                            });
                            return Promise.resolve({ data, error: null });
                        },
                        then: (cb) => cb({ data: store[table].filter(i => i[col] === val), error: null })
                    }),
                    in: (col, vals) => ({
                        then: (cb) => cb({ data: store[table].filter(i => vals.includes(i[col])), error: null })
                    }),
                    order: (oCol, { ascending } = { ascending: true }) => ({
                        limit: (n) => Promise.resolve({ data: store[table].slice(0, n), error: null }),
                        then: (cb) => {
                            const data = [...store[table]];
                            data.sort((a, b) => {
                                if (a[oCol] < b[oCol]) return ascending ? -1 : 1;
                                if (a[oCol] > b[oCol]) return ascending ? 1 : -1;
                                return 0;
                            });
                            cb({ data, error: null });
                        }
                    }),
                    then: (cb) => cb({ data: store[table], error: null })
                }),
                insert: (data) => ({
                    select: () => ({
                        single: () => {
                            const items = Array.isArray(data) ? data : [data];
                            const newItems = items.map(item => ({
                                id: Math.random().toString(36).substring(7),
                                created_at: new Date().toISOString(),
                                ...item
                            }));
                            store[table].push(...newItems);
                            saveStore();
                            return Promise.resolve({ data: newItems[0], error: null });
                        },
                        then: (cb) => {
                            const items = Array.isArray(data) ? data : [data];
                            const newItems = items.map(item => ({
                                id: Math.random().toString(36).substring(7),
                                created_at: new Date().toISOString(),
                                ...item
                            }));
                            store[table].push(...newItems);
                            saveStore();
                            cb({ data: newItems, error: null });
                        }
                    }),
                    then: (cb) => {
                        const items = Array.isArray(data) ? data : [data];
                        const newItems = items.map(item => ({
                            id: Math.random().toString(36).substring(7),
                            created_at: new Date().toISOString(),
                            ...item
                        }));
                        store[table].push(...newItems);
                        saveStore();
                        cb({ data: newItems[0], error: null });
                    }
                }),
                update: (data) => ({
                    eq: (col, val) => ({
                        then: (cb) => {
                            const index = store[table].findIndex(i => i[col] === val);
                            if (index !== -1) {
                                store[table][index] = { ...store[table][index], ...data };
                                saveStore();
                            }
                            cb({ data: store[table][index], error: null });
                        }
                    })
                }),
                delete: () => ({
                    eq: (col, val) => ({
                        then: (cb) => {
                            store[table] = store[table].filter(i => i[col] !== val);
                            saveStore();
                            cb({ error: null });
                        }
                    })
                })
            };
        },
        auth: {
            // Mock auth
        }
    };
} else {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
}

module.exports = supabase;
