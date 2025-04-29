"use server"
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'


export async function POST(req: NextRequest, { params }: { params: { type: string } }) {
	const { type } = params
	const data = await req.formData()
	const file = data.get('file') as File
	const baseURL = data.get("baseUrl")
	const model = data.get("model")?.toString()

	if (!model) {
		return NextResponse.json({ error: 'Модель не указана' }, { status: 400 })
	}

	if (!file) {
		return NextResponse.json({ error: 'Файл не найден' }, { status: 400 })
	}

	const openai = new OpenAI({
		apiKey: 'lm-studio',
		baseURL: `${baseURL}/v1`,
	})
	const imageBuffer = await file.arrayBuffer()
	const base64 = Buffer.from(imageBuffer).toString('base64')

	let prompt: string
	switch (type) {
		case 'campaign':
			prompt = `
				Ты — ИИ-маркетолог. Проанализируй предоставленное изображение рекламного баннера кампании.
				Сгенерируй название для кампании и ограничение расходов(не более 200$) на кампанию формате JSON:
				{
					"name": "",
					"spend_cap": "$15"
				}
				Не добавляй объяснений — только JSON. Все значения должны быть на русском языке.
			`
			break
		case 'group':
			prompt = `
				Ты — ИИ-маркетолог. Проанализируй предоставленное изображение рекламного баннера кампании.
				Сгенерируй название для группы реклам и ключевые слова(минимум 5), аудиторию сообщества(минимум 5), интересы(минимум 5), геолокацию, геолокацию где не показывать, исключить сообщества, исключить ключевые слова и бюджет(не более 200$) на группу формате JSON:
				{
					"name": "",
					"keywords": "",
					"communities": "",
					"interests": "",
					"geolocations": "",
					"excluded_geolocations": "",
					"excluded_communities": "",
					"excluded_keywords": "",
					"goal_value": "$20"
				}
				Не добавляй объяснений — только JSON. Все значения должны быть на русском языке.
			`
			break
		case "ads": 
		prompt = `
				Ты — ИИ-маркетолог. Проанализируй предоставленное изображение рекламного баннера кампании.
				Сгенерируй название рекламного объявления и убедительный заголовок к этой рекламе на русском языке длинной не менее 50 символов и не более 300 символов, верни результат строго в формате JSON:
				{
					"name": "",
					"headline": ""
				}
				Не добавляй объяснений — только JSON. Все значения должны быть на русском языке.
			`
			break
		default:
			return NextResponse.json({ error: 'Неверный тип запроса' }, { status: 400 })
	}

	try {
		const chatCompletion = await openai.chat.completions.create({
			model: model,
			messages: [
				{
					role: 'user',
					content: [
						{ type: 'text', text: prompt },
						{
							type: 'image_url',
							image_url: {
								url: 'data:image/jpeg;base64,' + base64,
							},
						},
					],
				},
			],
		})

		const content = chatCompletion.choices[0].message.content
		
		const match = content?.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)

		let jsonString: string

		if (match) {
			jsonString = match[1]
		} else {
			jsonString = content?.trim() ?? ''
		}

	const json = JSON.parse(jsonString)
	return NextResponse.json(json)
} catch (e) {
	return NextResponse.json(
		{ error: 'Не удалось распарсить JSON из ответа модели'},
		{ status: 500 }
	)
}}
