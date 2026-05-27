/** @format */
"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { registerUser } from "@/services/authService"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await registerUser(email, password)
      // Si el registro es exitoso, lo enviamos al login
      alert("¡Cuenta creada con éxito! Ahora inicia sesión.")
      router.push("/login")
    } catch (err) {
      setError(err.message || "Error al crear la cuenta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-center">
          <div className="mx-auto bg-white rounded-full w-20 h-20 flex items-center justify-center mb-2 shadow-lg">
            <span className="text-3xl">✍️</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Únete a LectorXpress</h2>
          <p className="text-emerald-50">Crea tu cuenta gratis</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleRegister} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition-all ${
                loading ? "bg-gray-400" : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {loading ? "Registrando..." : "Crear Cuenta"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="font-semibold text-emerald-600 hover:text-emerald-500">
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}