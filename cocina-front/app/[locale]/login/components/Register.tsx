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
import { useTranslations } from "next-intl";

interface RegisterFormProps {
	onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
	const t = useTranslations("Register");
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
			setError(t("passwordMismatch"));
			setIsLoading(false);
			return;
		}

		// Validación de longitud de contraseña
		if (formData.password.length < 6) {
			setError(t("passwordLength"));
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
			setError(err instanceof Error ? err.message : t("registerError"));
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
						{t("successMessage")}
					</AlertDescription>
				</Alert>
			)}

			<div className="space-y-2">
				<Label htmlFor="fullName">{t("fullName")}</Label>
				<Input
					id="fullName"
					name="fullName"
					type="text"
					placeholder={t("fullNamePlaceholder")}
					value={formData.fullName}
					onChange={handleChange}
					required
					disabled={isLoading}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="username">{t("username")}</Label>
				<Input
					id="username"
					name="username"
					type="text"
					placeholder={t("usernamePlaceholder")}
					value={formData.username}
					onChange={handleChange}
					required
					disabled={isLoading}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="register-email">{t("email")}</Label>
				<Input
					id="register-email"
					name="email"
					type="email"
					placeholder={t("emailPlaceholder")}
					value={formData.email}
					onChange={handleChange}
					required
					disabled={isLoading}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="register-password">{t("password")}</Label>
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
				<Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
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

			<Button type="submit" className="w-full" disabled={isLoading || success} aria-busy={isLoading}>
				{isLoading ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						{t("creatingAccount")}
					</>
				) : (
					<>
						<UserPlus className="mr-2 h-4 w-4" />
						{t("createAccount")}
					</>
				)}
			</Button>

			{/* Región aria-live para anunciar resultados a lectores de pantalla */}
			<div className="sr-only" aria-live="polite" role="status">
				{success && t("successMessage")}
				{error && error}
			</div>

			<p className="text-xs text-muted-foreground text-center">
				{t("termsNotice")}
			</p>
		</form>
	);
}
