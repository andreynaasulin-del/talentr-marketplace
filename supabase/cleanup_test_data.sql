-- ====================================
-- TALENTR: ОЧИСТКА ТЕСТОВЫХ ДАННЫХ
-- Выполнить в Supabase SQL Editor
-- ====================================
-- ============================================================
-- ШАГ 1: ПРОСМОТР ВСЕХ ВЕНДОРОВ
-- Запустите этот запрос ПЕРВЫМ, чтобы увидеть все данные
-- ============================================================
SELECT id,
    name,
    category,
    city,
    email,
    rating,
    reviews_count,
    is_verified,
    is_active,
    created_at
FROM vendors
ORDER BY created_at DESC;
-- ============================================================
-- ШАГ 2: НАЙТИ ПОДОЗРИТЕЛЬНЫЕ ТЕСТОВЫЕ ДАННЫЕ
-- Вендоры с короткими именами, без описания, низким рейтингом
-- ============================================================
SELECT id,
    name,
    category,
    city,
    email,
    description,
    created_at
FROM vendors
WHERE -- Короткие или странные имена
    LENGTH(name) < 5
    OR name ~* '^(test|demo|aaa|bbb|goby|fewf|asdf|qwerty)' -- Без описания
    OR description IS NULL -- Без фото
    OR image_url IS NULL -- Не начинается с UUID из seed.sql
    OR id::text NOT LIKE '00000000-%'
ORDER BY created_at DESC;
-- ============================================================
-- ШАГ 3: ПРОСМОТР БРОНИРОВАНИЙ (для понимания связей)
-- ============================================================
SELECT b.id,
    b.vendor_id,
    v.name as vendor_name,
    b.event_date,
    b.event_type,
    b.status,
    b.created_at
FROM bookings b
    LEFT JOIN vendors v ON b.vendor_id = v.id
ORDER BY b.created_at DESC;
-- ============================================================
-- ШАГ 4: УДАЛЕНИЕ ТЕСТОВЫХ ВЕНДОРОВ
-- ⚠️ ВНИМАНИЕ: Выполняйте после проверки!
-- ⚠️ Это удалит связанные бронирования и отзывы
-- ============================================================
-- Вариант A: Удалить конкретных вендоров по ID
-- DELETE FROM vendors WHERE id IN (
--     'uuid-to-delete-1',
--     'uuid-to-delete-2'
-- );
-- Вариант B: Удалить всех НЕ-seed вендоров (НЕ из seed.sql)
-- DELETE FROM vendors 
-- WHERE id::text NOT LIKE '00000000-%';
-- Вариант C: Удалить по имени
-- DELETE FROM vendors 
-- WHERE name IN ('goby', 'fewf', 'test', 'demo');
-- ============================================================
-- ШАГ 5: ОЧИСТИТЬ ТЕСТОВЫЕ БРОНИРОВАНИЯ
-- ============================================================
-- Удалить бронирования на прошлые даты
-- DELETE FROM bookings 
-- WHERE event_date < CURRENT_DATE - INTERVAL '1 year';
-- Удалить все бронирования без клиента
-- DELETE FROM bookings 
-- WHERE client_id IS NULL;
-- ============================================================
-- ШАГ 6: ПРОВЕРКА ПОСЛЕ ОЧИСТКИ
-- ============================================================
SELECT COUNT(*) as total_vendors
FROM vendors;
SELECT COUNT(*) as total_bookings
FROM bookings;
SELECT COUNT(*) as total_reviews
FROM reviews;
-- ============================================================
-- БОНУС: Показать всех "реальных" вендоров из seed.sql
-- ============================================================
SELECT id,
    name,
    category,
    city,
    is_featured
FROM vendors
WHERE id::text LIKE '00000000-%'
ORDER BY is_featured DESC,
    rating DESC;