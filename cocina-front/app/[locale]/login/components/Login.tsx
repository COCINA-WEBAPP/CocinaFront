/**
 * Componente de Formulario de Login
 * 
 * Permite a los usuarios iniciar sesión con email y contraseña
 */

"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { login } from "@/lib/services/user";
import { Loader2, LogIn } from "lucide-react";
import { useTranslations } from "next-intl";

export function LoginForm() {
	const t = useTranslations("Login");
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
			setError(err instanceof Error ? err.message : t("loginError"));
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
				<Label htmlFor="email">{t("email")}</Label>
				<Input
					id="email"
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
				<Label htmlFor="password">{t("password")}</Label>
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
					{t("useExample")}
				</button>
				<a href="#" className="text-muted-foreground hover:text-foreground">
					{t("forgotPassword")}
				</a>
			</div>

			<Button type="submit" className="w-full" disabled={isLoading}>
				{isLoading ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						{t("loggingIn")}
					</>
				) : (
					<>
						<LogIn className="mr-2 h-4 w-4" />
						{t("loginButton")}
					</>
				)}
			</Button>

			<div className="text-xs text-muted-foreground text-center pt-2">
				<p className="mb-1">{t("testUsers")}</p>
				<p>{t("testEmails")}</p>
			</div>
		</form>
	);
}
