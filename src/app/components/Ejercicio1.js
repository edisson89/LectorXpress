/** @format */
"use client"
import React, { useState, useEffect, useMemo } from "react"

export default function Ejercicio1({ text, onComplete }) {
	const words = useMemo(() => text.split(/\s+/), [text])
	const [index, setIndex] = useState(0)
	const [wordCount, setWordCount] = useState(1)
	const [isPlaying, setIsPlaying] = useState(false)
	const wpm = 250

	const intervalTime = useMemo(() => Math.round((60000 * wordCount) / wpm), [wordCount, wpm])

	// Efecto para controlar el avance de las palabras
	useEffect(() => {
		let interval
		if (isPlaying) {
			interval = setInterval(() => {
				setIndex((prev) => {
					const next = prev + wordCount

					// Lógica de dificultad: Aumentar bloque cada 15 palabras
					const currentThreshold = Math.floor(prev / 15)
					const nextThreshold = Math.floor(next / 15)
					if (nextThreshold > currentThreshold && wordCount < 4) {
						setWordCount((c) => c + 1)
					}

					return next
				})
			}, intervalTime)
		}
		return () => clearInterval(interval)
	}, [isPlaying, intervalTime, wordCount]) // Quitamos 'index' de aquí

	// Efecto para detectar cuando termina el ejercicio
	useEffect(() => {
		if (index >= words.length && words.length > 0) {
			setIsPlaying(false)
			onComplete()
		}
	}, [index, words.length, onComplete])

	return (
		<div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border-2 border-blue-500">
			<h3 className="text-lg font-bold text-blue-600 mb-4">Nivel 1: Visión Periférica</h3>
			<p className="text-sm text-gray-600 mb-4 text-center">El bloque de palabras crecerá cada 15 palabras. ¡No muevas los ojos, capta el grupo completo!</p>

			<div className="h-32 flex items-center justify-center">
				<p className="text-4xl font-bold transition-all">{index >= words.length ? "¡Completado!" : words.slice(index, index + wordCount).join(" ")}</p>
			</div>

			<div className="mt-4 flex gap-4">
				<button
					onClick={() => setIsPlaying(!isPlaying)}
					className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold"
				>
					{isPlaying ? "Pausar" : "Comenzar"}
				</button>
				<div className="bg-gray-100 px-4 py-2 rounded-lg text-sm">
					Bloque actual: <span className="font-bold">{wordCount}</span>
				</div>
			</div>
		</div>
	)
}
