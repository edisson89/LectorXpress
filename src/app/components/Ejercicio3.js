/** @format */
"use client"
import React, { useState, useEffect, useMemo } from "react"

export default function Ejercicio3({ text, onComplete }) {
	const words = useMemo(() => text.split(/\s+/), [text])
	const [index, setIndex] = useState(0)
	const [isPlaying, setIsPlaying] = useState(false)
	const [wpm, setWpm] = useState(250)

	useEffect(() => {
		const progress = (index / words.length) * 100

		// Lógica de Pirámide
		if (progress < 30)
			setWpm(250) // Calentamiento
		else if (progress < 70)
			setWpm(600) // Sprint (imposible subvocalizar)
		else setWpm(400) // Consolidación
	}, [index, words])

	useEffect(() => {
		let interval
		if (isPlaying) {
			interval = setInterval(() => {
				setIndex((i) => (i + 1 >= words.length ? i : i + 1))
			}, 60000 / wpm)
		}
		return () => clearInterval(interval)
	}, [isPlaying, wpm, words.length])

	return (
		<div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border-2 border-purple-500">
			<h3 className="text-lg font-bold text-purple-600 mb-2">Nivel 3: La Pirámide</h3>
			<div className="flex gap-2 mb-4">
				<div className={`w-3 h-3 rounded-full ${wpm === 250 ? "bg-purple-500" : "bg-gray-200"}`}></div>
				<div className={`w-3 h-3 rounded-full ${wpm === 600 ? "bg-red-500 animate-pulse" : "bg-gray-200"}`}></div>
				<div className={`w-3 h-3 rounded-full ${wpm === 400 ? "bg-green-500" : "bg-gray-200"}`}></div>
			</div>

			<div className="h-32 flex items-center justify-center">
				<p className="text-5xl font-black text-gray-900">{index >= words.length ? "🏆 ¡MAESTRO!" : words[index]}</p>
			</div>

			<div className="mt-6 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
				<div
					className="bg-purple-600 h-full transition-all duration-300"
					style={{ width: `${(index / words.length) * 100}%` }}
				></div>
			</div>

			<button
				onClick={() => setIsPlaying(!isPlaying)}
				className="mt-6 bg-purple-600 text-white px-10 py-2 rounded-lg font-bold hover:bg-purple-700 transition-colors"
			>
				{isPlaying ? "Pausar" : "Iniciar Entrenamiento Final"}
			</button>

			<p className="mt-2 text-xs font-mono text-gray-500">Velocidad actual: {wpm} WPM</p>
		</div>
	)
}
