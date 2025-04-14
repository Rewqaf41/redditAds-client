import { MetricsType } from "@/store/types"
import { useMemo } from "react"

/**
 * Функция для извлечения числового значения из строки, очищая её от нечисловых символов.
 * @param value Строка, содержащая числовое значение.
 * @returns Числовое значение (тип float), если строка содержит числовые данные, иначе 0.
 */
function getNumericValue(value: string) {
	const cleanedValue = value.replace(/[^0-9.]/g, "") // Очищаем строку от всего, что не является числом или точкой.
	return parseFloat(cleanedValue) || 0 // Преобразуем в число или возвращаем 0, если число не удалось извлечь.
}

/**
 * Хук для фильтрации и сортировки элементов в списке.
 * Фильтрует элементы по имени (по запросу поиска) и сортирует по указанному ключу (по имени или метрикам).
 *
 * @param items Массив элементов для фильтрации и сортировки.
 * @param searchQuery Запрос поиска, используется для фильтрации элементов по имени.
 * @param sortKey Ключ, по которому производится сортировка. Может быть "name" или одним из ключей метрик.
 * @param sortOrder Направление сортировки: "asc" (по возрастанию) или "desc" (по убыванию).
 * @returns Отфильтрованный и отсортированный список элементов.
 */
export function useFilteredAndSortedItems<T extends { name: string; metrics?: MetricsType[] }>(
	items: T[], // Массив элементов для обработки.
	searchQuery: string, // Запрос для фильтрации по имени.
	sortKey: string, // Ключ для сортировки (например, по имени или метрикам).
	sortOrder: "asc" | "desc" // Направление сортировки.
) {
	return useMemo(() => {
		// Фильтрация элементов по запросу поиска
		const filteredItems = items.filter((item) =>
			item.name.toLowerCase().includes(searchQuery.toLowerCase()) // Фильтруем по имени, игнорируя регистр.
		)

		// Сортировка отфильтрованных элементов
		const sortedItems = [...filteredItems].sort((a, b) => {
			// Сортировка по имени
			if (sortKey === "name") {
				return sortOrder === "asc"
					? a.name.localeCompare(b.name) // Сортировка по возрастанию
					: b.name.localeCompare(a.name) // Сортировка по убыванию
			}

			// Сортировка по метрикам (если ключ сортировки — это метрика)
			const key = sortKey as keyof MetricsType // Ключ для сортировки, приведённый к типу MetricsType.
			const valueA = getNumericValue(a.metrics?.[0]?.[key] || "") // Получаем числовое значение для элемента A.
			const valueB = getNumericValue(b.metrics?.[0]?.[key] || "") // Получаем числовое значение для элемента B.

			// Сортировка по метрикам
			return sortOrder === "asc" ? valueA - valueB : valueB - valueA
		})

		// Возвращаем отсортированный список элементов
		return sortedItems
	}, [items, searchQuery, sortKey, sortOrder]) // Хук будет пересчитывать результат при изменении этих зависимостей.
}
