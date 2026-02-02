/**
 * Componente de Formulario de Login
 * 
 * Permite a los usuarios iniciar sesión con email y contraseña
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { login } from "@/lib/services/user";
import { Loader2, LogIn } from "lucide-react";

export function LoginForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			// Llama a la función de login del servicio
			const user = await login({
				email: formData.email,
				password: formData.password,
			});

			console.log("Usuario autenticado:", user);
      
			// Redirige a la página principal después del login exitoso
			router.push("/");
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error al iniciar sesión");
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	// Usuarios de ejemplo para facilitar las pruebas
	const fillExample = () => {
		setFormData({
			email: "maria@example.com",
			password: "cualquiera",
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{error && (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					name="email"
					type="email"
					placeholder="tu@email.com"
					value={formData.email}
					onChange={handleChange}
					required
					disabled={isLoading}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="password">Contraseña</Label>
				<Input
					id="password"
					name="password"
					type="password"
					placeholder="••••••••"
					value={formData.password}
					onChange={handleChange}
					required
					disabled={isLoading}
				/>
			</div>

			<div className="flex items-center justify-between text-sm">
				<button
					type="button"
					onClick={fillExample}
					className="text-primary hover:underline"
				>
					Usar ejemplo (María)
				</button>
				<a href="#" className="text-muted-foreground hover:text-foreground">
					¿Olvidaste tu contraseña?
				</a>
			</div>

			<Button type="submit" className="w-full" disabled={isLoading}>
				{isLoading ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Iniciando sesión...
					</>
				) : (
					<>
						<LogIn className="mr-2 h-4 w-4" />
						Iniciar Sesión
					</>
				)}
			</Button>

			<div className="text-xs text-muted-foreground text-center pt-2">
				<p className="mb-1">Usuarios de prueba disponibles:</p>
				<p>maria@example.com, carlos@example.com, ana@example.com</p>
			</div>
		</form>
	);
}
