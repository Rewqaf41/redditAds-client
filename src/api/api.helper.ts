// Возвращает объект заголовков с типом контента JSON.
// Удобно использовать при отправке HTTP-запросов с JSON-данными.
export const getContentType = () => ({
	'Content-Type': 'application/json',
})

// Обрабатывает ошибку, полученную от сервера, и возвращает читаемое сообщение.
// Поддерживает как строковые, так и массивные сообщения об ошибке.
export const errorCatch = (error: any): string => {
	const message = error?.response?.data?.message

	return message
		? typeof error.response.data.message === 'object'
			? message[0] // Если message — массив, вернуть первый элемент
			: message // Если message — строка, вернуть её
		: error.message // Если нет message в ответе, вернуть общее сообщение об ошибке
}
