"use server"
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'


export async function POST(req: NextRequest) {
	const data = await req.formData()
	const file = data.get('file') as File
	const baseURL = data.get("baseUrl")
	const model = data.get("model")?.toString()

	if (!model) {
		return NextResponse.json({ error: 'Модель не указана' }, { status: 400 })
	}

	const openai = new OpenAI({
		apiKey: 'lm-studio',
		baseURL: `${baseURL}/v1`,
	})

	if (!file) {
		return NextResponse.json({ error: 'Файл не найден' }, { status: 400 })
	}

	const imageBuffer = await file.arrayBuffer()
	const base64 = Buffer.from(imageBuffer).toString('base64')

	const prompt = `
Ты — ИИ-маркетолог. Проанализируй предоставленное изображение рекламного баннера.
Напиши убедительный заголовок к этой рекламе на русском языке длинной не менее 50 символов и не более 300 символов и верни результат строго в формате JSON:
{
  "headline": "",
}
Не добавляй объяснений — только JSON.
`

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
		// const match = content?.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)

		// if (!match) {
		// 	return NextResponse.json(
		// 		{ error: 'Не удалось распарсить ответ модели' },
		// 		{ status: 500 }
		// 	)
		// }

		const json = JSON.parse(content as string)
		return NextResponse.json(json)
	} catch (error) {
		return NextResponse.json({ error: 'Ошибка при обращении к LM Studio' }, { status: 500 })
	}
}
