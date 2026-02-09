import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanPendingVendors() {
    console.log('🧹 Очищаем мусор из pending_vendors...\n');

    // Удаляем все записи с source_type = 'facebook' (старый мусор)
    const { data: deleted, error } = await supabase
        .from('pending_vendors')
        .delete()
        .eq('source_type', 'facebook')
        .select();

    if (error) {
        console.error('❌ Ошибка:', error.message);
        return;
    }

    console.log(`✅ Удалено ${deleted?.length || 0} записей`);
    console.log('\nТеперь можно запускать новый скрапер с AI фильтрацией.');
}

cleanPendingVendors();
