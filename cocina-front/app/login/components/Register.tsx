/**
 * Componente de Formulario de Registro
 * 
 * Permite a los nuevos usuarios crear una cuenta
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { register } from "@/lib/services/user";
import { Loader2, UserPlus, CheckCircle2 } from "lucide-react";

interface RegisterFormProps {
	onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		fullName: "",
		password: "",
		confirmPassword: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess(false);
		setIsLoading(true);

		// Validación de contraseñas
		if (formData.password !== formData.confirmPassword) {
			setError("Las contraseñas no coinciden");
			setIsLoading(false);
			return;
		}

		// Validación de longitud de contraseña
		if (formData.password.length < 6) {
			setError("La contraseña debe tener al menos 6 caracteres");
			setIsLoading(false);
			return;
		}

		try {
			// Llama a la función de registro del servicio
			const user = await register({
				username: formData.username,
				email: formData.email,
				fullName: formData.fullName,
				password: formData.password,
			});

			console.log("Usuario registrado:", user);
      
			setSuccess(true);
      
			// Limpia el formulario
			setFormData({
				username: "",
				email: "",
				fullName: "",
				password: "",
				confirmPassword: "",
			});

			// Espera 2 segundos y cambia al tab de login
			setTimeout(() => {
				onSuccess?.();
			}, 2000);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error al crear la cuenta");
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

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{error && (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{success && (
				<Alert className="bg-green-50 border-green-200 text-green-800">
					<CheckCircle2 className="h-4 w-4" />
					<AlertDescription>
						¡Cuenta creada exitosamente! Redirigiendo al login...
					</AlertDescription>
				</Alert>
			)}

			<div className="space-y-2">
				<Label htmlFor="fullName">Nombre Completo</Label>
				<Input
					id="fullName"
					name="fullName"
					type="text"
					placeholder="Juan Pérez"
					value={formData.fullName}
					onChange={handleChange}
					required
					disabled={isLoading}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="username">Nombre de Usuario</Label>
				<Input
					id="username"
					name="username"
					type="text"
					placeholder="juanperez"
					value={formData.username}
					onChange={handleChange}
					required
					disabled={isLoading}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="register-email">Email</Label>
				<Input
					id="register-email"
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
				<Label htmlFor="register-password">Contraseña</Label>
				<Input
					id="register-password"
					name="password"
					type="password"
					placeholder="••••••••"
					value={formData.password}
					onChange={handleChange}
					required
					disabled={isLoading}
					minLength={6}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
				<Input
					id="confirmPassword"
					name="confirmPassword"
					type="password"
					placeholder="••••••••"
					value={formData.confirmPassword}
					onChange={handleChange}
					required
					disabled={isLoading}
				/>
			</div>

			<Button type="submit" className="w-full" disabled={isLoading || success}>
				{isLoading ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Creando cuenta...
					</>
				) : (
					<>
						<UserPlus className="mr-2 h-4 w-4" />
						Crear Cuenta
					</>
				)}
			</Button>

			<p className="text-xs text-muted-foreground text-center">
				Al registrarte, aceptas nuestros Términos de Servicio y Política de Privacidad
			</p>
		</form>
	);
}
