/** @format */
"use client"

import React, { useEffect, useState, useMemo, useCallback } from "react"
import { data } from "@/utils/data"
import Image from "next/image"
import Footer from "./footer"
import logo from "../../images/lectorxprees.jpg"
import Ejercicio1 from "@/app/components/Ejercicio1"
import Ejercicio2 from "@/app/components/Ejercicio2"
import Ejercicio3 from "@/app/components/Ejercicio3"


// Pre-procesamiento del texto fuera del componente para mejor rendimiento
// Aseguramos que data.text exista para evitar crasheos si es undefined
const rawText = data?.text || "Texto de ejemplo no encontrado."
const words = rawText.split(/\s+/) // Mejor split: maneja múltiples espacios y saltos de línea

export default function Lectura() {
	// --- ESTADOS ---
	const [isPlaying, setIsPlaying] = useState(false)
	const [index, setIndex] = useState(0)

	// Lógica de Ejercicios
	const [currentLevel, setCurrentLevel] = useState(0) // 0 = Lector, 1, 2, 3 = Ejercicios
	const [unlockedLevel, setUnlockedLevel] = useState(1)

	useEffect(() => {
		// Cargar progreso guardado
		const saved = localStorage.getItem("lector_xpress_progress")
		if (saved) setUnlockedLevel(Number(saved))
	}, [])

	// Configuraciones de usuario
	const [wordCount, setWordCount] = useState(1) // Palabras por bloque (Chunk)
	const [wpm, setWpm] = useState(250) // Palabras por minuto (lo estándar)
	const [elapsedTime, setElapsedTime] = useState(0)

	// --- CÁLCULOS MATEMÁTICOS ---

	// Calculamos el intervalo en ms basándonos en WPM y el número de palabras a mostrar
	// Fórmula: (60 segundos * 1000 ms * numero_palabras) / palabras_por_minuto
	const intervalTime = useMemo(() => {
		if (wpm <= 0) return 1000
		return Math.round((60000 * wordCount) / wpm)
	}, [wpm, wordCount])

	// Progreso en porcentaje para la barra visual
	const progress = Math.min((index / words.length) * 100, 100)

	// --- EFECTOS (LÓGICA) ---

	// 1. Loop de Lectura Principal
	useEffect(() => {
		let interval

		if (isPlaying && index < words.length) {
			interval = setInterval(() => {
				setIndex((prevIndex) => {
					const nextIndex = prevIndex + wordCount

					// Si llegamos al final, paramos
					if (nextIndex >= words.length) {
						setIsPlaying(false)
						return words.length // Asegura que muestre el final
					}
					return nextIndex
				})
			}, intervalTime)
		}

		return () => clearInterval(interval)
	}, [isPlaying, intervalTime, wordCount, index])

	// 2. Cronómetro
	useEffect(() => {
		let timer
		if (isPlaying) {
			timer = setInterval(() => {
				setElapsedTime((prev) => prev + 1)
			}, 1000)
		}
		return () => clearInterval(timer)
	}, [isPlaying])

	// --- HANDLERS ---
	const handleLevelComplete = useCallback((level) => {
		const nextLevel = level + 1
		setUnlockedLevel((prev) => {
			const isNewLevel = nextLevel > prev
			if (isNewLevel) localStorage.setItem("lector_xpress_progress", nextLevel)
			return isNewLevel ? nextLevel : prev
		})
		alert(`¡Felicidades! Has desbloqueado el nivel ${nextLevel}`)
	}, [])

	const resetState = () => {
		setIsPlaying(false)
		setIndex(0)
		setElapsedTime(0)
	}

	const currentWords = words.slice(index, index + wordCount).join(" ")

	return (
		<div className="flex min-h-screen flex-col bg-gray-50 text-gray-800">
			{/* HEADER CORREGIDO */}
			<div className="flex items-center p-4 bg-gradient-to-r from-[#6a64f6] via-[#a96ddf] to-[#c77fcd] shadow-lg">
				<div className="flex-shrink-0">
					<Image
						className="rounded-full border-2 border-white"
						src={logo}
						alt="LectorXpress Logo"
						height={60}
						width={60}
					/>
				</div>
				<h1 className="ml-4 text-2xl font-bold text-white tracking-wide">LectorXpress</h1>
			</div>

			{/* CONTENIDO PRINCIPAL */}
			<main className="flex-grow flex flex-col items-center justify-center p-4 max-w-3xl mx-auto w-full">
				<h2 className="text-center text-xl font-semibold mb-4 text-indigo-600">Aprende Inglés con Historias Rápidas</h2>

				{/* SELECTOR DE MODO / EJERCICIOS */}
				<div className="flex flex-wrap justify-center gap-2 mb-8">
					<button
						onClick={() => setCurrentLevel(0)}
						className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${currentLevel === 0 ? "bg-indigo-600 text-white shadow-md" : "bg-white text-gray-600"}`}
					>
						📖 Modo Lector
					</button>
					{[1, 2, 3].map((lvl) => {
						const names = ["", "Visión Periférica", "Escaneo Rápido", "La Pirámide"]
						return (
							<button
								key={lvl}
								disabled={lvl > unlockedLevel}
								onClick={() => setCurrentLevel(lvl)}
								className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${currentLevel === lvl ? "bg-indigo-600 text-white" : lvl <= unlockedLevel ? "bg-white text-indigo-600 border border-indigo-200 shadow-sm" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
							>
								{lvl <= unlockedLevel ? `⚡ Ex ${lvl}: ${names[lvl]}` : `🔒 Bloqueado`}
							</button>
						)
					})}
				</div>

				{/* RENDERIZADO CONDICIONAL */}
				{currentLevel === 0 ? (
					<>
						{/* VISOR DE LECTURA (Caja Fija) */}
						<div className="w-full bg-white shadow-2xl rounded-2xl p-8 mb-8 border border-gray-200 flex items-center justify-center min-h-[200px]">
							<p className="text-5xl md:text-6xl font-bold text-center text-gray-900 leading-tight select-none transition-all duration-100">{index >= words.length ? "¡Fin de la lectura!" : currentWords}</p>
						</div>

						{/* BARRA DE PROGRESO */}
						<div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
							<div
								className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
								style={{ width: `${progress}%` }}
							></div>
							<p className="text-xs text-right mt-1 text-gray-500">{Math.round(progress)}% Completado</p>
						</div>

						{/* CONTROLES ESTADÍSTICOS */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8 bg-white p-6 rounded-xl shadow-sm">
							{/* Control de WPM */}
							<div className="flex flex-col space-y-2">
								<label className="font-semibold text-gray-700">Velocidad: {wpm} WPM</label>
								<input
									type="range"
									min="100"
									max="1000"
									step="10"
									className="accent-indigo-600 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
									value={wpm}
									onChange={(e) => setWpm(Number(e.target.value))}
								/>
							</div>

							{/* Control de Palabras por Vistazo */}
							<div className="flex flex-col space-y-2">
								<label className="font-semibold text-gray-700">Bloque: {wordCount} palabra(s)</label>
								<input
									type="range"
									min="1"
									max="5"
									step="1"
									className="accent-indigo-600 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
									value={wordCount}
									onChange={(e) => setWordCount(Number(e.target.value))}
								/>
							</div>
						</div>

						{/* BOTONES DE ACCIÓN */}
						<div className="flex gap-4">
							<button
								onClick={() => setIsPlaying(!isPlaying)}
								className={`px-8 py-3 rounded-xl font-bold text-white transition-colors shadow-md ${isPlaying ? "bg-amber-500 hover:bg-amber-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
							>
								{isPlaying ? "⏸ Pausar" : "▶ Iniciar"}
							</button>

							<button
								onClick={resetState}
								className="px-8 py-3 rounded-xl font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors shadow-sm"
							>
								↺ Reiniciar
							</button>
						</div>
					</>
				) : (
					<div className="w-full">
						{currentLevel === 1 && (
							<Ejercicio1
								text={rawText}
								onComplete={() => handleLevelComplete(1)}
							/>
						)}
						{currentLevel === 2 && (
							<Ejercicio2
								text={rawText}
								onComplete={() => handleLevelComplete(2)}
							/>
						)}
						{currentLevel === 3 && (
							<Ejercicio3
								text={rawText}
								onComplete={() => handleLevelComplete(3)}
							/>
						)}
						<button
							onClick={() => setCurrentLevel(0)}
							className="mt-6 text-indigo-600 text-sm font-semibold hover:underline flex items-center gap-2"
						>
							← Volver al modo lector
						</button>
					</div>
				)}

				<div className="mt-6 text-sm text-gray-500 font-mono bg-gray-100 px-4 py-2 rounded-lg shadow-inner">⏱ Tiempo: {elapsedTime}s</div>
			</main>

			<Footer />
		</div>
	)
}
