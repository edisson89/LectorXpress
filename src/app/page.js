/** @format */
"use client"

import React, { useEffect, useState } from "react"
import { data } from "@/utils/data"
import Image from "next/image"
import Footer from "./footer"
import logo from "../../images/lectorxprees.jpg"

const words = data.text.split(" ")

function Lectura() {
	const initialSpeed = 3
	const initialIsPlaying = false
	const [wordCount, setWordCount] = useState(initialSpeed)
	const [speed, setSpeed] = useState(500) // En milisegundos
	const [index, setIndex] = useState(0)
	const [isPlaying, setIsPlaying] = useState(initialIsPlaying)
	// Calcular palabras por minuto
	const wordsPerMinute = Math.round((60000 / speed) * wordCount)
	const [elapsedTime, setElapsedTime] = useState(0); // Cronómetro
	// Función para resetear el estado
	const resetState = () => {
		setWordCount(initialSpeed)
		setIsPlaying(initialIsPlaying)
		setElapsedTime(0); // Reiniciar el cronómetro
        setIndex(0)
	}
	// Manejar el cronómetro
	useEffect(() => {
		let timer;
		if (isPlaying) {
		  timer = setInterval(() => {
			setElapsedTime((prevTime) => prevTime + 1); // Incrementar en 1 segundo
		  }, 1000);
		}
		return () => {
		  if (timer) clearInterval(timer);
		};
	  }, [isPlaying]);

	  // Calcular el intervalo dinámicamente
	  useEffect(() => {
		const calculatedSpeed = Math.round((60000 / wordsPerMinute) * wordCount);
		setSpeed(calculatedSpeed); // Actualizar el estado de velocidad
	  }, [wordsPerMinute, wordCount]);
	useEffect(() => {
    let interval; // Declarar el intervalo fuera del bloque
  if (isPlaying) {
    interval = setInterval(() => {
      setIndex((prevIndex) => {
        if (prevIndex >= words.length - wordCount) {
          return 0;
        }
        return prevIndex + wordCount;
      });
    }, speed);
  }
  // Limpiar el intervalo en el return del useEffect
  return () => {
    if (interval) {
      clearInterval(interval);
    }
  };
	}, [isPlaying, speed, wordCount])

	return (
		<div className="flex min-h-screen flex-col">
			<div className="flex items-center p-1 background bg-custom-gradient bg-gradient-to-r from-[#6a64f6] via -[#a96ddf] via -[#c77fcd] to-[#a789c9]">
				<div className="items-start">
					<Image
          className="rounded-full"
						src={logo}
						alt="lectorXpress"
						height={100}
						width={100}
					/>
				</div>
				<div className='flex w-full h-14 text-amber-200 text-2xl size-3.5 justify-center p-2 m-2'>Lectura Rapida</div>
			</div>

			<h1 className="p-3 m-5">Resumen del Libro &quot;Los Secretos de la Mente Millonaria&ldquo; de T. Harv Eker</h1>
			<div className="p-4 text-center space-y-4">
				<h2 className="m-8 text-xl font-bold">A Que Velocidad Puedes Leer!!!</h2>
				<p className="m-9 text-2xl font-bold bg-yellow-500 text-black px-4 py-2 rounded-lg">
					🚀 Puedes leer a: <strong>{wordsPerMinute} WPM(Palabras Por minuto)</strong>
				</p>

				<div className="flex m-8 justify-center space-x-4">
					<label>Palabras: </label>
					<input
						type="range"
						min="2"
						max="10"
						value={wordCount}
						onChange={(e) => setWordCount(Number(e.target.value))}
					/>
					<span className="flex justify-center">{wordCount}</span>
				</div>

				<div className="flex m-8 justify-center space-x-4">
					<label>Velocidad (ms): </label>
                   
					<input
          
						type="range"
						min="100" 
						max="2000"
						step="100"
						value={speed}
						onChange={(e) => setSpeed(Number(e.target.value))}
					/>
					<span>{speed}ms</span>
				</div>
				<p>Tiempo transcurrido: {elapsedTime} segundos</p>

				<button
					className="m-8 w-25 px-4 py-2 bg-blue-500 text-white rounded-xl"
					onClick={() => setIsPlaying(!isPlaying)}
				>
					{isPlaying ? "Pausar" : "Iniciar"}
				</button>
				<button
					className=" m-8 w-25 px-4 py-2 bg-red-500 text-white rounded-xl"
					onClick={resetState}
				>
					Resetear
				</button>
			</div>
			<div className="flex flex-nowrap h-14 items-center m-8 justify-center p-4 text-2xl font-semibold bg-gray-200 rounded-xl">{words.slice(index, index + wordCount).join(" ")}</div>
		 <Footer />
    </div>
	)
}

export default Lectura
