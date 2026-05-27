/** @format */
"use client"
import React, { useState, useEffect, useMemo } from "react"

export default function Ejercicio2({ text, onComplete }) {
	const words = useMemo(() => text.split(/\s+/), [text])
	const [index, setIndex] = useState(0)
	const [isPlaying, setIsPlaying] = useState(false)
	const [targetWord, setTargetWord] = useState("")
	const [targetIndex, setTargetIndex] = useState(null)
	const [found, setFound] = useState(false)
	const [gameOver, setGameOver] = useState(false)

	// Seleccionamos una palabra aleatoria de todo el texto
	useEffect(() => {
		if (words.length > 0) {
			const randomIndex = Math.floor(Math.random() * words.length)
			setTargetIndex(randomIndex)
			setTargetWord(words[randomIndex].replace(/[.,!?;:]/g, ""))
		}
	}, [words])

	useEffect(() => {
		let timeout
		if (isPlaying && !found && !gameOver) {
			// Comprobamos si la palabra actual es la que buscamos
			const currentClean = words[index]?.replace(/[.,!?;:]/g, "").toLowerCase()
			const isTarget = currentClean === targetWord.toLowerCase()

			// Si es la palabra correcta, damos 5000ms para hacer clic. Si no, 100ms.
			const delay = isTarget ? 5000 : 100

			timeout = setTimeout(() => {
				setIndex((i) => {
					if (i + 1 >= words.length) {
						setIsPlaying(false)
						setGameOver(true)
						return i
					}
					return i + 1
				})
			}, delay)
		}
		return () => clearTimeout(timeout)
	}, [isPlaying, found, gameOver, words, index, targetWord])

	const checkWord = () => {
		const current = words[index].toLowerCase().replace(/[.,!?;:]/g, "")
		if (current === targetWord.toLowerCase()) {
			setFound(true)
			setIsPlaying(false)
			setTimeout(onComplete, 1500)
		}
	}

	return (
		<div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border-2 border-amber-500">
			<h3 className="text-lg font-bold text-amber-600 mb-2">Nivel 2: Escaneo Rápido</h3>
			<p className="text-sm text-gray-700 mb-4">
				Busca la palabra: <span className="text-xl font-black text-amber-700 underline">{targetWord}</span>
			</p>

			<div className="h-32 flex items-center justify-center">
				<p className={`text-4xl font-bold text-center ${found ? "text-green-500" : gameOver ? "text-red-500" : "text-gray-900"}`}>{found ? "¡CONSEGUIDO!" : gameOver ? "NO ENCONTRADA" : words[index]}</p>
			</div>

			{gameOver && !found && (
				<p className="text-sm text-indigo-600 font-semibold mb-4 animate-pulse">
					💡 Pista: La palabra estaba cerca del {Math.round((targetIndex / words.length) * 100)}% del texto (palabra #{targetIndex + 1}).
				</p>
			)}

			<div className="mt-4 flex flex-col items-center gap-4">
				{!isPlaying && !found && !gameOver && (
					<button
						onClick={() => setIsPlaying(true)}
						className="bg-amber-600 text-white px-8 py-2 rounded-lg font-bold"
					>
						Iniciar Sprint
					</button>
				)}

				{gameOver && !found && (
					<button
						onClick={() => {
							setIndex(0)
							setGameOver(false)
							setIsPlaying(true)
						}}
						className="bg-indigo-600 text-white px-8 py-2 rounded-lg font-bold"
					>
						Reintentar Escaneo
					</button>
				)}

				{isPlaying && (
					<button
						onMouseDown={checkWord}
						className="bg-red-500 hover:bg-red-600 text-white px-10 py-4 rounded-full font-black shadow-xl transform active:scale-95 transition-all"
					>
						¡LA VÍ!
					</button>
				)}
			</div>
		</div>
	)
}
