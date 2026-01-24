#!/bin/bash

echo "📉 Место на диске ДО очистки:"
df -h / | grep "/"

echo ""
echo "🗑️  Очистка текущего проекта (event-marketplace-mvp)..."
rm -rf .next
rm -rf node_modules/.cache
echo "   ✓ .next и .cache удалены"

# Переходим в родительскую папку (vibecoding projects)
cd ..
echo ""
echo "📂 Сканирование папки: $(pwd)"
echo "   (Ищем проекты, которые не изменялись более 90 дней)"

echo ""
echo "🧹 Удаляем старые node_modules (> 3 месяцев)..."
find . -name "node_modules" -type d -mtime +90 -prune -print -exec rm -rf '{}' +

echo ""
echo "🧹 Удаляем старые кеши и сборки (> 3 месяцев)..."
find . -name ".next" -type d -mtime +90 -prune -print -exec rm -rf '{}' +
find . -name ".cache" -type d -mtime +90 -prune -print -exec rm -rf '{}' +
find . -name "dist" -type d -mtime +90 -prune -print -exec rm -rf '{}' +
find . -name "build" -type d -mtime +90 -prune -print -exec rm -rf '{}' +

echo ""
echo "📈 Место на диске ПОСЛЕ очистки:"
df -h / | grep "/"
