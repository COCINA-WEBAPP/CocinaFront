/**
 * Página de Login/Registro
 * 
 * Permite a los usuarios iniciar sesión o crear una cuenta nueva
 * Usa tabs para alternar entre Login y Registro
 */

"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./components/Login";
import { RegisterForm } from "./components/Register";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
	const [activeTab, setActiveTab] = useState("login");
	const searchParams = useSearchParams();

	useEffect(() => {
		const tab = searchParams.get("tab");
		if (tab === "register" || tab === "login") {
			setActiveTab(tab);
		}
	}, [searchParams]);

	return (
		<div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-center">
						Bienvenido a RecipeShare
					</CardTitle>
					<CardDescription className="text-center">
						Inicia sesión o crea una cuenta para comenzar
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className="grid w-full grid-cols-2 mb-6">
							<TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
							<TabsTrigger value="register">Registrarse</TabsTrigger>
						</TabsList>

						<TabsContent value="login">
							<LoginForm />
						</TabsContent>

						<TabsContent value="register">
							<RegisterForm onSuccess={() => setActiveTab("login")} />
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
