import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixConstraint() {
    console.log('🔧 Обновляем constraint для source_type...');

    const { error } = await supabase.rpc('exec_sql', {
        sql: `
            ALTER TABLE pending_vendors DROP CONSTRAINT IF EXISTS pending_vendors_source_type_check;
            ALTER TABLE pending_vendors ADD CONSTRAINT pending_vendors_source_type_check 
            CHECK (source_type IN ('instagram', 'google', 'manual', 'referral', 'facebook'));
        `
    });

    if (error) {
        console.error('❌ Ошибка:', error.message);

        // Альтернативный способ - через прямой SQL
        console.log('\n📝 Выполни вручную в Supabase SQL Editor:');
        console.log(`
ALTER TABLE pending_vendors DROP CONSTRAINT IF EXISTS pending_vendors_source_type_check;
ALTER TABLE pending_vendors ADD CONSTRAINT pending_vendors_source_type_check 
CHECK (source_type IN ('instagram', 'google', 'manual', 'referral', 'facebook'));
        `);
    } else {
        console.log('✅ Constraint обновлен!');
    }
}

fixConstraint();
